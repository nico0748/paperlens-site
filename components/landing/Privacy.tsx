import type { Dictionary } from "@/lib/i18n";

/** 手元で完結すること・外へ送ることを、2 列で見比べられるようにする */
export function Privacy({ t }: { t: Dictionary["privacy"] }) {
  return (
    <section id="privacy" className="lp-section lp-section-alt" aria-labelledby="privacy-title">
      <div className="container">
        <header className="lp-section-head">
          <h2 id="privacy-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{t.lead}</p>
        </header>
        <div className="lp-compare">
          <section className="lp-compare-col lp-compare-local" aria-labelledby="privacy-local">
            <p className="lp-tag lp-tag-accent">{t.local.tag}</p>
            <h3 id="privacy-local" className="lp-h3">
              {t.local.title}
            </h3>
            <ul className="lp-checks">
              {t.local.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="lp-compare-col" aria-labelledby="privacy-remote">
            <p className="lp-tag">{t.remote.tag}</p>
            <h3 id="privacy-remote" className="lp-h3">
              {t.remote.title}
            </h3>
            <p className="lp-muted">{t.remote.lead}</p>
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
