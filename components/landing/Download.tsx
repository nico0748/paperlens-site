import { site } from "@/lib/site";

const steps = `git clone https://github.com/nico0748/LogiXiv.git
cd LogiXiv
npm install
npm run build
cd apps/reader
npm run app      # デスクトップ版のウィンドウで開く
# または
npm start        # ブラウザで http://127.0.0.1:5175 を開く`;

const grobid = `docker compose -f docker/grobid.yml up -d   # http://localhost:8070`;

export function Download() {
  return (
    <section id="download" className="lp-section" aria-labelledby="download-title">
      <div className="container">
        <h2 id="download-title" className="lp-h2">ダウンロード</h2>
        <p className="lp-section-lead">
          PaperLens は GitHub で配布しています。{site.license} ライセンスのオープンソースです。
        </p>

        <div className="lp-download-grid">
          <div className="card lp-dl-card">
            <h3 className="lp-h3">デスクトップ版</h3>
            <p>
              macOS（.dmg）、Windows（NSIS のインストーラー）、Linux（AppImage）向けの配布物は、
              GitHub のリリースのページに置きます。
            </p>
            <p className="lp-muted">
              まだ配布物が無いことがあります。そのときは下の「ソースから動かす」をお使いください。
            </p>
            <a href={site.latestRelease} className="btn btn-primary">リリース一覧を開く</a>
          </div>

          <div className="card lp-dl-card">
            <h3 className="lp-h3">ソースコード</h3>
            <p>最新のソースコードを ZIP でダウンロードできます。git を使う場合は下の手順でも取得できます。</p>
            <a href={site.sourceZip} className="btn btn-secondary">ソースコード（ZIP）</a>
          </div>
        </div>

        <div className="lp-source">
          <h3 className="lp-h3">ソースから動かす</h3>
          <p>
            Node.js 22.6 以上が必要です。<code>node -v</code> で確かめられます。
          </p>
          <pre className="lp-pre" tabIndex={0} aria-label="ソースから動かす手順">
            <code>{steps}</code>
          </pre>
          <p>
            文の区切りを正確にするため、GROBID を Docker で動かすことを強くおすすめします。
            リポジトリの最上位で次を実行します。
          </p>
          <pre className="lp-pre" tabIndex={0} aria-label="GROBID を起動する手順">
            <code>{grobid}</code>
          </pre>
          <p>
            詳しい使い方は <a href={`${site.repo}#readme`}>GitHub の README</a> にあります。
          </p>
        </div>
      </div>
    </section>
  );
}
