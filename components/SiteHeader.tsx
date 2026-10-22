import Link from "next/link";
import { auth, signOut } from "@/auth";

async function currentUser() {
  try {
    return (await auth())?.user ?? null;
  } catch {
    // ログインの設定が無い環境（AUTH_SECRET 未設定など）でもヘッダーは出す
    return null;
  }
}

export async function SiteHeader() {
  const user = await currentUser();

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand">
          <img src="/brand/icon.svg" alt="" width={32} height={32} />
          PaperLens
        </Link>
        <nav className="site-nav" aria-label="サイト内">
          <Link href="/#features">機能</Link>
          <Link href="/#download">ダウンロード</Link>
          <Link href="/shared">共有データ</Link>
          <a href="https://github.com/nico0748/LogiXiv">GitHub</a>
          {user ? (
            <form action={logout}>
              <button type="submit" className="nav-button">
                ログアウト
              </button>
            </form>
          ) : (
            <Link href="/login">ログイン</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
