import type { ReactNode } from "react";
import {
  BotIcon,
  CircleHelpIcon,
  FilesIcon,
  ListChecksIcon,
  PanelRightIcon,
  PresentationIcon,
  SearchIcon,
  SettingsIcon,
  WaypointsIcon,
} from "@/components/icons";
import type { Scene, Stage } from "@/lib/stage-types";
import { featureSlugs, type FeatureSlug } from "@/lib/site";
import { stages } from "@/lib/scenes";

/** 画面写真の 1 枚の切り抜き（ヒーローの静止画・一覧のカードの絵・ページごとの図）。座標は画像に対する % */
export type Crop = {
  /** public/screenshots/stages/ のファイル名（拡張子なし） */
  shot: string;
  rect: Scene["rect"];
  /** 狭い画面（1000px 以下）で使う範囲 */
  narrow?: Scene["rect"];
  aspect?: string;
  narrowAspect?: string;
};

/**
 * 手順の並べ方。
 * - sticky: 画面写真を横に固定し、スクロールで場面を替える（広い画面）。狭い画面では手順ごとの静止画
 * - stills: 手順ごとに静止画のカード（同じ画像ばかりの論文一覧のページ）
 * - text: 画面写真なし（MCP。結果の画面はヒーローの会話と一緒に見せる）
 */
export type StepLayout = "sticky" | "stills" | "text";

/**
 * 機能のページの、文言でない部分（アイコン・MCP のツール名・手順と場面の対応・切り抜き）。
 * ツール名は PaperLens の MCP サーバーにある実際の名前。
 */
export type FeatureConfig = {
  icon: (p: { size?: number }) => ReactNode;
  tools: string[];
  /**
   * 手順 i で見せる場面の番号（lib/scenes.ts の stages[slug].scenes の番号）。
   * chapterStages で別の Stage を使う章では、その Stage の場面の番号。
   */
  stepScenes: number[];
  /** 章 id → その章で使う Stage（lib/scenes.ts の stages のキー）。無い章は stages[slug] */
  chapterStages?: Record<string, string>;
  /** 手順 i の li に付ける id（一覧のページからのリンク先） */
  stepAnchors?: Record<number, string>;
  layout: StepLayout;
  /** 静止画の枠の縦横比（stills のとき） */
  stillAspect?: string;
  /** ヒーローの静止画（mcp は会話と動く画面なので無し）。手順の場面とは違う切り方にする */
  hero?: Crop;
  /** 一覧のカードの絵（16:9） */
  thumb: Crop & { contain?: boolean };
};

export const featureConfig: Record<FeatureSlug, FeatureConfig> = {
  "slides-link": {
    icon: PresentationIcon,
    tools: ["import_slides", "add_slide_markup", "link_slide_markup", "get_slide_markups", "read_slide_text", "set_slide_markup_memo"],
    // 章「つないで、行き来する」: slides-link の場面 0〜4 ／ 章「発表する」: present の場面 0〜3
    // （0 二つの画面 / 1 発表の窓の線 / 2 台本のメモ / 3 台本の見出しと「発表を終える」）
    stepScenes: [0, 1, 2, 3, 4, 0, 1, 2, 3],
    chapterStages: { present: "present" },
    layout: "sticky",
    // 全体（グループから論文へ線が伸びている）。狭い画面ではグループと線
    hero: { shot: "slides-linked", rect: { x: 3.82, y: 3.94, w: 96.18, h: 96.06 }, narrow: { x: 2.5, y: 36, w: 64, h: 50 } },
    thumb: { shot: "slides-linked", rect: { x: 3.4, y: 34, w: 96.6, h: 60 } },
  },
  supplement: {
    icon: PanelRightIcon,
    tools: ["add_term", "add_equation", "add_highlight", "set_translations", "update_glossary", "add_sentence_note"],
    stepScenes: [0, 1, 2, 3, 4],
    layout: "sticky",
    // 論文と、隣の用語タブ（全体）。狭い画面では用語のカード
    hero: { shot: "glossary", rect: { x: 3.6, y: 4, w: 96.4, h: 96 }, narrow: { x: 35, y: 20, w: 64, h: 40 } },
    thumb: { shot: "glossary", rect: { x: 34.76, y: 19, w: 65.24, h: 60 } },
  },
  "wordbook-graph": {
    icon: ListChecksIcon,
    tools: ["get_lists", "get_graph", "add_term", "update_term"],
    stepScenes: [0, 1, 2, 3, 4],
    layout: "sticky",
    // 単語帳（リストの窓）。狭い画面では項目
    hero: { shot: "wordbook", rect: { x: 4, y: 4, w: 92, h: 92 }, narrow: { x: 27, y: 9, w: 66, h: 50 } },
    thumb: { shot: "graph-overview", rect: { x: 18, y: 14, w: 66, h: 60 } },
  },
  mcp: {
    icon: BotIcon,
    tools: [],
    stepScenes: [],
    layout: "text",
    thumb: { shot: "equation", rect: { x: 34.07, y: 30, w: 65.93, h: 55 } },
  },
  "library-search": {
    icon: FilesIcon,
    tools: ["import_paper", "list_papers", "search_notes", "get_bibtex"],
    // 手順: 取り込む / 絞り込んで並べ替える / BibTeX ／ 検索
    stepScenes: [0, 1, 3, 4],
    layout: "stills",
    stillAspect: "4/3",
    hero: { shot: "library", rect: { x: 0, y: 0, w: 100, h: 63.76 }, aspect: "3/4", narrow: { x: 0, y: 0, w: 100, h: 45 }, narrowAspect: "4/3" },
    thumb: { shot: "library", rect: { x: 0, y: 0, w: 100, h: 100 }, contain: true },
  },
};

