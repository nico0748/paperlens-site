import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { featureHref, featureSlugs, type FeatureSlug } from "@/lib/site";
import { ArrowRightIcon, BotIcon, FilesIcon, ListChecksIcon, PanelRightIcon, PresentationIcon, SearchIcon, WaypointsIcon } from "../icons";

/** 機能ごとのアイコン（アプリの左端の帯・右側の帯と同じ絵柄）。並びはメニュー・フッターと同じ featureSlugs の順 */
export const FEATURE_ICONS: Record<FeatureSlug, (typeof FilesIcon)[]> = {
  "slides-link": [PresentationIcon],
  supplement: [PanelRightIcon],
  "wordbook-graph": [ListChecksIcon, WaypointsIcon],
  mcp: [BotIcon],
  "library-search": [FilesIcon, SearchIcon],
};

/**
 * アイコンで見る機能（淡い地）。ヘッダーの「機能」が指す場所（#features）。
 * 5 つの機能を 1 列のカードにする: アイコン・名前・アプリでの表記・1 文。カード全体が詳細ページへのリンク。
 */
export function FeatureIndex({ lang, t }: { lang: Locale; t: Dictionary["index"] }) {
  return (
    <section id="features" className="lp-section lp-index-section lp-tint theme-light" aria-labelledby="features-title">
      <div className="container">
        <header className="lp-section-head lp-section-head-tight" data-reveal>
          <h2 id="features-title" className="lp-h2 lp-h2-sm">
            {t.title}
          </h2>
          <p className="lp-section-lead">{t.lead}</p>
        </header>
        <ul className="lp-index" role="list">
          {featureSlugs.map((slug, i) => {
            const item = t.items[slug];
            return (
              <li key={slug} className="lp-index-card" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <span className="lp-index-icons" aria-hidden="true">
                  {FEATURE_ICONS[slug].map((Icon, j) => (
                    <span key={j} className="lp-icon-tile">
                      <Icon size={22} />
                    </span>
                  ))}
                </span>
                <div className="lp-index-text">
                  <h3 className="lp-index-label">
                    <Link href={featureHref(lang, slug)} className="lp-index-link">
                      {item.label}
                    </Link>
                  </h3>
                  <p className="lp-index-app">{item.app}</p>
                  <p className="lp-index-desc">{item.desc}</p>
                </div>
                <ArrowRightIcon size={18} className="lp-index-arrow" />
              </li>
            );
          })}
        </ul>
        <p className="lp-index-all">
          <Link href={featureHref(lang)} className="lp-more">
            {t.all}
            <ArrowRightIcon size={16} />
          </Link>
        </p>
      </div>
    </section>
  );
}
