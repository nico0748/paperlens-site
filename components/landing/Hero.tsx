import { fill, type Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { ArrowRightIcon, CheckIcon, GitHubIcon } from "../icons";

/**
 * ヒーローの画面: スライドで囲んだグループから論文の文と数式へ線が伸びた画面（scripts/make-stages.py の hero-linked）。
 * 広い画面は 2:1 の画像の上下を CSS で少し落として（.lp-hero-crop）、線の束が 1440×900 の最初の画面に入るようにする。
 * 760px 以下は、スライドの囲み・線・論文の箇所だけを 4:3 に切り出した画像に替える（<picture> なので 1 枚だけ読む）。
 */
const S = "/screenshots/stages";

/**
 * ヒーロー（紺）。眉 → 2 行のキャッチ → 説明 → ボタン → 特長 3 つ、その下に線でつながった画面。
 * 1440×900 では線の部分が最初の画面に入るよう、上の余白を詰めている。
 * 写真は LCP なので、JavaScript で隠さず、すぐに読み込む。
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  const trust = t.trust.map((item) => fill(item, { license: site.license }));

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

      <div className="container lp-hero-stage">
        <figure className="lp-shot-hero">
          <div className="lp-hero-crop">
            <picture>
              <source
                media="(max-width: 760px)"
                srcSet={`${S}/hero-linked-mobile-800.webp 800w, ${S}/hero-linked-mobile.webp 1200w`}
                sizes="calc(100vw - 32px)"
                width={1200}
                height={900}
              />
              <img
                src={`${S}/hero-linked.webp`}
                srcSet={`${S}/hero-linked-800.webp 800w, ${S}/hero-linked-1200.webp 1200w, ${S}/hero-linked.webp 2400w`}
                sizes="(max-width: 1120px) calc(100vw - 32px), 1080px"
                alt={t.alt}
                width={2400}
                height={1200}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
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
