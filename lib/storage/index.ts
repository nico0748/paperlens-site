import { LocalStorage } from "./local";
import { S3Storage } from "./s3";
import type { StorageDriver } from "./types";

export type { SharedItem, SharedPaper, StorageDriver, UploadTarget } from "./types";
export { isValidId, maxUploadBytes, safeFilename } from "./common";
export { LocalStorage } from "./local";

let cached: StorageDriver | undefined;

/** STORAGE_DRIVER（local / s3）で保存先を選ぶ。既定は local */
export function storage(): StorageDriver {
  if (cached) return cached;
  const kind = (process.env.STORAGE_DRIVER || "local").toLowerCase();
  if (kind === "s3") cached = new S3Storage();
  else if (kind === "local") cached = new LocalStorage();
  else throw new Error(`STORAGE_DRIVER は local か s3 にしてください（今の値: ${kind}）。`);
  return cached;
}

/** 新しい順 */
export async function listShared() {
  const items = await storage().list();
  return items.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}
