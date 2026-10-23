import Link from "next/link";
import { fill, type Dictionary, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { ArrowRightIcon, ArrowUpRightIcon, ChevronDownIcon, CodeIcon, DownloadIcon, LaptopIcon, MonitorIcon, TerminalIcon, VaultIcon } from "../icons";

const OS_ICONS = [LaptopIcon, MonitorIcon, TerminalIcon];

/**
 * ダウンロード（白）。左の大きなカードに OS ごとの入口と主ボタン、右にソースコードと共有データ。
 * ソースから動かす手順は <details> にしまい、開発者だけが開けばよいようにする。
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
          <div className="lp-card lp-dl-main" data-reveal>
            <div className="lp-dl-text">
              <h3 className="lp-h3">{t.desktopTitle}</h3>
              <p>{t.desktopDesc}</p>
              <a href={site.latestRelease} className="btn btn-primary btn-lg">
                <DownloadIcon />
                {t.desktopCta}
              </a>
              <p className="lp-dl-note">{t.desktopNote}</p>
            </div>
            <ul className="lp-os" role="list">
              {t.platforms.map((p, i) => {
                const Icon = OS_ICONS[i % OS_ICONS.length];
                return (
                  <li key={p.name}>
                    <a href={site.latestRelease} className="lp-os-link">
                      <Icon size={24} />
                      <span className="lp-os-name">{p.name}</span>
                      <span className="lp-os-file">{p.file}</span>
                      <ArrowUpRightIcon size={18} className="lp-os-arrow" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lp-dl-side">
            <div className="lp-card lp-dl-card" data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              <span className="lp-icon-tile lp-icon-tile-sm" aria-hidden="true">
                <CodeIcon size={20} />
              </span>
              <h3 className="lp-h4">{t.sourceTitle}</h3>
              <p>{t.sourceDesc}</p>
              <a href={site.sourceZip} className="btn btn-secondary">
                <DownloadIcon size={18} />
                {t.sourceCta}
              </a>
            </div>
            <div className="lp-card lp-dl-card" data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              <span className="lp-icon-tile lp-icon-tile-sm" aria-hidden="true">
                <VaultIcon size={20} />
              </span>
              <p className="lp-card-kicker">{shared.eyebrow}</p>
              <h3 className="lp-h4">{shared.title}</h3>
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