const SHOT_DIR = "/screenshots/stages/";

/**
 * lib/scenes.ts の Stage をキーで引く（無ければ undefined）。
 * 場面のデータは別の作業で増えるので、キーの型に縛らずに引けるようにしておく。
 */
export function stageByKey(key: string): Stage | undefined {
  return (stages as Record<string, Stage | undefined>)[key];
}

/** 対訳タブの本物の画面（lib/scenes.ts のどこかの場面が使っていれば true） */
export const TRANSLATION_SHOT = "translation";
export function hasShot(shot: string) {
  const src = `/screenshots/stages/${shot}.webp`;
  return Object.values(stages).some((s) => s.src === src || s.scenes.some((x) => x.src === src));
}

/** 切り抜きを、場面 1 つだけの Stage にする（StageView / StageStill にそのまま渡せる） */
export function cropStage(slug: FeatureSlug, crop: Crop, alt: { ja: string; en: string }): Stage {
  const base = stages[slug];
  const src = `${SHOT_DIR}${crop.shot}.webp`;
  const portrait = crop.shot === "library";
  const others = Object.values(stages);
  // 大きさは同じ画像を使っている Stage から取る
  const owner = others.find((s) => s.src === src || s.scenes.some((x) => x.src === src)) ?? base;
  const has800 = !portrait;
  return {
    id: `${slug}:${crop.shot}`,
    src,
    srcSet: has800 ? `${SHOT_DIR}${crop.shot}-800.webp 800w, ${src} ${owner.width}w` : "",
    width: owner.width,
    height: owner.height,
    alt,
    scenes: [{ rect: crop.rect, callouts: [], caption: alt, mobileRect: crop.narrow }],
  };
}

/** 一覧のページの「左端のアイコン」: アイコンとリンク先 */
export const ribbonConfig: Record<string, { icon: (p: { size?: number }) => ReactNode; slug?: FeatureSlug; hash?: string }> = {
  files: { icon: FilesIcon, slug: "library-search", hash: "library" },
  search: { icon: SearchIcon, slug: "library-search", hash: "search" },
  lists: { icon: ListChecksIcon, slug: "wordbook-graph", hash: "wordbook" },
  graph: { icon: WaypointsIcon, slug: "wordbook-graph", hash: "graph" },
  slides: { icon: PresentationIcon, slug: "slides-link" },
  settings: { icon: SettingsIcon },
  help: { icon: CircleHelpIcon },
};

export function isFeatureSlug(v: string): v is FeatureSlug {
  return (featureSlugs as readonly string[]).includes(v);
}

/** 「ほかの機能」: 自分以外の 4 つ（並びはサイト全体の機能の順） */
export function otherFeatures(slug: FeatureSlug) {
  return featureSlugs.filter((s) => s !== slug);
}
