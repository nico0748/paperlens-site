import Link from "next/link";
import { fill, type Dictionary, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { ArrowUpIcon } from "./icons";

export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const { footer: t, nav, common } = dict;
  const columns = [
    {
      title: t.product,
      links: [
        { href: `/${lang}#features`, label: nav.features },
        { href: `/${lang}#download`, label: nav.download },
        { href: site.releases, label: t.releases },
      ],
    },
    {
      title: t.resources,
      links: [
        { href: `${site.repo}#readme`, label: t.readme },
        { href: `/${lang}/shared#zip-format`, label: t.zipFormat },
        { href: `/${lang}/shared`, label: nav.shared },
      ],
    },
    {
      title: t.community,
      links: [
        { href: site.repo, label: t.source },
        { href: site.issues, label: t.issues },
      ],
    },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href={`/${lang}`} className="brand">
              <img src="/brand/icon.svg" alt="" width={32} height={32} />
              {site.name}
            </Link>
            <p>{t.tagline}</p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} className="footer-col" aria-label={col.title}>
              <h2>{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("/") ? <Link href={l.href}>{l.label}</Link> : <a href={l.href}>{l.label}</a>}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <p>{fill(t.license, { license: site.license })}</p>
          <a href="#main" className="back-to-top">
            <ArrowUpIcon size={18} />
            {common.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
