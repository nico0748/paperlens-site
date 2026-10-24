import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowRightIcon, GitHubIcon, TerminalIcon } from "@/components/icons";
import { McpStage } from "@/components/features/McpStage";
import { ScreenStage } from "@/components/features/ScreenStage";
import { ScrollStage } from "@/components/features/ScrollStage";
import { FeatureCard } from "@/components/features/FeatureCard";
import { featureConfig, isFeatureSlug, neighbors } from "@/components/features/data";
import { getFeaturesDictionary } from "@/components/features/dict";
import { stageFor } from "@/components/features/stages";
import { hasLocale, locales } from "@/lib/i18n";
import { featureHref, featureSlugs, site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => featureSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/features/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !isFeatureSlug(slug)) return {};
  const p = getFeaturesDictionary(lang).pages[slug];
  const path = featureHref(lang, slug);
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(locales.map((l) => [l, featureHref(l, slug)])),
    },
    openGraph: {
      type: "article",
      siteName: site.name,
      title: `${p.metaTitle} | ${site.name}`,
      description: p.metaDescription,
      url: path,
      locale: lang === "ja" ? "ja_JP" : "en_US",
      images: [{ url: `/og/feature-${slug}.png`, width: 1200, height: 630, alt: p.title }],
    },
    twitter: { card: "summary_large_image", title: `${p.metaTitle} | ${site.name}`, description: p.metaDescription, images: [`/og/feature-${slug}.png`] },
  };
}

/**
 * 機能の詳細ページ。
 * パンくず → ヒーロー（紺、動く画面写真）→ 使い方の流れ（スクロールで場面が替わる）→ こんなときに（淡）
 * → Claude からもできる → 関連する機能 → 締め（紺）と前後の機能。
 */
