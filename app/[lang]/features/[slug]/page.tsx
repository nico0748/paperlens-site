import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowDownIcon, ArrowRightIcon, GitHubIcon, TerminalIcon } from "@/components/icons";
import { BothWays } from "@/components/features/BothWays";
import { McpStage } from "@/components/features/McpStage";
import { PanelTabs } from "@/components/features/PanelTabs";
import { ScrollStage, type ScrollStep } from "@/components/features/ScrollStage";
import { StageStill } from "@/components/features/StageStill";
import { FeatureCard } from "@/components/features/FeatureCard";
import { TRANSLATION_SHOT, cropStage, featureConfig, hasShot, isFeatureSlug, otherFeatures, stageByKey } from "@/components/features/data";
import type { Stage } from "@/lib/stage-types";
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

/** 章ごとの手順と、その章で使う場面だけの Stage（場面の番号は章の中で振り直す。場面のオブジェクトは元のまま） */
function chapterStage(stage: Stage, steps: ScrollStep[]) {
  const used: number[] = [];
  for (const s of steps) if (!used.includes(s.scene)) used.push(s.scene);
  return {
    stage: { ...stage, scenes: used.map((i) => stage.scenes[Math.min(i, stage.scenes.length - 1)]) },
    steps: steps.map((s) => ({ ...s, scene: used.indexOf(s.scene) })),
  };
}

/**
 * 機能の詳細ページ。
 * パンくず → ヒーロー（紺。静止画。MCP だけは会話と動く画面）→ 使い方の流れ（スクロールで場面が替わる。章に分けるページもある）
 * → ページごとの図（両方向・タブ・ツール表）→ こんなときに・注意（淡）→ Claude からもできる → ほかの機能 → 締め（紺）。
 * 動く画面は「使い方の流れ」に 1 つだけ置く（ヒーローでも同じ場面を流すと、トップページと合わせて 3 回同じものを見ることになる）。
 */
