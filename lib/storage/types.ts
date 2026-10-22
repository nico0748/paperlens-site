import type { RangeReader } from "@/lib/zip/inspect";

/** 一覧に出す論文の要約（ZIP の中身から作る） */
export type SharedPaper = { id: string; title?: string };

/** items/<id>.json に保存するメタデータ */
export type SharedItem = {
  id: string;
  title: string;
  description: string;
  /** ダウンロード時のファイル名 */
  filename: string;
  size: number;
  sha256?: string;
  uploadedBy: string;
  uploadedAt: string;
  layout: "vault" | "single";
  papers: SharedPaper[];
  /** papers が長すぎて切り詰めたときの本来の件数 */
  paperCount: number;
  hasTemplates: boolean;
};

/** ブラウザがファイル本体を送る先 */
export type UploadTarget = {
  method: "PUT";
  url: string;
  headers: Record<string, string>;
};

export interface StorageDriver {
  readonly kind: "local" | "s3";
  list(): Promise<SharedItem[]>;
  get(id: string): Promise<SharedItem | null>;
  putMeta(item: SharedItem): Promise<void>;
  /** ZIP とメタデータを消す（どちらかが無くてもよい） */
  remove(id: string): Promise<void>;
  /** アップロード済みの ZIP の大きさ。無ければ null */
  statZip(id: string): Promise<{ size: number } | null>;
  zipReader(id: string, size: number): RangeReader;
  createUpload(id: string, size: number, uploadedBy: string): Promise<UploadTarget>;
  /** サーバーが受け取りながら計算した SHA-256（分かる保存先だけ） */
  uploadedSha256?(id: string): Promise<string | undefined>;
  /** 認可を確かめた後に呼ぶ。本体を返すか、署名付き URL へ転送する */
  downloadResponse(item: SharedItem): Promise<Response>;
}
