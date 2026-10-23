import type { Dictionary } from "@/lib/i18n";
import { GemIcon, MarkdownIcon, ParseIcon, PlugIcon, SigmaIcon, SlidesIcon } from "../icons";

/** 辞書の stack.items と同じ順。ロゴではなく、中身を表す汎用の線アイコン */
const GLYPHS = [MarkdownIcon, GemIcon, ParseIcon, SigmaIcon, PlugIcon, SlidesIcon];

/**
 * ヒーローのすぐ下（白）。PaperLens がつながる形式・道具を、枠の無い 1 列で静かに並べる。
 * 狭い画面では 3 列にして、名前だけを出す。
 */
export function StackStrip({ t }: { t: Dictionary["stack"] }) {
  return (
    <section className="lp-stack theme-light" aria-labelledby="stack-title">
      <div className="container">
        <h2 id="stack-title" className="lp-stack-title" data-reveal="fade">
          {t.title}
        </h2>
        <ul className="lp-stack-list" role="list" data-reveal="fade">
          {t.items.map((item, i) => {
            const Icon = GLYPHS[i % GLYPHS.length];
            return (
              <li key={item.name}>
                <span className="lp-stack-name">
                  <Icon size={20} />
                  {item.name}
                </span>
                <span className="lp-stack-desc">{item.desc}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
