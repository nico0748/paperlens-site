/**
 * アプリ画面の見本（スクリーンショットの代わり）。
 * スライド | 論文 | 補足情報（対訳・訳・用語・数式・記録）の三面を、CSS だけで描く。
 * 飾りなので、支援技術には figure の説明文だけを読ませる。
 */
export function AppMock() {
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
            <div className="lp-mock-label">スライド</div>
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
            <div className="lp-mock-label">論文</div>
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
              <span className="on">対訳</span>
              <span>訳</span>
              <span>用語</span>
              <span>数式</span>
              <span>記録</span>
            </div>
            <div className="lp-mock-card">
              <div className="lp-mock-en">The Transformer relies entirely on attention.</div>
              <div className="lp-mock-ja">Transformer は注意機構だけに頼る。</div>
            </div>
            <div className="lp-mock-card on">
              <div className="lp-mock-en">We propose a new simple network architecture.</div>
              <div className="lp-mock-ja">新しい単純なネットワーク構造を提案する。</div>
            </div>
            <div className="lp-mock-card">
              <div className="lp-mock-en">Experiments on two tasks show…</div>
              <div className="lp-mock-ja muted">（未訳）</div>
            </div>
          </div>
        </div>
        <div className="lp-mock-status">GROBID ・ 訳 42/202 ・ 保存しました</div>
      </div>
      <figcaption className="lp-mock-caption">
        画面の見本。左から発表スライド、論文の PDF、補足情報（対訳・訳・用語・数式・記録）が並びます。
      </figcaption>
    </figure>
  );
}
