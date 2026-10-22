import { auth } from "@/auth";
import { isAdminLogin } from "@/lib/access";

export type Viewer = { login: string; name?: string | null; isAdmin: boolean };

/** 今のログイン中の人。ログインしていなければ null */
export async function getViewer(): Promise<Viewer | null> {
  const session = await auth();
  const login = session?.user?.login;
  if (!session?.user || !login) return null;
  return { login, name: session.user.name, isAdmin: isAdminLogin(login) };
}

export function jsonError(status: number, message: string) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * 書き換えの API は同じサイトからの呼び出しだけを受ける。
 * Cookie は SameSite=Lax なので普通は届かないが、Origin も念のため確かめる。
 */
export function isSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // 同一オリジンの fetch でも付かないことがある（GET 以外では普通は付く）
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** 管理者だけが通れる。通れないときは返すべき Response を返す */
export async function requireAdmin(req: Request): Promise<{ viewer: Viewer } | { response: Response }> {
  if (!isSameOrigin(req)) return { response: jsonError(403, "別のサイトからの操作は受け付けません。") };
  const viewer = await getViewer();
  if (!viewer) return { response: jsonError(401, "ログインしてください。") };
  if (!viewer.isAdmin) return { response: jsonError(403, "アップロードと削除は管理者だけができます。") };
  return { viewer };
}
