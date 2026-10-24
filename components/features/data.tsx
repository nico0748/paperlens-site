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
import { featureSlugs, type FeatureSlug } from "@/lib/site";

/**
 * 機能のページの、文言でない部分（アイコン・関連する機能・MCP のツール名・手順と場面の対応）。
 * ツール名は PaperLens の MCP サーバーにある実際の名前。
 */
export type FeatureConfig = {
  icon: (p: { size?: number }) => ReactNode;
  related: FeatureSlug[];
  tools: string[];
  /** 手順 i で見せる場面の番号（lib/scenes.ts では場面 i = 手順 i。場面の数を超えたら最後の場面） */
  stepScenes: number[];
  /** 手順 i の li に付ける id（一覧のページからのリンク先） */
  stepAnchors?: Record<number, string>;
};

export const featureConfig: Record<FeatureSlug, FeatureConfig> = {
  "slides-link": {
    icon: PresentationIcon,
    related: ["supplement", "mcp", "wordbook-graph"],
    tools: ["import_slides", "add_slide_markup", "link_slide_markup", "get_slide_markups", "read_slide_text", "set_slide_markup_memo"],
    stepScenes: [0, 1, 2, 3, 4],
  },
  supplement: {
    icon: PanelRightIcon,
    related: ["slides-link", "wordbook-graph", "mcp"],
    tools: ["add_term", "add_equation", "add_highlight", "set_translations", "update_glossary", "add_sentence_note"],
    stepScenes: [0, 1, 2, 3, 4],
  },
  "wordbook-graph": {
    icon: ListChecksIcon,
    related: ["supplement", "mcp", "library-search"],
    tools: ["get_lists", "get_graph", "add_term", "update_term"],
    stepScenes: [0, 1, 2, 3, 4],
    stepAnchors: { 0: "wordbook", 4: "graph" },
  },
  mcp: {
    icon: BotIcon,
    related: ["supplement", "slides-link", "library-search"],
    tools: [],
    stepScenes: [0, 1, 2, 3, 4],
  },
  "library-search": {
    icon: FilesIcon,
    related: ["wordbook-graph", "supplement", "mcp"],
    tools: ["import_paper", "list_papers", "search_notes", "get_bibtex"],
    stepScenes: [0, 1, 2, 3, 4],
    stepAnchors: { 0: "library", 4: "search" },
  },
};

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

export function neighbors(slug: FeatureSlug) {
  const i = featureSlugs.indexOf(slug);
  const n = featureSlugs.length;
  return { prev: featureSlugs[(i - 1 + n) % n], next: featureSlugs[(i + 1) % n] };
}
