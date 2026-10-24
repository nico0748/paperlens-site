import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { featureHref } from "@/lib/site";
import type { Stage } from "@/lib/stage-types";
import { ScreenStage } from "@/components/features/ScreenStage";
import { ArrowRightIcon, FilesIcon, PanelRightIcon, PresentationIcon } from "../icons";

const NODE_ICONS = [PresentationIcon, FilesIcon, PanelRightIcon];

/**
 * 3 つがつながる（紺の帯）。スライド ⇄ 論文 ⇄ 補足情報 の図と、行き来のしかた 3 つ、その下に実際の画面。
 * 論文の節点を少し大きくして「軸」であることを示す。つなぐ線は、画面に入ったら引かれる（data-draw）。
 */
export function Connected({ lang, t, stage }: { lang: Locale; t: Dictionary["features"]["connected"]; stage: Stage }) {
  return (
    <section id="f-connected" className="lp-section lp-connected theme-dark" aria-labelledby="f-connected-title">
      <div className="lp-section-art" aria-hidden="true" />
      <div className="container">
        <header className="lp-section-head" data-reveal>
          <p className="lp-kicker">{t.kicker}</p>
          <h3 id="f-connected-title" className="lp-h2">
            {t.title}
          </h3>
          <p className="lp-section-lead">{t.body}</p>
        </header>

        <div className="lp-tri" aria-hidden="true">
          {t.nodes.map((label, i) => {
            const Icon = NODE_ICONS[i];
            return (
              <div key={label} className="lp-tri-cell">
                {i > 0 && <span className="lp-tri-link" data-reveal="draw" style={{ "--i": i + 1 } as React.CSSProperties} />}
                <span className={`lp-tri-node${i === 1 ? " is-hub" : ""}`} data-reveal style={{ "--i": i } as React.CSSProperties}>
                  <Icon size={i === 1 ? 26 : 22} />
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <ul className="lp-tri-points" role="list">
          {t.bullets.map((b, i) => (
            <li key={b} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <ArrowRightIcon size={18} />
              {b}
            </li>
          ))}
        </ul>

        <div className="lp-connected-stage" data-reveal>
          <ScreenStage stage={stage} lang={lang} />
        </div>
        <div className="lp-cta lp-cta-center lp-connected-cta">
          <Link href={featureHref(lang, "slides-link")} className="btn btn-secondary">
            {t.cta}
            <ArrowRightIcon size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
