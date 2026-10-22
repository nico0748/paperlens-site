export function Privacy() {
  return (
    <section className="lp-section lp-section-alt" aria-labelledby="privacy-title">
      <div className="container lp-privacy">
        <div>
          <h2 id="privacy-title" className="lp-h2">論文は手元から出ません</h2>
          <p className="lp-section-lead">
            未公開の原稿も安心して読めるよう、外へ出る通信を最小にしています。
          </p>
          <ul className="lp-checks">
            <li>アプリのサーバーは自分の PC の中（127.0.0.1）だけで待ち受けます。ほかの端末からはつながりません。</li>
            <li>PDF と記録は、選んだ保存先フォルダにだけ置きます。</li>
            <li>文の区切りに使う GROBID は、手元の Docker で動かせます。</li>
          </ul>
        </div>
        <div className="card lp-privacy-card">
          <h3 className="lp-h3">外へ送るのは、頼んだときだけ</h3>
          <ul>
            <li>
              設定で Claude の API キーを入れ、「訳す」「用語を調べる」「数式にする」を押したとき。
              送るのは選んだ範囲と前後の本文、題名です（数式では選んだ範囲の画像も）。PDF 全体は送りません。
            </li>
            <li>URL（arXiv など）を指定して論文を取り込んだとき。</li>
            <li>GROBID を別のホストに置いたとき。</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
