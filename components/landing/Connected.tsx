import type { Dictionary } from "@/lib/i18n";
import { FilesIcon, PanelRightIcon, PresentationIcon } from "../icons";
import { Crop, shot } from "./Crop";

const NODE_ICONS = [PresentationIcon, FilesIcon, PanelRightIcon];

/** 各節点の下の実画面（4:3 に切り出す）。スライドの囲み・線の先の論文の箇所・数式タブの解説 */
const CROPS = [
  { ...shot("slides-linked"), rect: { x: 4, y: 42, w: 30, h: 35.95 } },
  { ...shot("slides-linked"), rect: { x: 70.5, y: 37, w: 27, h: 32.36 } },
  { ...shot("equation"), rect: { x: 37.5, y: 33, w: 41.5, h: 49.74 } },
];

/**
 * 3 つがつながる（紺の帯）。スライド ⇄ 論文 ⇄ 補足情報 の図と、各節点の下に実際の画面の切り抜き。
 * 論文の節点を少し大きくして「軸」であることを示す。つなぐ線は、画面に入ったら引かれる（data-draw）。
 */
export function Connected({ t }: { t: Dictionary["features"]["connected"] }) {
  return (
    <section id="f-connected" className="lp-section lp-connected theme-dark" aria-labelledby="f-connected-title">
      <div className="lp-section-art" aria-hidden="true" />
      <div className="container">
        <header className="lp-section-head lp-section-head-tight" data-reveal>
          <p className="lp-kicker">{t.kicker}</p>
          <h2 id="f-connected-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{t.body}</p>
        </header>

        <ol className="lp-tri" role="list">
          {t.nodes.map((label, i) => {
            const Icon = NODE_ICONS[i];
            const c = CROPS[i];
            return (
              <li key={label} className={`lp-tri-cell${i === 1 ? " is-hub" : ""}`}>
                {i > 0 && <span className="lp-tri-link" data-reveal="draw" aria-hidden="true" style={{ "--i": i + 1 } as React.CSSProperties} />}
                <span className="lp-tri-node" data-reveal style={{ "--i": i } as React.CSSProperties}>
                  <Icon size={i === 1 ? 24 : 20} />
                  {label}
                </span>
                <figure className="lp-tri-shot" data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
                  <Crop {...c} sizes="(max-width: 760px) 300vw, 1200px" alt="" />
                  <figcaption>{t.shots[i]}</figcaption>
                </figure>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
