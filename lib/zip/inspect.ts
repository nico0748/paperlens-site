/**
 * 共有 ZIP の中身を確かめる。ブラウザ（アップロード前）とサーバー（アップロード後）の両方で使う。
 *
 * ZIP 全体は読まない。末尾の「中央ディレクトリ」だけを範囲読み込みしてファイル名の一覧を得る。
 * 題名を出すために note.md だけは中身を読むが、小さいものに限り、件数にも上限を設ける。
 * 形式の決まりは docs/zip-format.md。
 */
import { inflateSync } from "fflate";

/** ZIP の [start, end) のバイトを返す。ブラウザでは File.slice、サーバーではファイルや S3 の範囲読み込み。 */
export type RangeReader = {
  size: number;
  read: (start: number, end: number) => Promise<Uint8Array>;
};

export type PaperSummary = {
  id: string;
  title?: string;
  /** 論文フォルダ直下のファイル名（paper.pdf, note.md など） */
  files: string[];
};

export type ZipSummary = {
  /** vault: papers/<ID>/... の形。single: <ID>/paper.pdf の形（論文フォルダ 1 本） */
  layout: "vault" | "single";
  papers: PaperSummary[];
  hasTemplates: boolean;
  fileCount: number;
  /** 展開したときの合計バイト数（中央ディレクトリの申告値） */
  uncompressedSize: number;
};

export type InspectResult = { ok: true; summary: ZipSummary } | { ok: false; errors: string[] };

const SIG_EOCD = 0x06054b50;
const SIG_ZIP64_LOCATOR = 0x07064b50;
const SIG_ZIP64_EOCD = 0x06064b50;
const SIG_CENTRAL = 0x02014b50;
const SIG_LOCAL = 0x04034b50;

const MAX_ENTRIES = 50_000;
const MAX_CENTRAL_DIR_BYTES = 32 * 1024 * 1024;
const MAX_TITLE_READS = 60;
const MAX_NOTE_BYTES = 512 * 1024;
const MAX_ERRORS = 10;

type Entry = {
  name: string;
  isDir: boolean;
  method: number;
  encrypted: boolean;
  compressedSize: number;
  size: number;
  localOffset: number;
};

class ZipFormatError extends Error {}

function u16(b: Uint8Array, o: number) {
  return b[o] | (b[o + 1] << 8);
}
function u32(b: Uint8Array, o: number) {
  return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16)) + b[o + 3] * 0x1000000;
}
function u64(b: Uint8Array, o: number) {
  return u32(b, o) + u32(b, o + 4) * 0x100000000;
}

const utf8 = new TextDecoder("utf-8", { fatal: false });

