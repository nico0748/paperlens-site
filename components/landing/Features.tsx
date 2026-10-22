import type { Dictionary } from "@/lib/i18n";

type T = Dictionary["features"];

/** 主な機能 3 つは、文と見本を左右に交互に並べる。残りはカードで並べる */
export function Features({ t }: { t: T }) {
  return (
    <section id="features" className="lp-section" aria-labelledby="features-title">
      <div className="container">
        <header className="lp-section-head">
          <h2 id="features-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{t.lead}</p>
        </header>

        <div className="lp-blocks">
          {t.blocks.map((b, i) => (
            <article key={b.title} className="lp-block">
              <div className="lp-block-text">
                <p className="lp-kicker">{b.kicker}</p>
                <h3 className="lp-h3">{b.title}</h3>
                {b.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                {b.points.length > 0 && (
                  <ul className="lp-points">
                    {b.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                )}
                {i === 1 && (
                  <ol className="lp-stages" aria-label={t.stagesLabel}>
                    {t.stages.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                )}
              </div>
              <BlockVisual index={i} stages={t.stages} />
            </article>
          ))}
        </div>

        <h3 className="lp-more-title">{t.moreTitle}</h3>
        <ul className="lp-cards" role="list">
          {t.more.map((f) => (
            <li key={f.title} className="lp-card">
              <p className="lp-tag">{f.tag}</p>
              <h4 className="lp-h4">{f.title}</h4>
              <p>{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 各機能の見本（飾り） */
function BlockVisual({ index, stages }: { index: number; stages: string[] }) {
  if (index === 0) {
    return (
      <div className="lp-visual" aria-hidden="true">
        <div className="lp-pair">
          <p className="lp-pair-en">
            The dominant sequence transduction models are based on complex recurrent or convolutional neural networks.
          </p>
          <p className="lp-pair-ja" lang="ja">
            主要な系列変換モデルは、複雑な再帰型または畳み込み型のニューラルネットワークに基づいている。
          </p>
        </div>
        <div className="lp-pair on">
          <p className="lp-pair-en">
            We propose a new simple network architecture, the <mark>Transformer</mark>, based solely on attention mechanisms.
          </p>
          <p className="lp-pair-ja" lang="ja">
            注意機構だけに基づく、新しい単純なネットワーク構造 <mark>Transformer</mark> を提案する。
          </p>
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="lp-visual lp-visual-note" aria-hidden="true">
        <p className="lp-note-file">note.md</p>
        <pre className="lp-note-body">
          <span className="md-meta">{"---\nstatus: "}</span>
          <span className="md-value">{stages[2]}</span>
          <span className="md-meta">{"\n---\n"}</span>
          <span className="md-h">{"## "}</span>
          <span className="md-h">{stages[1]}</span>
          {"\n- Attention-only encoder–decoder\n- No recurrence, no convolution\n\n"}
          <span className="md-h">{"## "}</span>
          <span className="md-h">{stages[2]}</span>
          {"\n"}
          <span className="md-math">{"$$\\mathrm{softmax}(QK^\\top/\\sqrt{d_k})V$$"}</span>
          {"\n- [[Scaled Dot-Product Attention]]"}
        </pre>
      </div>
    );
  }
  return (
    <div className="lp-visual lp-visual-link" aria-hidden="true">
      <div className="lp-link-slide">
        <div className="lp-mock-line lp-w60 strong" />
        <div className="lp-link-box">
          <div className="lp-mock-line lp-w90" />
          <div className="lp-mock-line lp-w70" />
        </div>
        <div className="lp-mock-line lp-w80" />
      </div>
      <svg className="lp-link-line" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 45 C 45 45, 55 62, 100 62" />
      </svg>
      <div className="lp-link-paper">
        <div className="lp-mock-line lp-w70 strong" />
        <div className="lp-mock-line lp-w100" />
        <div className="lp-mock-line lp-w90" />
        <div className="lp-link-target">
          <div className="lp-mock-line lp-w100" />
          <div className="lp-mock-line lp-w80" />
        </div>
        <div className="lp-mock-line lp-w100" />
        <div className="lp-mock-line lp-w60" />
      </div>
    </div>
  );
}
