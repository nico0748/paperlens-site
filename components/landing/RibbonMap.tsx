import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { featureHref, type FeatureSlug } from "@/lib/site";
import {
  ArrowRightIcon,
  CircleHelpIcon,
  FilesIcon,
  ListChecksIcon,
  PanelRightIcon,
  PresentationIcon,
  SearchIcon,
  SettingsIcon,
  WaypointsIcon,
} from "../icons";

/** アプリの左端のアイコン（上から）と、それぞれの詳細ページ */
const RIBBON: { Icon: typeof FilesIcon; slug: FeatureSlug; hash?: string }[] = [
  { Icon: FilesIcon, slug: "library-search", hash: "library" },
  { Icon: SearchIcon, slug: "library-search", hash: "search" },
  { Icon: ListChecksIcon, slug: "wordbook-graph", hash: "wordbook" },
  { Icon: WaypointsIcon, slug: "wordbook-graph", hash: "graph" },
  { Icon: PresentationIcon, slug: "slides-link" },
];
const EXTRA = [SettingsIcon, CircleHelpIcon];

/**
 * 画面の見取り図（淡い地）。ヘッダーの「機能」が指す場所（#features）。
 * 上: アプリの左端のアイコン 5 つをカードにする（アイコン・名前・1 文・「機能を詳しく見る」）。設定とヘルプは下に小さく。
 * 下: 右側の補足情報のタブ 4 つ。
 * アイコンの枠はアプリの左端と同じ暗い色にして、アプリのどこに当たるかを見せる。
 */
export function RibbonMap({ lang, t, kicker }: { lang: Locale; t: Dictionary["map"]; kicker: string }) {
  return (
    <section id="features" className="lp-section lp-tint theme-light" aria-labelledby="features-title">
      <div className="container">
        <header className="lp-section-head" data-reveal>
          <p className="lp-kicker">{kicker}</p>
          <h2 id="features-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{t.lead}</p>
        </header>

        <div className="lp-map">
          <div className="lp-map-main">
            <h3 className="lp-map-title">{t.ribbonTitle}</h3>
            <ul className="lp-ribbon-grid" role="list">
              {RIBBON.map(({ Icon, slug, hash }, i) => {
                const item = t.ribbon[i];
                return (
                  <li key={item.label} className="lp-ribbon-card" data-reveal style={{ "--i": i } as React.CSSProperties}>
                    <div className="lp-ribbon-body">
                      <span className="lp-ribbon-icon" aria-hidden="true">
                        <Icon size={22} />
                      </span>
                      <h4 className="lp-ribbon-label">{item.label}</h4>
                      <p className="lp-ribbon-desc">{item.desc}</p>
                    </div>
                    <Link href={featureHref(lang, slug, hash)} className="lp-ribbon-link">
                      {t.more}
                      <span className="visually-hidden">{lang === "ja" ? `（${item.label}）` : ` (${item.label})`}</span>
                      <ArrowRightIcon size={16} />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="lp-ribbon-extra" role="list">
              {t.extra.map((item, i) => {
                const Icon = EXTRA[i];
                return (
                  <li key={item.label}>
                    <Icon size={18} />
                    <span>
                      <strong>{item.label}</strong> {item.desc}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="lp-tabs-panel" data-reveal>
              <div className="lp-tabs-head">
                <span className="lp-icon-tile lp-icon-tile-sm" aria-hidden="true">
                  <PanelRightIcon size={20} />
                </span>
                <h3 className="lp-map-title">{t.tabsTitle}</h3>
              </div>
              <dl className="lp-tabs-list">
                {t.tabs.map((tab) => (
                  <div key={tab.label}>
                    <dt>{tab.label}</dt>
                    <dd>{tab.desc}</dd>
                  </div>
                ))}
              </dl>
              <Link href={featureHref(lang, "supplement")} className="lp-more">
                {t.tabsMore}
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
