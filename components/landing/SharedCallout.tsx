import Link from "next/link";

export function SharedCallout() {
  return (
    <section className="lp-section lp-section-tight" aria-labelledby="shared-title">
      <div className="container">
        <div className="lp-shared">
          <div>
            <h2 id="shared-title" className="lp-h2 lp-h2-sm">共有データ</h2>
            <p>ログインすると、PaperLens で開ける論文データ（ZIP）をダウンロードできます。</p>
          </div>
          <Link href="/shared" className="btn btn-primary">共有データを見る</Link>
        </div>
      </div>
    </section>
  );
}
