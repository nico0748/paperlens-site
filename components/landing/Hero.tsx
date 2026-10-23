import { fill, type Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { ArrowRightIcon, CheckIcon, GitHubIcon, LinkIcon, NoteIcon, SigmaIcon, TranslateIcon } from "../icons";

const CHIP_ICONS = [LinkIcon, TranslateIcon, SigmaIcon, NoteIcon];

/**
 * ヒーロー（紺）。2 行のキャッチ → 説明 1 文 → ボタン 1 列 → 特長の列、その下に大きな画面写真。
 * 写真は紺と白の境目にまたがって置き、広い画面では写真の左右の縁に機能のチップを置く（画面の中身は隠さない）。
 * 狭い画面では写真の下に 2 列で並べる。チップは飾りなので読み上げない。
 * 写真は LCP なので、JavaScript で隠さず、すぐに読み込む。
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  const l = dict.landing;
  const trust = l.trust.map((item) => fill(item, { license: site.license }));

  return (
    <section className="lp-hero theme-dark" aria-labelledby="hero-title">
      <div className="lp-hero-art" aria-hidden="true" />
      <div className="container lp-hero-inner">
        <p className="lp-eyebrow-pill">
          <img src="/brand/icon-mark-light.png" alt="" width={20} height={20} />
          <span className="lp-eyebrow-name">{site.name}</span>
          <span className="lp-eyebrow-sep" aria-hidden="true" />
          <span>{t.eyebrow}</span>
        </p>
        <h1 id="hero-title" className="lp-hero-title">
          {t.catch.map((line, i) => (
            <span key={line} className="lp-line" style={{ "--i": i } as React.CSSProperties}>
              {i === t.catch.length - 1 ? <span className="lp-mark">{phrases(line)}</span> : phrases(line)}
            </span>
          ))}
        </h1>
        <p className="lp-hero-lead">{t.lead}</p>
        <div className="lp-cta">
          <a href="#download" className="btn btn-primary btn-lg">
            {t.download}
            <ArrowRightIcon />
          </a>
          <a href={site.repo} className="btn btn-secondary btn-lg">
            <GitHubIcon />
            {t.github}
          </a>
        </div>
        <ul className="lp-trust" aria-label={l.trustLabel}>
          {trust.map((item) => (
            <li key={item}>
              <CheckIcon size={16} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="container lp-hero-stage">
        <figure className="lp-shot-hero">
          <img
            src="/screenshots/hero-mac.webp"
            srcSet="/screenshots/hero-mac-800.webp 800w, /screenshots/hero-mac-1200.webp 1200w, /screenshots/hero-mac.webp 1600w"
            sizes="(max-width: 1120px) calc(100vw - 32px), 1040px"
            alt={dict.shot.alt}
            width={1600}
            height={1006}
            fetchPriority="high"
            decoding="async"
          />
          <ul className="lp-chips" aria-hidden="true">
            {l.chips.map((text, i) => {
              const Icon = CHIP_ICONS[i % CHIP_ICONS.length];
              return (
                <li key={text} className="lp-chip" style={{ "--i": i } as React.CSSProperties}>
                  <span className="lp-chip-icon">
                    <Icon size={18} />
                  </span>
                  {text}
                </li>
              );
            })}
          </ul>
        </figure>
      </div>
    </section>
  );
}

/**
 * 和文のキャッチは「、」の後でだけ折り返す（どのブラウザでも語の途中で切れないように）。
 * 「、」の無い行（英語など）はそのまま返す。
 */
function phrases(line: string) {
  const parts = line.split(/(?<=、)/);
  if (parts.length < 2) return line;
  return parts.map((p, i) => (
    <span key={i} className="lp-phrase">
      {p}
    </span>
  ));
}
