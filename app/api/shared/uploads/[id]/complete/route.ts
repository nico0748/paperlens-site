import { revalidatePath } from "next/cache";
import { isValidId, maxUploadBytes, safeFilename, storage, type SharedItem } from "@/lib/storage";
import { inspectZip } from "@/lib/zip/inspect";
import { jsonError, requireAdmin } from "@/lib/viewer";

const MAX_TITLE = 120;
const MAX_DESCRIPTION = 2000;
const MAX_PAPERS_IN_META = 500;

/**
 * アップロードの仕上げ。届いた ZIP をサーバー側でも確かめ（中央ディレクトリだけを範囲読み込み）、
 * 問題が無ければメタデータ（items/<id>.json）を書く。これで一覧に出る。
 * 中身の要約はクライアントの申告を使わず、ここで読み直したものを保存する。
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin(req);
  if ("response" in gate) return gate.response;

  const { id } = await ctx.params;
  if (!isValidId(id)) return jsonError(400, "ID が正しくありません。");

  let body: { title?: unknown; description?: unknown; filename?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "リクエストの形が正しくありません。");
  }
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (!title) return jsonError(400, "題名を入力してください。");
  if (title.length > MAX_TITLE) return jsonError(400, `題名は ${MAX_TITLE} 文字以内にしてください。`);
  if (description.length > MAX_DESCRIPTION) {
    return jsonError(400, `説明は ${MAX_DESCRIPTION} 文字以内にしてください。`);
  }

  const store = storage();
  if (await store.get(id)) return jsonError(409, "このアップロードは既に登録されています。");
  const stat = await store.statZip(id);
  if (!stat) return jsonError(409, "ファイルがまだ届いていません。");
  if (stat.size > maxUploadBytes()) {
    await store.remove(id);
    return jsonError(413, "ファイルが大きすぎます。");
  }

  const result = await inspectZip(store.zipReader(id, stat.size));
  if (!result.ok) {
    await store.remove(id);
    return jsonError(422, `ZIP の形が正しくありません。${result.errors.join(" ")}`);
  }
  const s = result.summary;

  const item: SharedItem = {
    id,
    title,
    description,
    filename: safeFilename(typeof body.filename === "string" ? body.filename : undefined, `paperlens-${id.slice(0, 8)}`),
    size: stat.size,
    sha256: await store.uploadedSha256?.(id),
    uploadedBy: gate.viewer.login,
    uploadedAt: new Date().toISOString(),
    layout: s.layout,
    papers: s.papers.slice(0, MAX_PAPERS_IN_META).map((p) => ({ id: p.id, title: p.title })),
    paperCount: s.papers.length,
    hasTemplates: s.hasTemplates,
  };
  await store.putMeta(item);
  revalidatePath("/shared");
  return Response.json({ item }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
