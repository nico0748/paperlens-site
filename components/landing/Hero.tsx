import { fill, type Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { ArrowRightIcon, CheckIcon, GitHubIcon } from "../icons";

/**
 * ヒーロー（紺）。広い画面では 2 列: 左に眉・キャッチ・説明・ボタン・特長、右に Mac に PaperLens を映した宣材。
 * 1100px 以下は縦に並べ、文の下に宣材を置く。
 * 宣材は LCP なので、JavaScript で隠さず、すぐに読み込む。
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  const trust = t.trust.map((item) => fill(item, { license: site.license }));

  return (
    <section className="lp-hero theme-dark" aria-labelledby="hero-title">
      <div className="lp-hero-art" aria-hidden="true" />
      <div className="container lp-hero-grid">
        <div className="lp-hero-inner">
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
          <p className="lp-hero-tagline">{t.tagline}</p>
          <p className="lp-hero-lead">{t.lead}</p>
          <div className="lp-cta">
            <a href="#download" className="btn btn-primary btn-lg">
              {t.primary}
              <ArrowRightIcon />
            </a>
            <a href={site.repo} className="btn btn-secondary btn-lg">
              <GitHubIcon />
              {t.github}
            </a>
          </div>
          <ul className="lp-trust" aria-label={t.trustLabel}>
            {trust.map((item) => (
              <li key={item}>
                <CheckIcon size={16} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <figure className="lp-hero-mac">
          <img
            src="/screenshots/hero-mac.webp"
            srcSet="/screenshots/hero-mac-800.webp 800w, /screenshots/hero-mac-1200.webp 1200w, /screenshots/hero-mac.webp 1600w"
            sizes="(max-width: 1100px) min(calc(100vw - 32px), 760px), 680px"
            alt={t.alt}
            width={1600}
            height={1006}
            fetchPriority="high"
            decoding="async"
          />
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
