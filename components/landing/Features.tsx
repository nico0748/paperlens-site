import type { Dictionary } from "@/lib/i18n";
import { BookIcon, HighlightIcon, LinkIcon, NoteIcon, PlugIcon, TranslateIcon, VaultIcon } from "../icons";

type T = Dictionary["features"];

const BLOCK_ICONS = [TranslateIcon, NoteIcon, LinkIcon];
const MORE_ICONS = [HighlightIcon, PlugIcon, BookIcon, VaultIcon];

/**
 * できること（白）。主な機能 3 つは大きなカード（文と小さな図）、残りは細いカードで並べる。
 * 実際の画面は次の「実際の画面」タブにまとめる。
 */
export function Features({ t, kicker }: { t: T; kicker: string }) {
  return (
    <section id="features" className="lp-section theme-light" aria-labelledby="features-title">
      <div className="container">
        <header className="lp-section-head" data-reveal>
          <p className="lp-kicker">{kicker}</p>
          <h2 id="features-title" className="lp-h2">
            {t.title}
          </h2>
          <p className="lp-section-lead">{t.lead}</p>
        </header>

        <ul className="lp-feature-grid" role="list">
          {t.blocks.map((b, i) => {
            const Icon = BLOCK_ICONS[i % BLOCK_ICONS.length];
            return (
              <li key={b.kicker} className="lp-card lp-feature" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <div className="lp-card-head">
                  <span className="lp-icon-tile" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <p className="lp-card-kicker">{b.kicker}</p>
                </div>
                <h3 className="lp-h3">{b.title}</h3>
                <div className="lp-feature-body">
                  {b.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <div className={i === 2 ? "lp-mini lp-mini-shot-frame" : "lp-mini"}>
                  <MiniDiagram index={i} stages={t.stages} stagesLabel={t.stagesLabel} linkShotAlt={t.linkShotAlt} />
                </div>
                {b.points.length > 0 && (
                  <ul className="lp-points">
                    {b.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <h3 className="lp-more-title" data-reveal="fade">
          {t.moreTitle}
        </h3>
        <ul className="lp-slim-grid" role="list">
          {t.more.map((f, i) => {
            const Icon = MORE_ICONS[i % MORE_ICONS.length];
            return (
              <li key={f.title} className="lp-card lp-slim" data-reveal style={{ "--i": i } as React.CSSProperties}>
                <div className="lp-slim-head">
                  <span className="lp-icon-tile lp-icon-tile-sm" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <h4 className="lp-h4">{f.title}</h4>
                </div>
                <p className="lp-slim-body">{f.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** カードの中の小さな図。対訳とノートは飾りの図（読み上げない）、スライド連携は実際の画面の切り抜き */
function MiniDiagram({
  index,
  stages,
  stagesLabel,
  linkShotAlt,
}: {
  index: number;
  stages: string[];
  stagesLabel: string;
  linkShotAlt: string;
}) {
  if (index === 0) {
    return (
      <div className="lp-pairs" aria-hidden="true">
        <div className="lp-pair">
          <p className="lp-pair-en" lang="en">
            The dominant sequence transduction models are based on complex recurrent networks.
          </p>
          <p className="lp-pair-ja" lang="ja">
            主要な系列変換モデルは、複雑な再帰型ネットワークに基づく。
          </p>
        </div>
        <div className="lp-pair on">
          <p className="lp-pair-en" lang="en">
            We propose a new simple network architecture, the <mark>Transformer</mark>.
          </p>
          <p className="lp-pair-ja" lang="ja">
            新しい単純なネットワーク構造 <mark>Transformer</mark> を提案する。
          </p>
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="lp-note">
        <div className="lp-note-file" aria-hidden="true">
          <p className="lp-note-name">note.md</p>
          <pre className="lp-note-body">
            <span className="md-meta">{"status: "}</span>
            <span className="md-value">{stages[2]}</span>
            {"\n"}
            <span className="md-h">{"## " + stages[1]}</span>
            {"\n- Attention-only encoder–decoder\n"}
            <span className="md-h">{"## " + stages[2]}</span>
            {"\n"}
            <span className="md-math">{"$\\mathrm{softmax}(QK^\\top/\\sqrt{d_k})V$"}</span>
          </pre>
        </div>
        <ol className="lp-stages" aria-label={stagesLabel}>
          {stages.map((s, i) => (
            <li key={s} aria-current={i === 2 ? "step" : undefined}>
              {s}
            </li>
          ))}
        </ol>
      </div>
    );
  }
  // スライドの囲み・赤い線・論文の該当箇所だけを切り出した画像（途中のまっすぐな線は省いている）
  return (
    <img
      className="lp-mini-shot"
      src="/screenshots/slides-link-card-800.webp"
      srcSet="/screenshots/slides-link-card-800.webp 800w, /screenshots/slides-link-card.webp 1494w"
      sizes="(max-width: 760px) calc(100vw - 72px), (max-width: 1100px) 45vw, 360px"
      alt={linkShotAlt}
      width={1494}
      height={930}
      loading="lazy"
      decoding="async"
      data-fade
    />
  );
}
