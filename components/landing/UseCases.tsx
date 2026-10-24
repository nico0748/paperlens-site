import type { Dictionary } from "@/lib/i18n";
import { PanelRightIcon, PresentationIcon, WaypointsIcon } from "../icons";

const ICONS = [PresentationIcon, PanelRightIcon, WaypointsIcon];

/** 使い方（白）。輪講・ひとりで読む・あとで見返すの 3 場面を、同じ形のカードで並べる */
export function UseCases({ t, kicker }: { t: Dictionary["uses"]; kicker: string }) {
  return (
    <section id="uses" className="lp-section theme-light" aria-labelledby="uses-title">
      <div className="container">
        <header className="lp-section-head" data-reveal>
          <p className="lp-kicker">{kicker}</p>
          <h2 id="uses-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{t.lead}</p>
        </header>
        <ul className="lp-uses" role="list">
          {t.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li key={item.title} className="lp-card lp-use" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <div className="lp-card-head">
                  <span className="lp-icon-tile" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <p className="lp-card-kicker">{item.kicker}</p>
                </div>
                <h3 className="lp-h3">{item.title}</h3>
                <p className="lp-use-story">{item.story}</p>
                <div className="lp-use-foot">
                  <p className="lp-use-label">{t.usesLabel}</p>
                  <ul className="lp-use-chips" role="list">
                    {item.uses.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
