/** ID はサーバーが crypto.randomUUID() で作る。外から来た ID はこの形でなければ使わない */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function isValidId(id: unknown): id is string {
  return typeof id === "string" && UUID_RE.test(id);
}

export function maxUploadBytes() {
  const mb = Number(process.env.MAX_UPLOAD_MB ?? "200");
  return (Number.isFinite(mb) && mb > 0 ? mb : 200) * 1024 * 1024;
}

/** ダウンロード時のファイル名。パスや制御文字を落とし、末尾を .zip にそろえる */
export function safeFilename(name: string | undefined, fallback: string) {
  let base = (name ?? "").split(/[\\/]/).pop() ?? "";
  base = base.replace(/[\u0000-\u001f\u007f"<>|:*?]/g, "").trim().slice(0, 150);
  if (!base || base === "." || base === "..") base = fallback;
  if (!/\.zip$/i.test(base)) base += ".zip";
  return base;
}

/** Content-Disposition（日本語のファイル名も通す） */
export function contentDisposition(filename: string) {
  const ascii = filename.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export function zipKey(id: string) {
  return `items/${id}.zip`;
}
export function metaKey(id: string) {
  return `items/${id}.json`;
}
