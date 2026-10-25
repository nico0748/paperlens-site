import type { Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { DownloadIcon, GitHubIcon } from "../icons";

/** 文中の `code` を <code> にする */
function withCode(text: string) {
  return text.split(/`([^`]+)`/).map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}

/**
 * はじめ方（紺、ページの締めを兼ねる）。配布用のアプリはまだ無いので、ソースから動かす手順を 3 段で見せる。
 * 広い画面では 3 列、狭い画面では縦に並べる。最後に GitHub とソースの ZIP。
 * id は #download のまま（ヒーローや詳細ページの「ソースから動かす」がここを指す）。
 */
export function Start({ t }: { t: Dictionary["start"] }) {
  return (
    <section id="download" className="lp-section lp-start theme-dark" aria-labelledby="download-title">
      <div className="lp-section-art" aria-hidden="true" />
      <div className="container">
        <header className="lp-section-head lp-section-head-tight" data-reveal>
          <p className="lp-kicker">{t.kicker}</p>
          <h2 id="download-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{t.lead}</p>
        </header>

        <ol className="lp-steps" aria-label={t.stepsLabel}>
          {t.steps.map((s, i) => (
            <li key={s.title} className="lp-step" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <div className="lp-step-head">
                <span className="lp-step-n" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="lp-step-title">{s.title}</h3>
              </div>
              {s.code && (
                <pre className="lp-pre" tabIndex={0} aria-label={`${s.title}: ${t.codeLabel}`}>
                  <code>{s.code}</code>
                </pre>
              )}
              {s.body && <p className="lp-step-body">{withCode(s.body)}</p>}
            </li>
          ))}
        </ol>

        <div className="lp-start-foot" data-reveal>
          <div className="lp-cta lp-cta-center">
            <a href={site.repo} className="btn btn-primary btn-lg">
              <GitHubIcon />
              {t.github}
            </a>
            <a href={site.sourceZip} className="btn btn-secondary btn-lg">
              <DownloadIcon size={18} />
              {t.sourceZip}
            </a>
          </div>
          <p>
            {t.note} {t.readme[0]}
            <a href={`${site.repo}#readme`}>{t.readme[1]}</a>
            {t.readme[2]}
          </p>
        </div>
      </div>
    </section>
  );
}
