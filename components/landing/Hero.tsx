import { site } from "@/lib/site";
import { AppMock } from "./AppMock";

export function Hero() {
  return (
    <section className="lp-hero" aria-labelledby="hero-title">
      <div className="container lp-hero-inner">
        <div className="lp-hero-text">
          <p className="lp-eyebrow">ローカルファーストな論文リーダー</p>
          <h1 id="hero-title" className="lp-hero-title">
            <img src="/brand/icon-mark.svg" alt="" width={48} height={48} className="lp-hero-icon" />
            {site.name}
          </h1>
          <p className="lp-hero-lead">
            論文を 1 文ずつ対訳で読み、訳・用語・数式・読解メモを Markdown のノートに残せます。
          </p>
          <p className="lp-hero-desc">
            PDF は手元の端末から出ません。アプリは自分の PC の中だけで動きます。
            記録は保存先フォルダの普通のファイルなので、Obsidian の保管庫としてそのまま開けます。
          </p>
          <div className="lp-cta">
            <a href="#download" className="btn btn-primary lp-btn-lg">ダウンロード</a>
            <a href={site.repo} className="btn btn-secondary lp-btn-lg">GitHub で見る</a>
          </div>
          <p className="lp-hero-note">
            無料で使えるオープンソースです（{site.license} ライセンス）。
          </p>
        </div>
        <AppMock />
      </div>
    </section>
  );
}
