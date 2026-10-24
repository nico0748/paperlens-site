import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowRightIcon, PanelRightIcon } from "@/components/icons";
import { FeatureCard } from "@/components/features/FeatureCard";
import { ribbonConfig } from "@/components/features/data";
import { getFeaturesDictionary } from "@/components/features/dict";
import { hasLocale, locales } from "@/lib/i18n";
import { featureHref, featureSlugs, site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/features">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getFeaturesDictionary(lang).index;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: featureHref(lang),
      languages: Object.fromEntries(locales.map((l) => [l, featureHref(l)])),
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${t.metaTitle} | ${site.name}`,
      description: t.metaDescription,
      url: featureHref(lang),
      locale: lang === "ja" ? "ja_JP" : "en_US",
      images: [{ url: "/og/site.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image" },
  };
}

/** 機能の一覧。5 つの機能のカード（画面写真つき）と、画面の見取り図（左端のアイコン・右側のタブ） */
export default async function FeaturesIndex({ params }: PageProps<"/[lang]/features">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getFeaturesDictionary(lang);
  const t = d.index;

  return (
    <>
      <section className="fp-index-head" aria-labelledby="fp-index-title">
        <div className="container">
          <Breadcrumb label={d.nav.breadcrumb} items={[{ label: d.nav.home, href: `/${lang}` }, { label: d.nav.features }]} />
          <h1 id="fp-index-title" className="fp-h1">
            {t.title}
          </h1>
          <p className="fp-lead">{t.lead}</p>
        </div>
      </section>

      <section className="fp-section fp-index-list" aria-label={t.title}>
        <div className="container">
          <ul className="fp-card-grid fp-card-grid-index" role="list">
            {featureSlugs.map((slug, i) => (
              <FeatureCard key={slug} slug={slug} lang={lang} thumb headingLevel={2} i={i} />
            ))}
          </ul>
        </div>
      </section>

      <section className="fp-section fp-tint" aria-labelledby="fp-map-title">
        <div className="container">
          <p className="fp-kicker-sm" data-fp-reveal>
            {t.mapKicker}
          </p>
          <h2 id="fp-map-title" className="fp-h2" data-fp-reveal>
            {t.mapTitle}
          </h2>
          <div className="fp-map">
            <div data-fp-reveal>
              <h3 className="fp-h3">{t.ribbonTitle}</h3>
              <ul className="fp-ribbon" role="list">
                {t.ribbon.map((r) => {
                  const c = ribbonConfig[r.key];
                  const Icon = c.icon;
                  return (
                    <li key={r.key} className="fp-ribbon-item">
                      <span className="fp-ribbon-icon">
                        <Icon size={20} />
                      </span>
                      <div>
                        <p className="fp-ribbon-label">
                          {c.slug ? (
                            <Link href={featureHref(lang, c.slug, c.hash)}>
                              {r.label}
                              <ArrowRightIcon size={16} />
                            </Link>
                          ) : (
                            r.label
                          )}
                        </p>
                        <p className="fp-ribbon-body">{r.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div data-fp-reveal style={{ "--i": 1 } as React.CSSProperties}>
              <h3 className="fp-h3">{t.tabsTitle}</h3>
              <ul className="fp-ribbon fp-tabs" role="list">
                {t.tabs.map((tab) => (
                  <li key={tab.label} className="fp-ribbon-item">
                    <span className="fp-ribbon-icon fp-ribbon-icon-tab">
                      <PanelRightIcon size={20} />
                    </span>
                    <div>
                      <p className="fp-ribbon-label">{tab.label}</p>
                      <p className="fp-ribbon-body">{tab.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href={featureHref(lang, "supplement")} className="fp-more">
                {t.tabsMore}
                <ArrowRightIcon size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
