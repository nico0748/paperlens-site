import Link from "next/link";
import { fill, type Dictionary, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { ArrowRightIcon, ArrowUpRightIcon, ChevronDownIcon, CodeIcon, DownloadIcon, LaptopIcon, MonitorIcon, TerminalIcon, VaultIcon } from "../icons";

const OS_ICONS = [LaptopIcon, MonitorIcon, TerminalIcon];

/**
 * ダウンロード（白）。
 * - 上の大きなカード: アプリ版の予定（OS ごとの形式は「準備中」の情報として見せ、押せるようにはしない）と、今の入手方法。
 * - その下の <details id="run-from-source">: ソースから動かす手順。主ボタンと締めのボタンはここを開いて移る（Motion.tsx）。
 * - 下の 2 枚: ソースコード（ZIP）と共有データ。2 枚は同じ形にして、見出しとボタンの高さをそろえる。
 * Releases がまだ 0 件なので、Releases へのリンクは本文の 1 つだけにする。
 */
export function Download({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.download;
  const shared = dict.sharedBand;
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
    <section id="download" className="lp-section theme-light" aria-labelledby="download-title">
      <div className="container">
        <header className="lp-section-head" data-reveal>
          <p className="lp-kicker">{dict.landing.kickers.download}</p>
          <h2 id="download-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{fill(t.lead, { license: site.license })}</p>
        </header>

        <div className="lp-download">
          <div className="lp-card lp-accent lp-dl-main" data-reveal>
            <div className="lp-dl-text">
              <h3 className="lp-h3">{t.desktopTitle}</h3>
              <p>
                {t.desktopDesc}{" "}
                <a href={site.releases} className="lp-inline-link">
                  {t.desktopCta}
                  <ArrowUpRightIcon size={16} />
                </a>
              </p>
              <p className="lp-dl-note">{t.desktopNote}</p>
              <a href="#run-from-source" className="btn btn-primary btn-lg" data-open-details>
                <TerminalIcon />
                {t.runCta}
              </a>
            </div>
            <div className="lp-os-wrap">
              <p className="lp-os-label">
                {t.platformsLabel}
                <span className="lp-badge">{t.platformsStatus}</span>
              </p>
              <ul className="lp-os" role="list">
                {t.platforms.map((p, i) => {
                  const Icon = OS_ICONS[i % OS_ICONS.length];
                  return (
                    <li key={p.name} className="lp-os-item">
                      <Icon size={24} />
                      <span className="lp-os-name">{p.name}</span>
                      <span className="lp-os-file">{p.file}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <details id="run-from-source" className="lp-details" data-reveal>
            <summary>
              <TerminalIcon />
              {t.runTitle}
              <ChevronDownIcon className="lp-details-chevron" />
            </summary>
            <div className="lp-details-body">
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
          </details>

          <div className="lp-dl-side">
            <div className="lp-card lp-dl-card" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              <div className="lp-slim-head">
                <span className="lp-icon-tile lp-icon-tile-sm" aria-hidden="true">
                  <CodeIcon size={20} />
                </span>
                <h3 className="lp-h4">{t.sourceTitle}</h3>
              </div>
              <p>{t.sourceDesc}</p>
              <a href={site.sourceZip} className="btn btn-secondary">
                <DownloadIcon size={18} />
                {t.sourceCta}
              </a>
            </div>
            <div className="lp-card lp-dl-card" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              <div className="lp-slim-head">
                <span className="lp-icon-tile lp-icon-tile-sm" aria-hidden="true">
                  <VaultIcon size={20} />
                </span>
                <h3 className="lp-h4">{shared.title}</h3>
              </div>
              <p>{shared.body}</p>
              <Link href={`/${lang}/shared`} className="btn btn-secondary">
                {shared.cta}
                <ArrowRightIcon size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
