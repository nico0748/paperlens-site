import { isValidId, LocalStorage, maxUploadBytes, storage } from "@/lib/storage";
import { jsonError, requireAdmin } from "@/lib/viewer";

/** ファイル本体を受け取ってディスクへ流し込む（STORAGE_DRIVER=local のときだけ） */
export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin(req);
  if ("response" in gate) return gate.response;

  const { id } = await ctx.params;
  if (!isValidId(id)) return jsonError(400, "ID が正しくありません。");

  const store = storage();
  if (!(store instanceof LocalStorage)) {
    return jsonError(404, "この保存先では、ファイルはストレージへ直接送ります。");
  }
  const type = (req.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (type !== "application/zip") return jsonError(415, "Content-Type は application/zip にしてください。");
  if (!req.body) return jsonError(400, "ファイルが空です。");
  const length = Number(req.headers.get("content-length") ?? "0");
  if (length > maxUploadBytes()) return jsonError(413, "ファイルが大きすぎます。");

  const res = await store.writeUpload(id, req.body);
  if (!res.ok) return jsonError(res.status, res.message);
  return Response.json({ id, size: res.size, sha256: res.sha256 }, { headers: { "Cache-Control": "no-store" } });
}
