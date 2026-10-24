import { fill, type Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { GitHubIcon, TerminalIcon } from "../icons";

/** ページの締め（紺）。ソースから動かす手順（#download）と GitHub へのボタン、動かすのに要るものを 1 行で */
export function Closing({ dict }: { dict: Dictionary }) {
  const t = dict.closing;
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
          <a href="#download" className="btn btn-primary btn-lg">
            <TerminalIcon />
            {dict.hero.primary}
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