async function readCentralDirectory(r: RangeReader): Promise<Entry[]> {
  if (r.size < 22) throw new ZipFormatError("ZIP ファイルではありません（小さすぎます）。");
  const tailStart = Math.max(0, r.size - (22 + 0xffff));
  const tail = await r.read(tailStart, r.size);
  let eocd = -1;
  for (let i = tail.length - 22; i >= 0; i--) {
    if (u32(tail, i) === SIG_EOCD) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new ZipFormatError("ZIP ファイルではありません（終端の目印が見つかりません）。");

  let total = u16(tail, eocd + 10);
  let cdSize = u32(tail, eocd + 12);
  let cdOffset = u32(tail, eocd + 16);

  if (total === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) {
    // ZIP64。直前の locator から ZIP64 の終端レコードを探す
    const locAbs = tailStart + eocd - 20;
    if (locAbs < 0) throw new ZipFormatError("ZIP64 の情報が壊れています。");
    const loc = await r.read(locAbs, locAbs + 20);
    if (u32(loc, 0) !== SIG_ZIP64_LOCATOR) throw new ZipFormatError("ZIP64 の情報が壊れています。");
    const recAbs = u64(loc, 8);
    const rec = await r.read(recAbs, recAbs + 56);
    if (u32(rec, 0) !== SIG_ZIP64_EOCD) throw new ZipFormatError("ZIP64 の情報が壊れています。");
    total = u64(rec, 32);
    cdSize = u64(rec, 40);
    cdOffset = u64(rec, 48);
  }

  if (total > MAX_ENTRIES) throw new ZipFormatError(`ファイルが多すぎます（${MAX_ENTRIES} 個まで）。`);
  if (cdSize > MAX_CENTRAL_DIR_BYTES || cdOffset + cdSize > r.size) {
    throw new ZipFormatError("ZIP の目次が壊れています。");
  }

  const cd = await r.read(cdOffset, cdOffset + cdSize);
  const entries: Entry[] = [];
  let p = 0;
  for (let i = 0; i < total; i++) {
    if (p + 46 > cd.length || u32(cd, p) !== SIG_CENTRAL) throw new ZipFormatError("ZIP の目次が壊れています。");
    const flags = u16(cd, p + 8);
    const method = u16(cd, p + 10);
    let compressedSize = u32(cd, p + 20);
    let size = u32(cd, p + 24);
    const nameLen = u16(cd, p + 28);
    const extraLen = u16(cd, p + 30);
    const commentLen = u16(cd, p + 32);
    let localOffset = u32(cd, p + 42);
    const name = utf8.decode(cd.subarray(p + 46, p + 46 + nameLen));

    // ZIP64 の拡張フィールド（0x0001）。0xffffffff の項目だけがこの順に入る
    let e = p + 46 + nameLen;
    const extraEnd = e + extraLen;
    while (e + 4 <= extraEnd) {
      const id = u16(cd, e);
      const len = u16(cd, e + 2);
      if (id === 0x0001) {
        let q = e + 4;
        if (size === 0xffffffff) { size = u64(cd, q); q += 8; }
        if (compressedSize === 0xffffffff) { compressedSize = u64(cd, q); q += 8; }
        if (localOffset === 0xffffffff) { localOffset = u64(cd, q); q += 8; }
      }
      e += 4 + len;
    }

    entries.push({
      name,
      isDir: name.endsWith("/"),
      method,
      encrypted: (flags & 1) === 1,
      compressedSize,
      size,
      localOffset,
    });
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

/** macOS の Finder などが勝手に入れる、無視してよいもの */
function isJunk(name: string) {
  return name.startsWith("__MACOSX/") || /(^|\/)\.DS_Store$/.test(name) || /(^|\/)Thumbs\.db$/i.test(name);
}

/** パスとして安全かを確かめる。問題があれば理由を返す */
function unsafePathReason(name: string): string | null {
  if (name.length === 0) return "名前の無いファイルがあります。";
  if (/[\u0000-\u001f]/.test(name)) return `制御文字を含むパスがあります: ${JSON.stringify(name)}`;
  if (name.includes("\\")) return `「\\」を含むパスがあります: ${name}`;
  if (name.startsWith("/") || /^[A-Za-z]:/.test(name)) return `絶対パスがあります: ${name}`;
  const segs = name.replace(/\/$/, "").split("/");
  if (segs.some((s) => s === ".." || s === ".")) return `「..」を含むパスがあります: ${name}`;
  if (segs.some((s) => s === "")) return `空のフォルダ名を含むパスがあります: ${name}`;
  return null;
}

function isValidPaperId(id: string) {
  return id.length > 0 && id.length <= 200 && !id.startsWith(".");
}

async function readEntry(r: RangeReader, e: Entry): Promise<Uint8Array | null> {
  if (e.encrypted || e.size > MAX_NOTE_BYTES || e.compressedSize > MAX_NOTE_BYTES) return null;
  const head = await r.read(e.localOffset, e.localOffset + 30);
  if (u32(head, 0) !== SIG_LOCAL) return null;
  const start = e.localOffset + 30 + u16(head, 26) + u16(head, 28);
  const raw = await r.read(start, start + e.compressedSize);
  if (e.method === 0) return raw;
  if (e.method === 8) return inflateSync(raw, { out: new Uint8Array(e.size) });
  return null;
}

/** note.md の frontmatter から title を拾う（YAML を全部は解釈しない） */
export function titleFromNote(text: string): string | undefined {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return undefined;
  const line = /^title:[ \t]*(.*)$/m.exec(m[1]);
  if (!line) return undefined;
  let v = line[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
    v = v.replace(/\\"/g, '"').replace(/''/g, "'");
  }
  v = v.trim();
  return v ? v.slice(0, 300) : undefined;
}

export async function inspectZip(r: RangeReader): Promise<InspectResult> {
  let entries: Entry[];
  try {
    entries = await readCentralDirectory(r);
  } catch (err) {
    if (err instanceof ZipFormatError) return { ok: false, errors: [err.message] };
    return { ok: false, errors: ["ZIP を読めませんでした。ファイルが壊れていないか確かめてください。"] };
  }

  const errors: string[] = [];
  const addError = (m: string) => {
    if (errors.length < MAX_ERRORS && !errors.includes(m)) errors.push(m);
  };

  const files: Entry[] = [];
  for (const e of entries) {
    const reason = unsafePathReason(e.name);
    if (reason) {
      addError(reason);
      continue;
    }
    if (isJunk(e.name) || e.isDir) continue;
    if (e.encrypted) addError(`パスワード付きのファイルは扱えません: ${e.name}`);
    files.push(e);
  }
  if (errors.length) return { ok: false, errors };
  if (files.length === 0) return { ok: false, errors: ["ZIP が空です。"] };

  // 形を見分ける。papers/ か _templates/ で始まるものがあれば保管庫の形とみなす
  const vaultLike = files.some((f) => f.name.startsWith("papers/") || f.name.startsWith("_templates/"));
  const layout: ZipSummary["layout"] = vaultLike ? "vault" : "single";

  const papers = new Map<string, { files: string[]; note?: Entry }>();
  let hasTemplates = false;
  const topDirs = new Set<string>();

  for (const f of files) {
    const segs = f.name.split("/");
    let id: string | undefined;
    let rest: string[] = [];
    if (layout === "vault") {
      if (segs[0] === "_templates" && segs.length >= 2) {
        hasTemplates = true;
        continue;
      }
      if (segs[0] === "papers" && segs.length >= 3) {
        id = segs[1];
        rest = segs.slice(2);
      } else {
        addError(`papers/ と _templates/ の外にファイルがあります: ${f.name}`);
        continue;
      }
    } else {
      if (segs.length < 2) {
        addError(`論文フォルダの外にファイルがあります: ${f.name}`);
        continue;
      }
      topDirs.add(segs[0]);
      id = segs[0];
      rest = segs.slice(1);
    }
    if (!isValidPaperId(id)) {
      addError(`論文フォルダの名前が使えません: ${id}`);
      continue;
    }
    const p = papers.get(id) ?? { files: [] };
    const rel = rest.join("/");
    p.files.push(rel);
    if (rel === "note.md") p.note = f;
    papers.set(id, p);
  }

  if (layout === "single" && topDirs.size > 1) {
    addError(
      "論文フォルダが複数あります。複数の論文をまとめるときは papers/<論文ID>/ の形にしてください。",
    );
  }

  for (const [id, p] of papers) {
    if (!p.files.includes("paper.pdf")) addError(`paper.pdf がありません: ${id}`);
  }
  if (papers.size === 0 && !errors.length) addError("論文フォルダ（paper.pdf を含むフォルダ）がありません。");
  if (errors.length) return { ok: false, errors };

  const summaries: PaperSummary[] = [];
  let reads = 0;
  for (const [id, p] of [...papers].sort((a, b) => a[0].localeCompare(b[0]))) {
    let title: string | undefined;
    if (p.note && reads < MAX_TITLE_READS) {
      reads++;
      try {
        const bytes = await readEntry(r, p.note);
        if (bytes) title = titleFromNote(utf8.decode(bytes));
      } catch {
        // 題名は出せなくてもよい
      }
    }
    summaries.push({ id, title, files: p.files.sort() });
  }

  return {
    ok: true,
    summary: {
      layout,
      papers: summaries,
      hasTemplates,
      fileCount: files.length,
      uncompressedSize: files.reduce((s, f) => s + f.size, 0),
    },
  };
}

/** ブラウザの File / Blob 用の RangeReader */
export function blobReader(blob: Blob): RangeReader {
  return {
    size: blob.size,
    read: async (start, end) => new Uint8Array(await blob.slice(start, end).arrayBuffer()),
  };
}
