import "./landing.css";
import { notFound } from "next/navigation";
import { Hero } from "@/components/landing/Hero";
import { UseCases } from "@/components/landing/UseCases";
import { FeatureIndex, FEATURE_ICONS } from "@/components/landing/FeatureIndex";
import { Zig } from "@/components/landing/Zig";
import { Connected } from "@/components/landing/Connected";
import { McpMedia } from "@/components/landing/McpMedia";
import { Privacy } from "@/components/landing/Privacy";
import { Start } from "@/components/landing/Start";
import { Motion } from "@/components/landing/Motion";
import { ScreenStage } from "@/components/features/ScreenStage";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { stageByKey } from "@/components/features/data";
import { stageMeta, stages, type StageKey } from "@/lib/scenes";
import { featureHref, prerelease, type FeatureSlug } from "@/lib/site";
import type { Stage } from "@/lib/stage-types";

/**
 * トップページで見せる場面だけを残した Stage。
 * - いちばん伝わる場面（stageMeta.strongestScene）を先頭にする。
 * - アプリ全体を映した場面（文字が小さすぎて読めない）と、近い画面で代わりに見せている場面（placeholders）は外す。
 * 詳細ページは lib/scenes.ts の場面をそのまま使う。
 */
function topStage(key: StageKey): Stage {
  const stage = stages[key];
  const meta = stageMeta[key];
  const skip = new Set((meta as { placeholders?: number[] } | undefined)?.placeholders ?? []);
  const order = stage.scenes.map((_, i) => i);
  const strongest = meta?.strongestScene ?? 0;
  if (strongest > 0 && strongest < order.length) order.unshift(...order.splice(strongest, 1));
  const scenes = order
    .filter((i) => !skip.has(i) && !(stage.scenes[i].rect.w >= 99 && stage.scenes[i].rect.h >= 99))
    .map((i) => stage.scenes[i]);
  return { ...stage, scenes: scenes.length ? scenes : stage.scenes };
}

/**
 * はじめ方の、画面の案内（ツアー）の小さな Stage。枠が小さいので、どの幅でも吹き出しのまわりに寄せた範囲
 * （場面の mobileRect）で見せる（案内の文が読める大きさになる）。まだ場面が無ければ undefined。
 */
function tourStage(): Stage | undefined {
  const stage = stageByKey("tour");
  if (!stage) return undefined;
  return { ...stage, scenes: stage.scenes.map((s) => (s.mobileRect ? { ...s, rect: s.mobileRect } : s)) };
}

/**
 * 流れ（地の色）:
 * ヒーロー（紺・線でつながった画面）→ 使う場面 3 つ（白）→ アイコンで見る機能 #features（淡）
 * → 輪講で｜スライドと論文（白・写真右）→ ひとりで読む｜補足情報（淡・写真左）→ 3 つがつながる（紺・実画面の切り抜き）
 * → あとで見返す｜単語帳とグラフ（白・写真右）→ Claude から使う（淡・会話と結果）
 * → プライバシー（白）→ はじめ方 #download（紺・締め）
 */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const f = dict.features;
  const href = (slug: FeatureSlug) => featureHref(lang, slug);
  const icons = (slug: FeatureSlug) => FEATURE_ICONS[slug].map((Icon, i) => <Icon key={i} size={20} />);

  return (
    <>
      <Hero dict={dict} />
      <UseCases t={dict.uses} />
      <FeatureIndex lang={lang} t={dict.index} />

      <Zig id="f-slides" tone="light" media="right" icons={icons("slides-link")} {...f.slides} cta={{ href: href("slides-link"), label: f.slides.cta }}>
        <ScreenStage stage={topStage("slides-link")} lang={lang} />
      </Zig>

      <Zig id="f-supplement" tone="tint" media="left" icons={icons("supplement")} {...f.supplement} cta={{ href: href("supplement"), label: f.supplement.cta }}>
        <ScreenStage stage={topStage("supplement")} lang={lang} />
      </Zig>

      <Connected t={f.connected} />

      <Zig id="f-lists" tone="light" media="right" icons={icons("wordbook-graph")} {...f.lists} cta={{ href: href("wordbook-graph"), label: f.lists.cta }}>
        <ScreenStage stage={topStage("wordbook-graph")} lang={lang} />
      </Zig>

      <Zig id="f-mcp" tone="tint" media="left" className="lp-zig-mcp" icons={icons("mcp")} {...f.mcp} cta={{ href: href("mcp"), label: f.mcp.cta }}>
        <McpMedia label={f.mcp.chatLabel} chat={f.mcp.chat} />
      </Zig>

      <Privacy t={dict.privacy} />
      <Start t={dict.start} lang={lang} tour={tourStage()} pre={prerelease ? dict.prerelease : undefined} />
      <Motion />
    </>
  );
}
