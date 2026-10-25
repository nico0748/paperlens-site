import "./stage.css";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { featureHref, type FeatureSlug } from "@/lib/site";
import { cropStage, featureConfig } from "./data";
import { getFeaturesDictionary } from "./dict";
import { StageView } from "./StageView";

/**
 * 機能のカード（一覧のページと「ほかの機能」）。見出しのリンクをカード全体に広げる。
 * thumb のときは、その機能の画面写真の切り抜き（data.tsx の thumb。機能ごとに違う画面）を上に置く。
 * MCP のカードには、会話の吹き出しを重ねる（画面だけだと補足情報のカードと見分けにくい）。
 * compact: 「ほかの機能」用の小さいカード（小見出しのアイコンを省く）。
 */
export function FeatureCard({
  slug,
  lang,
  thumb = false,
  compact = false,
  headingLevel = 3,
  i = 0,
}: {
  slug: FeatureSlug;
  lang: "ja" | "en";
  thumb?: boolean;
  compact?: boolean;
  headingLevel?: 2 | 3;
  i?: number;
}) {
  const t = getFeaturesDictionary(lang);
  const p = t.pages[slug];
  const cfg = featureConfig[slug];
  const Icon = cfg.icon;
  const H = headingLevel === 2 ? "h2" : "h3";
  const crop = cfg.thumb;
  // MCP のカードの吹き出し: 絵（数式タブ）に合うやり取り（「式 (11) を解説して」→ add_equation）
  const bubble = slug === "mcp" ? (t.mcpChat.find((c) => c.tool === "add_equation") ?? t.mcpChat[0]) : undefined;
  return (
    <li className={["fp-card", compact ? "fp-card-compact" : ""].join(" ")} data-fp-reveal style={{ "--i": i } as React.CSSProperties}>
      {thumb && (
        <div className="fp-card-thumb" aria-hidden="true">
          {crop.contain ? (
            <img className="fp-card-contain" src={`/screenshots/stages/${crop.shot}.webp`} alt="" loading="lazy" decoding="async" />
          ) : (
            <StageView
              stage={cropStage(slug, crop, { ja: "", en: "" })}
              lang={lang}
              active={0}
              aspect="16/9"
              alt=""
              sizes={compact ? "(max-width: 600px) 92vw, (max-width: 1000px) 46vw, 300px" : "(max-width: 600px) 92vw, (max-width: 1000px) 46vw, 560px"}
            />
          )}
          {bubble && (
            <span className="fp-card-bubble">
              <span>{bubble.user}</span>
              <code>{bubble.tool}</code>
            </span>
          )}
        </div>
      )}
      <div className="fp-card-body">
        {!compact && (
          <p className="fp-card-kicker">
            <span className="fp-icon-tile">
              <Icon size={20} />
            </span>
            {p.appLabel}
          </p>
        )}
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
