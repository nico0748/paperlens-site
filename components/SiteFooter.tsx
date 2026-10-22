import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>PaperLens は {site.license} ライセンスのオープンソースソフトウェアです。</p>
        <p>
          <a href={site.repo}>ソースコード</a>
        </p>
      </div>
    </footer>
  );
}
