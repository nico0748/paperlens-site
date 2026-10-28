/** サイト全体で使うリンクと表記。リポジトリやリリースの置き場が変わったらここだけ直す。 */
export const site = {
  name: "PaperLens",
  tagline: "スライドと論文と補足情報を、論文を軸につなぐ",
  repo: "https://github.com/nico0748/LogiXiv",
  releases: "https://github.com/nico0748/LogiXiv/releases",
  latestRelease: "https://github.com/nico0748/LogiXiv/releases/latest",
  issues: "https://github.com/nico0748/LogiXiv/issues",
  sourceZip: "https://github.com/nico0748/LogiXiv/archive/refs/heads/main.zip",
  license: "MIT",
} as const;

/**
 * 機能の詳細ページ（/{lang}/features/{slug}）。並びはメニューとトップページの順（輪講が先）。
 * 表示名は辞書の featureNav.items[slug] にある。
 */
/**
 * プレリリース準備中。安全性の確認が済むまで、アプリ（.dmg）の配布と、ログイン・共有データ・アップロードを止めておく。
 * 公開するときは、環境変数 PAPERLENS_PRERELEASE=off を設定する（コードは変えなくてよい）。
 */
export const prerelease = process.env.PAPERLENS_PRERELEASE !== "off";

export const featureSlugs = ["slides-link", "supplement", "wordbook-graph", "mcp", "library-search"] as const;
export type FeatureSlug = (typeof featureSlugs)[number];

export function featureHref(lang: string, slug?: FeatureSlug, hash?: string) {
  return `/${lang}/features${slug ? `/${slug}` : ""}${hash ? `#${hash}` : ""}`;
}