export default async function FeaturePage({ params }: PageProps<"/[lang]/features/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !isFeatureSlug(slug)) notFound();
  const t = getFeaturesDictionary(lang);
  const p = t.pages[slug];
  const cfg = featureConfig[slug];
  const stage = stageFor(slug);
  const Icon = cfg.icon;
  const { prev, next } = neighbors(slug);
  const steps = p.steps.map((s, i) => ({ ...s, scene: cfg.stepScenes[i] ?? i, id: cfg.stepAnchors?.[i] }));

  return (
    <>
      <section className="fp-hero theme-dark" aria-labelledby="fp-title">
        <div className="fp-hero-art" aria-hidden="true" />
        <div className="container">
          <Breadcrumb
            label={t.nav.breadcrumb}
            items={[
              { label: t.nav.home, href: `/${lang}` },
              { label: t.nav.features, href: featureHref(lang) },
              { label: p.title },
            ]}
          />
          <div className="fp-hero-grid">
            <div className="fp-hero-text">
              <p className="fp-kicker">
                <span className="fp-icon-tile">
                  <Icon size={22} />
                </span>
                {p.appLabel}
              </p>
              <h1 id="fp-title" className="fp-h1">
                {p.title}
              </h1>
              <p className="fp-lead">{p.lead}</p>
              <div className="fp-cta">
                <Link href={`/${lang}#download`} className="btn btn-primary">
                  <TerminalIcon />
                  {t.ui.ctaPrimary}
                </Link>
                <a href={site.repo} className="btn btn-secondary">
                  <GitHubIcon />
                  {t.ui.ctaSecondary}
                </a>
              </div>
            </div>
            <div className="fp-hero-media">
              {slug === "mcp" ? (
                <McpStage stage={stage} lang={lang} priority />
              ) : (
                <ScreenStage stage={stage} lang={lang} autoplay priority />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="fp-section fp-steps" aria-labelledby="fp-steps-title">
        <div className="container">
          <h2 id="fp-steps-title" className="fp-h2" data-fp-reveal>
            {t.ui.stepsTitle}
          </h2>
          <ScrollStage stage={stage} lang={lang} steps={steps} stepLabel={t.ui.stepLabel} />
        </div>
      </section>

      <section className="fp-section fp-tint" aria-labelledby="fp-cases-title">
        <div className="container">
          <h2 id="fp-cases-title" className="fp-h2" data-fp-reveal>
            {t.ui.casesTitle}
          </h2>
          <ul className="fp-cases" role="list">
            {p.cases.map((c, i) => (
              <li key={c} className="fp-case" data-fp-reveal style={{ "--i": i } as React.CSSProperties}>
                {c}
              </li>
            ))}
          </ul>
          {p.notes.length > 0 && (
            <aside className="fp-notes" aria-label={t.ui.notesTitle} data-fp-reveal>
              <p className="fp-notes-title">{t.ui.notesTitle}</p>
              <ul role="list">
                {p.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </section>

      {slug === "mcp" ? (
        <section className="fp-section" aria-labelledby="fp-tools-title">
          <div className="container">
            <h2 id="fp-tools-title" className="fp-h2" data-fp-reveal>
              {t.ui.toolsTitle}
            </h2>
            <p className="fp-section-lead" data-fp-reveal>
              {t.ui.toolsLead}
            </p>
            <div className="fp-table-wrap" data-fp-reveal>
              <table className="fp-table">
                <thead>
                  <tr>
                    <th scope="col">{t.ui.toolsArea}</th>
                    <th scope="col">{t.ui.toolsNames}</th>
                  </tr>
                </thead>
                <tbody>
                  {t.mcpTools.map((row) => (
                    <tr key={row.area}>
                      <th scope="row">{row.area}</th>
                      <td>
                        <ul className="fp-tools" role="list">
                          {row.tools.map((tool) => (
                            <li key={tool}>
                              <code>{tool}</code>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="fp-h3" data-fp-reveal>
              {t.ui.promptsTitle}
            </h3>
            <dl className="fp-prompts" data-fp-reveal>
              {t.mcpPrompts.map((pr) => (
                <div key={pr.name}>
                  <dt>
                    <code>{pr.name}</code>
                  </dt>
                  <dd>{pr.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : (
        <section className="fp-section fp-mcp" aria-labelledby="fp-mcp-title">
          <div className="container fp-mcp-inner" data-fp-reveal>
            <div>
              <p className="fp-kicker-sm">{t.ui.mcpKicker}</p>
              <h2 id="fp-mcp-title" className="fp-h3">
                {t.ui.mcpTitle}
              </h2>
              <p className="fp-mcp-line">{p.mcpLine}</p>
              <Link href={featureHref(lang, "mcp")} className="fp-more">
                {t.ui.mcpMore}
                <ArrowRightIcon size={18} />
              </Link>
            </div>
            <ul className="fp-tools" role="list">
              {cfg.tools.map((tool) => (
                <li key={tool}>
                  <code>{tool}</code>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="fp-section fp-related" aria-labelledby="fp-related-title">
        <div className="container">
          <h2 id="fp-related-title" className="fp-h2" data-fp-reveal>
            {t.ui.relatedTitle}
          </h2>
          <ul className="fp-card-grid" role="list">
            {cfg.related.map((r, i) => (
              <FeatureCard key={r} slug={r} lang={lang} i={i} />
            ))}
          </ul>
        </div>
      </section>

      <section className="fp-closing theme-dark" aria-labelledby="fp-closing-title">
        <div className="fp-hero-art" aria-hidden="true" />
        <div className="container fp-closing-inner">
          <h2 id="fp-closing-title" className="fp-h2">
            {t.ui.ctaTitle}
          </h2>
          <p className="fp-closing-body">{t.ui.ctaBody}</p>
          <div className="fp-cta fp-cta-center">
            <Link href={`/${lang}#download`} className="btn btn-primary btn-lg">
              <TerminalIcon />
              {t.ui.ctaPrimary}
            </Link>
            <a href={site.repo} className="btn btn-secondary btn-lg">
              <GitHubIcon />
              {t.ui.ctaSecondary}
            </a>
          </div>
          <nav className="fp-pager" aria-label={t.ui.pagerLabel}>
            <Link href={featureHref(lang, prev)} className="fp-pager-link fp-pager-prev" rel="prev">
              <span className="fp-pager-dir">
                <ArrowRightIcon size={16} className="fp-flip" />
                {t.ui.prev}
              </span>
              <span className="fp-pager-title">{t.pages[prev].title}</span>
            </Link>
            <Link href={featureHref(lang, next)} className="fp-pager-link fp-pager-next" rel="next">
              <span className="fp-pager-dir">
                {t.ui.next}
                <ArrowRightIcon size={16} />
              </span>
              <span className="fp-pager-title">{t.pages[next].title}</span>
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
