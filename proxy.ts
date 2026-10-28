import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, hasLocale, pickLocale } from "@/lib/i18n/config";
import { prerelease } from "@/lib/site";

/**
 * ページの URL には必ず言語（/ja/…、/en/…）を付ける。
 * 付いていなければ、前に選んだ言語（Cookie）か、ブラウザの言語の設定で決めて転送する。
 * ログインの転送先（/login）や古いリンク（/shared）もここで言語付きに直る。
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // プレリリース準備中は、ログインと共有データの API を受け付けない（画面だけでなく裏の受付も止める）
  if (pathname.startsWith("/api/")) {
    if (prerelease) return NextResponse.json({ error: "prerelease" }, { status: 503 });
    return NextResponse.next();
  }
  const first = pathname.split("/")[1];

  if (hasLocale(first)) {
    const res = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      res.cookies.set(LOCALE_COOKIE, first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return res;
  }

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const lang = hasLocale(saved) ? saved : pickLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // API・Next.js の内部・拡張子の付いたファイル（アイコンなど）は通さない
  matcher: ["/((?!api/|_next/|.*\\..*).*)", "/api/auth/:path*", "/api/shared/:path*"],
};