export default async function FeaturePage({ params }: PageProps<"/[lang]/features/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang) || !isFeatureSlug(slug)) notFound();
  const t = getFeaturesDictionary(lang);
  const p = t.pages[slug];
  const cfg = featureConfig[slug];
  const stage = stageFor(slug);
  const Icon = cfg.icon;
  const steps: ScrollStep[] = p.steps.map((s, i) => ({ ...s, scene: cfg.stepScenes[i] ?? i, id: cfg.stepAnchors?.[i] }));
  // 章（無ければ 1 章）。章ごとに使う Stage を決める（chapterStages。無い章・まだ無い Stage は stages[slug]）
  type Chapter = { id: string; title: string; lead?: string; own?: Stage; steps: ScrollStep[] };
  const chapters = (p.chapters ?? [{ id: "", title: "", count: steps.length }]).reduce<Chapter[]>((acc, c) => {
    const from = acc.reduce((n, x) => n + x.steps.length, 0);
    const key = cfg.chapterStages?.[c.id];
    const own = key ? stageByKey(key) : undefined;
    acc.push({ id: c.id, title: c.title, lead: "lead" in c ? c.lead : undefined, own, steps: steps.slice(from, from + c.count) });
    return acc;
  }, []);
  const hero = cfg.hero ? cropStage(slug, cfg.hero, { ja: p.heroAlt, en: p.heroAlt }) : null;

  return (
    <>
      <section className="fp-hero theme-dark" aria-labelledby="fp-title" data-slug={slug}>
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
                hero && (
                  <>
                    <StageStill
                      stage={hero}
                      lang={lang}
                      scene={0}
                      aspect={cfg.hero?.aspect}
                      narrowAspect={cfg.hero?.narrowAspect}
                      priority
                      className="fp-hero-still"
                    />
                    <a href="#fp-steps-title" className="fp-hero-jump">
                      {t.ui.stepsJump}
                      <ArrowDownIcon size={16} />
                    </a>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="fp-section fp-steps" data-layout={cfg.layout} aria-labelledby="fp-steps-title">
        <div className="container">
          <h2 id="fp-steps-title" className="fp-h2" data-fp-reveal>
            {t.ui.stepsTitle}
          </h2>
          {chapters.map((c) => {
            // 別の Stage を使う章は、その Stage の場面をそのまま使う（場面の番号は stepScenes のまま）
            const missing = !!cfg.chapterStages?.[c.id] && !c.own;
            const ch = cfg.layout === "text" || missing ? { stage, steps: c.steps } : c.own ? { stage: c.own, steps: c.steps } : chapterStage(stage, c.steps);
            return (
              <div key={c.id || "all"} className="fp-chapter" data-own={c.own ? "" : undefined}>
                {c.title && (
                  <h3 id={c.id} className="fp-chapter-title" data-fp-reveal>
                    {c.title}
                  </h3>
                )}
                {c.lead && (
                  <p className="fp-chapter-lead" data-fp-reveal>
                    {c.lead}
                  </p>
                )}
                <ScrollStage
                  stage={ch.stage}
                  lang={lang}
                  steps={ch.steps}
                  stepLabel={t.ui.stepLabel}
                  layout={missing ? "text" : cfg.layout}
                  stillAspect={cfg.stillAspect}
                />
              </div>
            );
          })}
        </div>
      </section>

      {slug === "slides-link" && p.signature && (
        <section className="fp-section fp-signature" aria-labelledby="fp-sig-title">
          <div className="container">
            <h2 id="fp-sig-title" className="fp-h2" data-fp-reveal>
              {p.signature.title}
            </h2>
            {p.signature.lead && (
              <p className="fp-section-lead" data-fp-reveal>
                {p.signature.lead}
              </p>
            )}
            <BothWays t={p.signature} lang={lang} />
          </div>
        </section>
      )}

      {slug === "supplement" && p.signature && (
        <section className="fp-section fp-signature" aria-labelledby="fp-sig-title">
          <div className="container">
            <h2 id="fp-sig-title" className="fp-h2" data-fp-reveal>
              {p.signature.title}
            </h2>
            <PanelTabs
              t={p.signature}
              lang={lang}
              initial={hasShot(TRANSLATION_SHOT) ? 0 : 2}
              shots={[
                // 対訳タブ: 左の PDF で選んでいる文と、右の対訳のカード（原文と訳）。訳タブの画面は無いので、説明の文だけ
                hasShot(TRANSLATION_SHOT)
                  ? cropStage(slug, { shot: TRANSLATION_SHOT, rect: { x: 26.2, y: 15.5, w: 73.8, h: 66.3 } }, { ja: "", en: "" })
                  : undefined,
                undefined,
                cropStage(slug, { shot: "glossary", rect: { x: 34.76, y: 8.5, w: 65.24, h: 50 } }, { ja: "", en: "" }),
                cropStage(slug, { shot: "equation", rect: { x: 34.76, y: 8.5, w: 65.24, h: 50 } }, { ja: "", en: "" }),
              ]}
            />
          </div>
        </section>
      )}

      {slug === "mcp" && (
        <section className="fp-section fp-signature" aria-labelledby="fp-tools-title">
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
      )}

      <section className="fp-section fp-tint fp-good" aria-labelledby="fp-cases-title">
        <div className="container fp-good-grid">
          <div>
            <h2 id="fp-cases-title" className="fp-h3" data-fp-reveal>
              {t.ui.casesTitle}
            </h2>
            <ul className="fp-cases" role="list">
              {p.cases.map((c, i) => (
                <li key={c} className="fp-case" data-fp-reveal style={{ "--i": i } as React.CSSProperties}>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="fp-good-side">
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
            {slug !== "mcp" && (
              <aside className="fp-mcp-inner" aria-labelledby="fp-mcp-title" data-fp-reveal>
                <p className="fp-kicker-sm">{t.ui.mcpKicker}</p>
                <h2 id="fp-mcp-title" className="fp-h4">
                  {t.ui.mcpTitle}
                </h2>
                <p className="fp-mcp-line">{p.mcpLine}</p>
                <ul className="fp-tools" role="list">
                  {cfg.tools.map((tool) => (
                    <li key={tool}>
                      <code>{tool}</code>
                    </li>
                  ))}
                </ul>
                <Link href={featureHref(lang, "mcp")} className="fp-more">
                  {t.ui.mcpMore}
                  <ArrowRightIcon size={18} />
                </Link>
              </aside>
            )}
          </div>
        </div>
      </section>

      <section className="fp-section fp-others" aria-labelledby="fp-others-title">
        <div className="container">
          <h2 id="fp-others-title" className="fp-h2" data-fp-reveal>
            {t.ui.othersTitle}
          </h2>
          <ul className="fp-card-grid fp-card-grid-others" role="list">
            {otherFeatures(slug).map((r, i) => (
              <FeatureCard key={r} slug={r} lang={lang} thumb compact i={i} />
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
        </div>
      </section>
    </>
  );
}
