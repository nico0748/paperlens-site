import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { featureHref, type FeatureSlug } from "@/lib/site";
import { featureConfig } from "./data";
import { getFeaturesDictionary } from "./dict";
import { stageFor } from "./stages";

/**
 * 機能のカード（一覧のページと「関連する機能」）。見出しのリンクをカード全体に広げる。
 * thumb のときは、その機能の画面写真（最初の場面の画像）を上に置く。
 */
export function FeatureCard({
  slug,
  lang,
  thumb = false,
  headingLevel = 3,
  i = 0,
}: {
  slug: FeatureSlug;
  lang: "ja" | "en";
  thumb?: boolean;
  headingLevel?: 2 | 3;
  i?: number;
}) {
  const t = getFeaturesDictionary(lang);
  const p = t.pages[slug];
  const Icon = featureConfig[slug].icon;
  const H = headingLevel === 2 ? "h2" : "h3";
  const stage = thumb ? stageFor(slug) : null;
  return (
    <li className="fp-card" data-fp-reveal style={{ "--i": i } as React.CSSProperties}>
      {stage && (
        <div className="fp-card-thumb" aria-hidden="true">
          <img src={stage.src} alt="" width={stage.width} height={stage.height} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="fp-card-body">
        <p className="fp-card-kicker">
          <span className="fp-icon-tile">
            <Icon size={20} />
          </span>
          {p.appLabel}
        </p>
        <H className="fp-card-title">
          <Link href={featureHref(lang, slug)} className="fp-card-link">
            {p.title}
          </Link>
        </H>
        <p className="fp-card-line">{p.cardLine}</p>
        <p className="fp-card-more" aria-hidden="true">
          {t.ui.more}
          <ArrowRightIcon size={18} />
        </p>
      </div>
    </li>
  );
}
