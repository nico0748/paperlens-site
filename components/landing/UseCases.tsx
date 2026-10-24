import type { Dictionary } from "@/lib/i18n";
import { ArrowDownIcon, PanelRightIcon, PresentationIcon, WaypointsIcon } from "../icons";

const ICONS = [PresentationIcon, PanelRightIcon, WaypointsIcon];

/**
 * 使う場面（白、ヒーローの写真のすぐ下）。輪講・ひとりで読む・あとで見返すの 3 つを、短いカードで横に並べる。
 * 各カードは、その場面で使う機能の行（#f-slides など）へ下りるリンクで終わる。
 */
export function UseCases({ t }: { t: Dictionary["uses"] }) {
  return (
    <section id="uses" className="lp-section lp-uses-section theme-light" aria-labelledby="uses-title">
      <div className="container">
        <h2 id="uses-title" className="lp-h2 lp-h2-sm lp-center" data-reveal>
          {t.title}
        </h2>
        <ul className="lp-uses" role="list">
          {t.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li key={item.scene} className="lp-use" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <p className="lp-use-scene">
                  <span className="lp-icon-tile lp-icon-tile-sm" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  {item.scene}
                </p>
                <h3 className="lp-use-title">{item.title}</h3>
                <p className="lp-use-body">{item.body}</p>
                <a href={`#${item.target}`} className="lp-more lp-use-link">
                  {item.link}
                  <ArrowDownIcon size={16} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
