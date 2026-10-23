import type { Dictionary } from "@/lib/i18n";
import { ShieldIcon } from "../icons";

/** PC の中で完結すること・外部へ送るものを、2 枚のカードで見比べる（淡い地） */
export function Privacy({ t, kicker }: { t: Dictionary["privacy"]; kicker: string }) {
  return (
    <section id="privacy" className="lp-section lp-tint theme-light" aria-labelledby="privacy-title">
      <div className="container">
        <header className="lp-section-head" data-reveal>
          <span className="lp-icon-tile lp-icon-tile-lg" aria-hidden="true">
            <ShieldIcon size={28} />
          </span>
          <p className="lp-kicker">{kicker}</p>
          <h2 id="privacy-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{t.lead}</p>
        </header>
        <div className="lp-compare">
          <section className="lp-card lp-accent lp-compare-col lp-compare-local" aria-labelledby="privacy-local" data-reveal>
            <p className="lp-tag">{t.local.tag}</p>
            <h3 id="privacy-local" className="lp-h3">
              {t.local.title}
            </h3>
            <ul className="lp-checks">
              {t.local.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section
            className="lp-card lp-compare-col"
            aria-labelledby="privacy-remote"
            data-reveal
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <p className="lp-tag lp-tag-neutral">{t.remote.tag}</p>
            <h3 id="privacy-remote" className="lp-h3">
              {t.remote.title}
            </h3>
            <p className="lp-compare-lead">{t.remote.lead}</p>
            <ul className="lp-arrows">
              {t.remote.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
