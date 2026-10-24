import type { Dictionary } from "@/lib/i18n";
import { ShieldIcon, VaultIcon } from "../icons";

/** プライバシー（淡）。見出しと本文のあと、Claude に送るものとデータの置き場所を 2 枚で並べる */
export function Privacy({ t, kicker }: { t: Dictionary["privacy"]; kicker: string }) {
  const cards = [
    { Icon: ShieldIcon, title: t.sendTitle, body: t.detail },
    { Icon: VaultIcon, title: t.vaultTitle, body: t.vault },
  ];
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
              <p>{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
