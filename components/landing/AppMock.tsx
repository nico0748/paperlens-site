import type { Dictionary } from "@/lib/i18n";

/**
 * アプリ画面の見本（スクリーンショットの代わり）。
 * スライド | 論文 | 補足情報（対訳・訳・用語・数式・記録）の三面を、CSS だけで描く。
 * 飾りなので、支援技術には figure の説明文だけを読ませる。
 * 対訳の例文は、アプリが英語の論文を日本語に訳すものなので、どの言語のページでもそのまま出す。
 */
export function AppMock({ t }: { t: Dictionary["mock"] }) {
  return (
    <figure className="lp-mock">
      <div className="lp-mock-window" aria-hidden="true">
        <div className="lp-mock-bar">
          <span className="lp-mock-dot" />
          <span className="lp-mock-dot" />
          <span className="lp-mock-dot" />
          <span className="lp-mock-title">Attention Is All You Need</span>
        </div>
        <div className="lp-mock-body">
          <div className="lp-mock-ribbon">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="lp-mock-pane lp-mock-slides">
            <div className="lp-mock-label">{t.slides}</div>
            <div className="lp-mock-slide">
              <div className="lp-mock-line lp-w60 strong" />
              <div className="lp-mock-group g1">
                <div className="lp-mock-line lp-w80" />
                <div className="lp-mock-line lp-w70" />
              </div>
              <div className="lp-mock-group g2">
                <div className="lp-mock-line lp-w50" />
              </div>
            </div>
            <div className="lp-mock-slide small">
              <div className="lp-mock-line lp-w60 strong" />
              <div className="lp-mock-line lp-w80" />
            </div>
          </div>

          <div className="lp-mock-pane lp-mock-paper">
            <div className="lp-mock-label">{t.paper}</div>
            <div className="lp-mock-page">
              <div className="lp-mock-line lp-w70 strong" />
              <div className="lp-mock-line lp-w100" />
              <div className="lp-mock-line lp-w100 sentence active" />
              <div className="lp-mock-line lp-w90 sentence active" />
              <div className="lp-mock-line lp-w100" />
              <div className="lp-mock-line lp-w100 marker" />
              <div className="lp-mock-line lp-w60" />
              <div className="lp-mock-eq">softmax(QKᵀ/√d)V</div>
              <div className="lp-mock-line lp-w100" />
              <div className="lp-mock-line lp-w80" />
            </div>
          </div>

          <div className="lp-mock-pane lp-mock-side">
            <div className="lp-mock-tabs">
              {t.tabs.map((tab, i) => (
                <span key={tab} className={i === 0 ? "on" : undefined}>
                  {tab}
                </span>
              ))}
            </div>
            <div className="lp-mock-card">
              <div className="lp-mock-en">The Transformer relies entirely on attention.</div>
              <div className="lp-mock-ja" lang="ja">Transformer は注意機構だけに頼る。</div>
            </div>
            <div className="lp-mock-card on">
              <div className="lp-mock-en">We propose a new simple network architecture.</div>
              <div className="lp-mock-ja" lang="ja">新しい単純なネットワーク構造を提案する。</div>
            </div>
            <div className="lp-mock-card">
              <div className="lp-mock-en">Experiments on two tasks show…</div>
              <div className="lp-mock-ja muted" lang="ja">（未訳）</div>
            </div>
          </div>
        </div>
        <div className="lp-mock-status">{t.status}</div>
      </div>
      <figcaption className="lp-mock-caption">{t.caption}</figcaption>
    </figure>
  );
}
