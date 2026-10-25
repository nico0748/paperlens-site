import type { Dictionary } from "@/lib/i18n";
import { ShieldIcon, VaultIcon } from "../icons";

/** プライバシー（白）。見出しと 1〜2 行の本文のあと、Claude に送るものとデータの置き場所を 2 枚で並べる */
export function Privacy({ t }: { t: Dictionary["privacy"] }) {
  const cards = [
    { Icon: ShieldIcon, title: t.sendTitle, body: [t.detail, t.apiNote] },
    { Icon: VaultIcon, title: t.vaultTitle, body: [t.vault] },
  ];
  return (
    <section id="privacy" className="lp-section theme-light" aria-labelledby="privacy-title">
      <div className="container">
        <header className="lp-section-head lp-section-head-tight" data-reveal>
          <h2 id="privacy-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{t.body}</p>
        </header>
        <ul className="lp-privacy" role="list">
          {cards.map(({ Icon, title, body }, i) => (
            <li key={title} className="lp-card lp-privacy-card" data-reveal style={{ "--i": i } as React.CSSProperties}>
              <div className="lp-card-head">
                <span className="lp-icon-tile lp-icon-tile-sm" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <h3 className="lp-h4">{title}</h3>
              </div>
              {body.map((p, j) => (
                <p key={j} className={j > 0 ? "lp-privacy-note" : undefined}>
                  {p}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
