import "./landing.css";
import { notFound } from "next/navigation";
import { Hero } from "@/components/landing/Hero";
import { UseCases } from "@/components/landing/UseCases";
import { RibbonMap } from "@/components/landing/RibbonMap";
import { Zig } from "@/components/landing/Zig";
import { Connected } from "@/components/landing/Connected";
import { McpMedia } from "@/components/landing/McpMedia";
import { Privacy } from "@/components/landing/Privacy";
import { Start } from "@/components/landing/Start";
import { Closing } from "@/components/landing/Closing";
import { Motion } from "@/components/landing/Motion";
import { ScreenStage } from "@/components/features/ScreenStage";
import {
  BotIcon,
  FilesIcon,
  ListChecksIcon,
  PanelRightIcon,
  PresentationIcon,
  SearchIcon,
  WaypointsIcon,
} from "@/components/icons";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { stages } from "@/lib/scenes";
import { featureHref } from "@/lib/site";

/**
 * 流れ（地の色）:
 * ヒーロー（紺）→ 使い方（白）→ 画面の見取り図 #features（淡）
 * → できること: スライドと論文（白・写真右）→ 補足情報（淡・写真左）→ 3 つがつながる（紺）
 *   → 単語帳とグラフ（白・写真右）→ Claude と使う（淡・写真左）→ 論文一覧と検索（白・写真右、縦長）
 * → プライバシー（淡）→ はじめ方 #download（白）→ 締め（紺）
 */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const k = dict.kickers;
  const f = dict.features;
  const href = (slug: Parameters<typeof featureHref>[1]) => featureHref(lang, slug);

  return (
    <>
      <Hero dict={dict} />
      <UseCases t={dict.uses} kicker={k.uses} />
      <RibbonMap lang={lang} t={dict.map} kicker={k.map} />

      <Zig
        id="f-slides"
        tone="light"
        media="right"
        icons={[<PresentationIcon key="p" size={20} />]}
        {...f.slides}
        cta={{ href: href("slides-link"), label: f.slides.cta }}
        intro={
          <header className="lp-section-head lp-zig-intro" data-reveal>
            <p className="lp-kicker">{k.features}</p>
            <h2 className="lp-h2">{f.title}</h2>
          </header>
        }
      >
        <ScreenStage stage={stages["slides-link"]} lang={lang} />
      </Zig>

      <Zig
        id="f-supplement"
        tone="tint"
        media="left"
        icons={[<PanelRightIcon key="p" size={20} />]}
        {...f.supplement}
        cta={{ href: href("supplement"), label: f.supplement.cta }}
      >
        <ScreenStage stage={stages.supplement} lang={lang} />
      </Zig>

      <Connected lang={lang} t={f.connected} stage={stages.hero} />

      <Zig
        id="f-lists"
        tone="light"
        media="right"
        icons={[<ListChecksIcon key="l" size={20} />, <WaypointsIcon key="w" size={20} />]}
        {...f.lists}
        cta={{ href: href("wordbook-graph"), label: f.lists.cta }}
      >
        <ScreenStage stage={stages["wordbook-graph"]} lang={lang} />
      </Zig>

      <Zig
        id="f-mcp"
        tone="tint"
        media="left"
        icons={[<BotIcon key="b" size={20} />]}
        {...f.mcp}
        cta={{ href: href("mcp"), label: f.mcp.cta }}
      >
        <McpMedia stage={stages.mcp} lang={lang} label={f.mcp.chatLabel} chat={f.mcp.chat} />
      </Zig>

      <Zig
        id="f-library"
        tone="light"
        media="right"
        compact
        icons={[<FilesIcon key="f" size={20} />, <SearchIcon key="s" size={20} />]}
        {...f.library}
        cta={{ href: href("library-search"), label: f.library.cta }}
      >
        <ScreenStage stage={stages["library-search"]} lang={lang} />
      </Zig>

      <Privacy t={dict.privacy} kicker={k.privacy} />
      <Start t={dict.start} kicker={k.start} />
      <Closing dict={dict} />
      <Motion />
    </>
  );
}
