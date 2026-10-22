import { isValidId, storage } from "@/lib/storage";
import { getViewer, jsonError } from "@/lib/viewer";

/** ログインした人だけがダウンロードできる。local は本体を流し、s3 は短い期限の署名付き URL へ転送する */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const viewer = await getViewer();
  if (!viewer) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", "/shared");
    return Response.redirect(url, 303);
  }
  if (!isValidId(id)) return jsonError(404, "見つかりません。");
  const item = await storage().get(id);
  if (!item) return jsonError(404, "見つかりません。");
  try {
    return await storage().downloadResponse(item);
  } catch {
    return jsonError(404, "ファイルが見つかりません。");
  }
}
