import type { Dictionary } from "@/lib/i18n";

/** ヒーローのすぐ下の帯。PaperLens がつながる形式・道具を並べる */
export function StackStrip({ t }: { t: Dictionary["stack"] }) {
  return (
    <section className="lp-stack" aria-labelledby="stack-title">
      <div className="container">
        <h2 id="stack-title" className="lp-stack-title">
          {t.title}
        </h2>
        <ul className="lp-stack-list" role="list">
          {t.items.map((item) => (
            <li key={item.name}>
              <span className="lp-stack-name">{item.name}</span>
              <span className="lp-stack-desc">{item.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
