import { fill, type Dictionary } from "@/lib/i18n";
import { site } from "@/lib/site";
import { ArrowRightIcon, DownloadIcon } from "../icons";

export function Download({ t }: { t: Dictionary["download"] }) {
  const steps = [
    "git clone https://github.com/nico0748/LogiXiv.git",
    "cd LogiXiv",
    "npm install",
    "npm run build",
    "cd apps/reader",
    `npm run app      ${t.runOpenApp}`,
    t.runOr,
    `npm start        ${t.runOpenBrowser}`,
  ].join("\n");
  const grobid = "docker compose -f docker/grobid.yml up -d   # http://localhost:8070";

  return (
    <section id="download" className="lp-section" aria-labelledby="download-title">
      <div className="container">
        <header className="lp-section-head">
          <h2 id="download-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{fill(t.lead, { license: site.license })}</p>
        </header>

        <div className="lp-download">
          <div className="lp-dl-main">
            <h3 className="lp-h3">{t.desktopTitle}</h3>
            <p>{t.desktopDesc}</p>
            <ul className="lp-os" role="list">
              {t.platforms.map((p) => (
                <li key={p.name}>
                  <span className="lp-os-name">{p.name}</span>
                  <span className="lp-os-file">{p.file}</span>
                </li>
              ))}
            </ul>
            <a href={site.latestRelease} className="btn btn-primary btn-lg">
              <DownloadIcon />
              {t.desktopCta}
            </a>
            <p className="lp-muted">{t.desktopNote}</p>
          </div>
          <div className="lp-dl-side">
            <h3 className="lp-h3">{t.sourceTitle}</h3>
            <p>{t.sourceDesc}</p>
            <a href={site.sourceZip} className="btn btn-secondary">
              {t.sourceCta}
              <ArrowRightIcon size={18} />
            </a>
          </div>
        </div>

        <div className="lp-source">
          <h3 className="lp-h3">{t.runTitle}</h3>
          <p>
            {t.runRequirement[0]}
            <code>{t.runRequirement[1]}</code>
            {t.runRequirement[2]}
          </p>
          <pre className="lp-pre" tabIndex={0} aria-label={t.runStepsLabel}>
            <code>{steps}</code>
          </pre>
          <p>{t.grobidText}</p>
          <pre className="lp-pre" tabIndex={0} aria-label={t.grobidLabel}>
            <code>{grobid}</code>
          </pre>
          <p>
            {t.readme[0]}
            <a href={`${site.repo}#readme`}>{t.readme[1]}</a>
            {t.readme[2]}
          </p>
        </div>
      </div>
    </section>
  );
}
