import type { Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { DownloadIcon, GitHubIcon, TerminalIcon } from "../icons";

/** 文中の `code` を <code> にする */
function withCode(text: string) {
  return text.split(/`([^`]+)`/).map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}

/**
 * はじめ方（白）。配布用のアプリはまだ無いので、ソースから動かす手順を 3 段で見せる。
 * id は #download のまま（ヒーローや詳細ページの「ソースから動かす」がここを指す）。
 */
export function Start({ t, kicker }: { t: Dictionary["start"]; kicker: string }) {
  return (
    <section id="download" className="lp-section theme-light" aria-labelledby="download-title">
      <div className="container">
        <header className="lp-section-head" data-reveal>
          <span className="lp-icon-tile lp-icon-tile-lg" aria-hidden="true">
            <TerminalIcon size={28} />
          </span>
          <p className="lp-kicker">{kicker}</p>
          <h2 id="download-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{t.lead}</p>
          <p className="lp-start-req">{t.requirement}</p>
        </header>

        <ol className="lp-steps" aria-label={t.stepsLabel}>
          {t.steps.map((s, i) => (
            <li key={s.title} className="lp-card lp-step" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <span className="lp-step-n" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="lp-h4">{s.title}</h3>
              {s.body && <p className="lp-step-body">{withCode(s.body)}</p>}
              {s.code && (
                <pre className="lp-pre" tabIndex={0} aria-label={`${s.title}: ${t.codeLabel}`}>
                  <code>{s.code}</code>
                </pre>
              )}
            </li>
          ))}
        </ol>

        <div className="lp-start-foot" data-reveal>
          <p>
            {t.note} {t.readme[0]}
            <a href={`${site.repo}#readme`}>{t.readme[1]}</a>
            {t.readme[2]}
          </p>
          <div className="lp-cta">
            <a href={site.repo} className="btn btn-secondary">
              <GitHubIcon />
              {t.github}
            </a>
            <a href={site.sourceZip} className="btn btn-ghost">
              <DownloadIcon size={18} />
              {t.sourceZip}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
