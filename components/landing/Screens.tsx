import type { Dictionary } from "@/lib/i18n";
import { ScreenTabs, type Screen } from "./ScreenTabs";

/** 画像の並びは辞書の features.gallery.items・landing.screens.tabs と同じ順 */
const SHOTS = [
  { id: "equation", width: 1400, height: 967 },
  { id: "glossary", width: 1400, height: 955 },
  { id: "wordbook", width: 1600, height: 949 },
  { id: "graph-term", width: 1600, height: 946 },
  { id: "graph-overview", width: 1600, height: 888 },
];

/** 実際の画面（紺）。タブで 5 枚の画面写真を切り替える */
export function Screens({ dict }: { dict: Dictionary }) {
  const g = dict.features.gallery;
  const l = dict.landing;
  const screens: Screen[] = SHOTS.map((s, i) => ({
    ...s,
    label: l.screens.tabs[i].label,
    sub: l.screens.tabs[i].sub,
    caption: g.items[i].caption,
    alt: g.items[i].alt,
    src: `/screenshots/${s.id}.webp`,
    small: `/screenshots/${s.id}-800.webp`,
  }));

  return (
    <section id="screens" className="lp-section lp-screens theme-dark" aria-labelledby="screens-title">
      <div className="lp-section-art" aria-hidden="true" />
      <div className="container">
        <header className="lp-section-head" data-reveal>
          <p className="lp-kicker">{l.kickers.screens}</p>
          <h2 id="screens-title" className="lp-h2">
            {g.title}
          </h2>
          <p className="lp-section-lead">{l.screens.lead}</p>
        </header>
        <ScreenTabs screens={screens} label={l.screens.tabsLabel} enlarge={l.screens.enlarge} />
      </div>
    </section>
  );
}
