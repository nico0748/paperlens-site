import { fill, type Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { GitHubIcon, TerminalIcon } from "../icons";

/**
 * ページの締め（紺）。ヒーローと同じボタンを繰り返さず、ソースから動かす手順（ダウンロード欄の <details>）を
 * 開いて直接移るボタンと、GitHub へのボタンを置く。下に、動かすのに要るものを 1 行で添える。
 */
export function Closing({ dict }: { dict: Dictionary }) {
  const t = dict.landing.closing;
  return (
    <section className="lp-closing theme-dark" aria-labelledby="closing-title">
      <div className="lp-section-art" aria-hidden="true" />
      <div className="container lp-closing-inner" data-reveal>
        <img src="/brand/icon-mark-light.png" alt="" width={64} height={64} className="lp-closing-icon" loading="lazy" decoding="async" />
        <h2 id="closing-title" className="lp-h2">
          {t.title}
        </h2>
        <p className="lp-section-lead">{t.body}</p>
        <div className="lp-cta lp-cta-center">
          <a href="#run-from-source" className="btn btn-primary btn-lg" data-open-details>
            <TerminalIcon />
            {dict.download.runCta}
          </a>
          <a href={site.repo} className="btn btn-secondary btn-lg">
            <GitHubIcon />
            {dict.hero.github}
          </a>
        </div>
        <ul className="lp-facts" role="list">
          {t.facts.map((f) => (
            <li key={f}>{fill(f, { license: site.license })}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
