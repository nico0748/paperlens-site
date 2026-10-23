import { fill, type Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { DownloadIcon, GitHubIcon } from "../icons";

export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;
  return (
    <section className="lp-hero" aria-labelledby="hero-title">
      <div className="lp-hero-glow" aria-hidden="true" />
      <div className="container lp-hero-inner">
        <div className="lp-hero-text">
          <p className="lp-eyebrow">{t.eyebrow}</p>
          <h1 id="hero-title" className="lp-hero-title">
            <img src="/brand/icon-mark.png" alt="" width={56} height={56} className="lp-hero-icon" />
            {site.name}
          </h1>
          <p className="lp-hero-lead">{t.lead}</p>
          <p className="lp-hero-desc">{t.desc}</p>
          <div className="lp-cta">
            <a href="#download" className="btn btn-primary btn-lg">
              <DownloadIcon />
              {t.download}
            </a>
            <a href={site.repo} className="btn btn-secondary btn-lg">
              <GitHubIcon />
              {t.github}
            </a>
          </div>
          <dl className="lp-platforms">
            <dt>{t.platformsLabel}</dt>
            {dict.download.platforms.map((p) => (
              <dd key={p.name}>{p.name}</dd>
            ))}
          </dl>
          <p className="lp-hero-note">{fill(t.note, { license: site.license })}</p>
        </div>
        <figure className="lp-shot-hero">
          <img
            src="/screenshots/hero-mac.webp"
            alt={dict.shot.alt}
            width={1600}
            height={1006}
            fetchPriority="high"
          />
          <figcaption className="lp-shot-caption">{dict.shot.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
