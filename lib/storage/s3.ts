import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { RangeReader } from "@/lib/zip/inspect";
import { contentDisposition, isValidId, metaKey, zipKey } from "./common";
import type { SharedItem, StorageDriver, UploadTarget } from "./types";

const UPLOAD_URL_TTL = 10 * 60; // 秒
const DOWNLOAD_URL_TTL = 60; // 秒

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`環境変数 ${name} が設定されていません（STORAGE_DRIVER=s3）。`);
  return v;
}

/**
 * S3 互換のオブジェクトストレージ（AWS S3・Cloudflare R2・MinIO など）。
 * ブラウザは署名付き URL で直接 PUT / GET するので、ファイル本体はこのサーバーを通らない。
 */
export class S3Storage implements StorageDriver {
  readonly kind = "s3" as const;
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor() {
    this.bucket = required("S3_BUCKET");
    const endpoint = process.env.S3_ENDPOINT || undefined;
    this.client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint,
      forcePathStyle: Boolean(endpoint),
      credentials: {
        accessKeyId: required("S3_ACCESS_KEY_ID"),
        secretAccessKey: required("S3_SECRET_ACCESS_KEY"),
      },
      // 新しい SDK は既定でチェックサムのヘッダーを足し、ブラウザからの PUT や R2 と噛み合わない
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
  }

  async list(): Promise<SharedItem[]> {
    const keys: string[] = [];
    let token: string | undefined;
    do {
      const res = await this.client.send(
        new ListObjectsV2Command({ Bucket: this.bucket, Prefix: "items/", ContinuationToken: token }),
      );
      for (const o of res.Contents ?? []) if (o.Key?.endsWith(".json")) keys.push(o.Key);
      token = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (token);
    const items = await Promise.all(keys.map((k) => this.get(k.slice("items/".length, -".json".length))));
    return items.filter((x): x is SharedItem => x !== null);
  }

  async get(id: string): Promise<SharedItem | null> {
    if (!isValidId(id)) return null;
    try {
      const res = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: metaKey(id) }));
      const text = await res.Body?.transformToString("utf-8");
      return text ? (JSON.parse(text) as SharedItem) : null;
    } catch {
      return null;
    }
  }

  async putMeta(item: SharedItem) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: metaKey(item.id),
        Body: JSON.stringify(item, null, 2),
        ContentType: "application/json",
      }),
    );
  }

  async remove(id: string) {
    if (!isValidId(id)) return;
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: metaKey(id) }));
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: zipKey(id) }));
  }

  async statZip(id: string) {
    if (!isValidId(id)) return null;
    try {
      const res = await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: zipKey(id) }));
      return { size: res.ContentLength ?? 0 };
    } catch {
      return null;
    }
  }

  zipReader(id: string, size: number): RangeReader {
    return {
      size,
      read: async (start, end) => {
        const last = Math.min(end, size) - 1;
        if (last < start) return new Uint8Array(0);
        const res = await this.client.send(
          new GetObjectCommand({ Bucket: this.bucket, Key: zipKey(id), Range: `bytes=${start}-${last}` }),
        );
        return (await res.Body?.transformToByteArray()) ?? new Uint8Array(0);
      },
    };
  }

  async createUpload(id: string, size: number): Promise<UploadTarget> {
    const url = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: zipKey(id),
        ContentType: "application/zip",
        ContentLength: size,
      }),
      { expiresIn: UPLOAD_URL_TTL },
    );
    return { method: "PUT", url, headers: { "Content-Type": "application/zip" } };
  }

  async downloadResponse(item: SharedItem): Promise<Response> {
    const url = await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: zipKey(item.id),
        ResponseContentType: "application/zip",
        ResponseContentDisposition: contentDisposition(item.filename),
      }),
      { expiresIn: DOWNLOAD_URL_TTL },
    );
    return new Response(null, {
      status: 302,
      headers: { Location: url, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" },
    });
  }
}
