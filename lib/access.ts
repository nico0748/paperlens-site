/** ログイン名（GitHub のユーザー名）による権限の判定。大文字小文字は区別しない */

function parseLogins(value: string | undefined) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

/** アップロード・削除ができる人（ADMIN_GITHUB_LOGINS） */
export function isAdminLogin(login: string | null | undefined) {
  if (!login) return false;
  return parseLogins(process.env.ADMIN_GITHUB_LOGINS).has(login.toLowerCase());
}

/** ログインしてよい人。ALLOWED_GITHUB_LOGINS が空なら誰でもよい（管理者は常に許す） */
export function isAllowedLogin(login: string | null | undefined) {
  if (!login) return false;
  const allowed = parseLogins(process.env.ALLOWED_GITHUB_LOGINS);
  if (allowed.size === 0) return true;
  return allowed.has(login.toLowerCase()) || isAdminLogin(login);
}

/** 開発用のログイン（GitHub を使わずに名前だけで入る）を有効にするか */
export function devLoginEnabled() {
  return process.env.AUTH_DEV_LOGIN === "1" && process.env.NODE_ENV !== "production";
}

/** ログイン後の戻り先。サイト内のパスだけを許す */
export function safeCallbackUrl(value: unknown, fallback = "/shared") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
