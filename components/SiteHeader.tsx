import Link from "next/link";
import { auth, signOut } from "@/auth";
import type { Dictionary, Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { GitHubIcon } from "./icons";
import { LanguageSelector } from "./LanguageSelector";
import { LoginLink } from "./LoginLink";
import { MobileMenu } from "./MobileMenu";

async function currentUser() {
  try {
    return (await auth())?.user ?? null;
  } catch {
    // ログインの設定が無い環境（AUTH_SECRET 未設定など）でもヘッダーは出す
    return null;
  }
}

/** DADS のヘッダーコンテナに沿う: 左にロゴ、中央にナビゲーション、右に言語の切り替えとログイン */
export async function SiteHeader({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const user = await currentUser();
  const { common, nav } = dict;

  async function logout() {
    "use server";
    await signOut({ redirectTo: `/${lang}` });
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={`/${lang}`} className="brand">
          <img src="/brand/icon-mark.png" alt="" width={32} height={32} />
          {site.name}
        </Link>
        <MobileMenu label={common.menu} closeLabel={common.closeMenu}>
          <nav className="site-nav" aria-label={common.siteNav}>
            <Link href={`/${lang}#features`}>{nav.features}</Link>
            <Link href={`/${lang}#privacy`}>{nav.privacy}</Link>
            <Link href={`/${lang}#download`}>{nav.download}</Link>
            <Link href={`/${lang}/shared`}>{nav.shared}</Link>
          </nav>
          <div className="header-tools">
            <a href={site.repo} className="header-icon-link">
              <GitHubIcon />
              <span>{nav.github}</span>
            </a>
            <LanguageSelector lang={lang} label={common.language} listLabel={common.languageList} />
            {user ? (
              <form action={logout}>
                <button type="submit" className="btn btn-ghost btn-sm">
                  {common.logout}
                </button>
              </form>
            ) : (
              <LoginLink href={`/${lang}/login`} label={common.login} />
            )}
          </div>
        </MobileMenu>
      </div>
    </header>
  );
}
