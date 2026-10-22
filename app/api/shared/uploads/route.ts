import { maxUploadBytes, storage } from "@/lib/storage";
import { jsonError, requireAdmin } from "@/lib/viewer";

/**
 * アップロードの予約。ID はここで作り、ファイル本体を送る先（UploadTarget）を返す。
 * local: このサーバーの PUT /api/shared/uploads/<id>。s3: 署名付き PUT URL（ストレージへ直接送る）。
 */
export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if ("response" in gate) return gate.response;

  let body: { size?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "リクエストの形が正しくありません。");
  }
  const size = Number(body.size);
  if (!Number.isInteger(size) || size <= 0) return jsonError(400, "ファイルの大きさが正しくありません。");
  const max = maxUploadBytes();
  if (size > max) return jsonError(413, `ファイルが大きすぎます（${Math.floor(max / 1024 / 1024)} MB まで）。`);

  const id = crypto.randomUUID();
  const upload = await storage().createUpload(id, size, gate.viewer.login);
  return Response.json({ id, upload }, { headers: { "Cache-Control": "no-store" } });
}
