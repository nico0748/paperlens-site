import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import type { RangeReader } from "@/lib/zip/inspect";
import { contentDisposition, isValidId, maxUploadBytes, metaKey, zipKey } from "./common";
import type { SharedItem, StorageDriver, UploadTarget } from "./types";

/** 手元のディスクに置く。開発用と、1 台のサーバーで動かすとき用 */
export class LocalStorage implements StorageDriver {
  readonly kind = "local" as const;
  constructor(private readonly root = path.join(process.cwd(), ".data", "shared")) {}

  private file(key: string) {
    return path.join(this.root, key);
  }
  private pendingFile(id: string) {
    return this.file(`pending/${id}.json`);
  }

  async list(): Promise<SharedItem[]> {
    let names: string[];
    try {
      names = await fs.readdir(this.file("items"));
    } catch {
      return [];
    }
    const items = await Promise.all(
      names
        .filter((n) => n.endsWith(".json"))
        .map((n) => this.get(n.slice(0, -".json".length))),
    );
    return items.filter((x): x is SharedItem => x !== null);
  }

  async get(id: string): Promise<SharedItem | null> {
    if (!isValidId(id)) return null;
    try {
      return JSON.parse(await fs.readFile(this.file(metaKey(id)), "utf8")) as SharedItem;
    } catch {
      return null;
    }
  }

  async putMeta(item: SharedItem) {
    const dest = this.file(metaKey(item.id));
    await fs.mkdir(path.dirname(dest), { recursive: true });
    const tmp = `${dest}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(item, null, 2));
    await fs.rename(tmp, dest);
    await fs.rm(this.pendingFile(item.id), { force: true });
  }

  async remove(id: string) {
    if (!isValidId(id)) return;
    // 一覧から先に消す
    await fs.rm(this.file(metaKey(id)), { force: true });
    await fs.rm(this.file(zipKey(id)), { force: true });
    await fs.rm(this.file(`${zipKey(id)}.part`), { force: true });
    await fs.rm(this.pendingFile(id), { force: true });
  }

  async statZip(id: string) {
    if (!isValidId(id)) return null;
    try {
      const s = await fs.stat(this.file(zipKey(id)));
      return s.isFile() ? { size: s.size } : null;
    } catch {
      return null;
    }
  }

  zipReader(id: string, size: number): RangeReader {
    const file = this.file(zipKey(id));
    return {
      size,
      read: async (start, end) => {
        const fh = await fs.open(file, "r");
        try {
          const len = Math.max(0, Math.min(end, size) - start);
          const buf = new Uint8Array(len);
          let off = 0;
          while (off < len) {
            const { bytesRead } = await fh.read(buf, off, len - off, start + off);
            if (bytesRead === 0) break;
            off += bytesRead;
          }
          return buf.subarray(0, off);
        } finally {
          await fh.close();
        }
      },
    };
  }

  async createUpload(id: string, size: number, uploadedBy: string): Promise<UploadTarget> {
    const pending = this.pendingFile(id);
    await fs.mkdir(path.dirname(pending), { recursive: true });
    await this.sweepPending();
    await fs.writeFile(pending, JSON.stringify({ size, uploadedBy, createdAt: new Date().toISOString() }));
    return {
      method: "PUT",
      url: `/api/shared/uploads/${id}`,
      headers: { "Content-Type": "application/zip" },
    };
  }

  /** 1 日以上たっても仕上がらなかった予約と、書きかけ・登録されなかった ZIP を消す */
  private async sweepPending() {
    const dir = this.file("pending");
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    for (const name of await fs.readdir(dir).catch(() => [] as string[])) {
      const id = name.replace(/\.json$/, "");
      if (!isValidId(id)) continue;
      const st = await fs.stat(path.join(dir, name)).catch(() => null);
      if (!st || st.mtimeMs > cutoff) continue;
      if (await this.get(id)) await fs.rm(path.join(dir, name), { force: true });
      else await this.remove(id);
    }
  }

  /** createUpload で予約した ID だけを受け付け、申告した大きさまでをディスクへ流し込む */
  async writeUpload(id: string, body: ReadableStream<Uint8Array>): Promise<
    { ok: true; size: number; sha256: string } | { ok: false; status: number; message: string }
  > {
    if (!isValidId(id)) return { ok: false, status: 400, message: "ID が正しくありません。" };
    let declared: number;
    try {
      declared = JSON.parse(await fs.readFile(this.pendingFile(id), "utf8")).size;
    } catch {
      return { ok: false, status: 404, message: "アップロードの予約が見つかりません。" };
    }
    if (await this.statZip(id)) return { ok: false, status: 409, message: "この ID には既にファイルがあります。" };

    const limit = Math.min(declared, maxUploadBytes());
    const dest = this.file(zipKey(id));
    const part = `${dest}.part`;
    await fs.mkdir(path.dirname(dest), { recursive: true });

    const hash = createHash("sha256");
    let received = 0;
    let tooLarge = false;
    const reader = body.getReader();
    const fh = await fs.open(part, "wx");
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > limit) {
          tooLarge = true;
          // 読むのをやめる。cancel の失敗（既に閉じている等）は無視する
          reader.cancel().catch(() => {});
          break;
        }
        hash.update(value);
        await fh.write(value);
      }
    } catch {
      await fh.close().catch(() => {});
      await fs.rm(part, { force: true });
      return { ok: false, status: 500, message: "保存に失敗しました。" };
    }
    await fh.close();
    if (tooLarge) {
      await fs.rm(part, { force: true });
      return { ok: false, status: 413, message: "申告より大きいか、上限を超えています。" };
    }
    if (received !== declared) {
      await fs.rm(part, { force: true });
      return { ok: false, status: 400, message: "受け取った大きさが申告と合いません。" };
    }
    await fs.rename(part, dest);
    const sha256 = hash.digest("hex");
    const pending = JSON.parse(await fs.readFile(this.pendingFile(id), "utf8"));
    await fs.writeFile(this.pendingFile(id), JSON.stringify({ ...pending, sha256 }));
    return { ok: true, size: received, sha256 };
  }

  /** writeUpload が受け取りながら計算した SHA-256 */
  async uploadedSha256(id: string): Promise<string | undefined> {
    if (!isValidId(id)) return undefined;
    try {
      const v = JSON.parse(await fs.readFile(this.pendingFile(id), "utf8")).sha256;
      return typeof v === "string" ? v : undefined;
    } catch {
      return undefined;
    }
  }

  async downloadResponse(item: SharedItem): Promise<Response> {
    const file = this.file(zipKey(item.id));
    const stat = await fs.stat(file);
    const stream = Readable.toWeb(createReadStream(file)) as ReadableStream<Uint8Array>;
    return new Response(stream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": String(stat.size),
        "Content-Disposition": contentDisposition(item.filename),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  }
}
