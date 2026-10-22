import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="brand">
          <img src="/brand/icon.svg" alt="" width={32} height={32} />
          PaperLens
        </Link>
        <nav className="site-nav" aria-label="サイト内">
          <Link href="/#features">機能</Link>
          <Link href="/#download">ダウンロード</Link>
          <Link href="/shared">共有データ</Link>
          <a href="https://github.com/nico0748/LogiXiv">GitHub</a>
        </nav>
      </div>
    </header>
  );
}
