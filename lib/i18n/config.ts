/** 表示する言語。URL の先頭（/ja/…、/en/…）で切り替える */
export const locales = ["ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ja";

/** 最後に見た言語を覚えておく Cookie。言語の無い URL（/ や /login）に来たときに使う */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function hasLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** 言語ごとの表示名。言語の切り替えでは、その言語自身の名前で出す */
export const localeNames: Record<Locale, string> = { ja: "日本語", en: "English" };

/** Intl に渡すロケール */
export const intlLocale: Record<Locale, string> = { ja: "ja-JP", en: "en-US" };

/**
 * Accept-Language から言語を選ぶ。q の高い順に見て、最初に合ったものを使う。
 * 見出しが無いときは日本語、あっても ja・en のどちらも無いときは英語にする。
 */
export function pickLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(",")
    .map((part, i) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { tag, q: q ? Number(q.slice(2)) || 0 : 1, i };
    })
    .filter((x) => x.tag && x.q > 0)
    .sort((a, b) => b.q - a.q || a.i - b.i);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (hasLocale(base)) return base;
  }
  return "en";
}

/** 今のパスの言語の部分だけを差し替える（/ja/shared → /en/shared） */
export function switchLocalePath(pathname: string, to: Locale) {
  const segs = pathname.split("/");
  if (hasLocale(segs[1])) segs[1] = to;
  else segs.splice(1, 0, to);
  const path = segs.join("/");
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
}

/** "{name} を削除" のような雛形に値を入れる。クライアントでも使う */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => (key in values ? String(values[key]) : m));
}
