import type { Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { DownloadIcon, GitHubIcon } from "../icons";

/** ページの締め（紺）。もう一度だけ、ダウンロードへ誘う */
export function Closing({ dict }: { dict: Dictionary }) {
  const t = dict.landing.closing;
  return (
    <section className="lp-closing theme-dark" aria-labelledby="closing-title">
      <div className="lp-section-art" aria-hidden="true" />
      <div className="container lp-closing-inner" data-reveal>
        <img src="/brand/icon-mark.png" alt="" width={64} height={64} className="lp-closing-icon" loading="lazy" decoding="async" />
        <h2 id="closing-title" className="lp-h2">
          {t.title}
        </h2>
        <p className="lp-section-lead">{t.body}</p>
        <div className="lp-cta lp-cta-center">
          <a href="#download" className="btn btn-primary btn-lg">
            <DownloadIcon />
            {dict.hero.download}
          </a>
          <a href={site.repo} className="btn btn-secondary btn-lg">
            <GitHubIcon />
            {dict.hero.github}
          </a>
        </div>
      </div>
    </section>
  );
}
