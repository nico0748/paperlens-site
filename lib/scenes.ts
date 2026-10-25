/**
 * ScreenStage の場面データ。scripts/make-stages.py が書き出す（手で直さず、スクリプトを直して再実行する）。
 *
 * - 座標はすべて画像に対する割合（0〜100）。1 つの Stage の中の画像（src と各 scene.src）は同じ大きさ。
 * - scene.src の 800w 版は同じ名前に -800 を付けたファイル（例: equation.webp → equation-800.webp）。
 * - 吹き出し: box は (x, y) が左上で w, h が大きさ。dot は (x, y) が中心。underline は (x, y) が左端で w が長さ。
 * - rect と mobileRect は枠の縦横比（stageMeta[key].aspect）に合わせてある。mobileRect は狭い画面の静止画用の、より寄った範囲（無い場面もある）。
 * - 場面の並びは詳細ページの手順の順（components/features/data.tsx の stepScenes で対応させる）。最初に見せる場面は stageMeta[key].strongestScene。
 */
import type { Stage } from "./stage-types";

export type StageKey = "hero" | "slides-link" | "supplement" | "wordbook-graph" | "mcp" | "library-search" | "present" | "tour";

export const stages: Record<StageKey, Stage> = {
  hero: {
    id: "hero",
    src: "/screenshots/stages/slides-linked.webp",
    srcSet: "/screenshots/stages/slides-linked-800.webp 800w, /screenshots/stages/slides-linked.webp 2400w",
    width: 2400,
    height: 1502,
    alt: { ja: "スライドの囲み Markup-02.01 から、論文の文と数式へ色の線が伸びている。", en: "Colored lines run from the box Markup-02.01 on a slide to a sentence and an equation in the paper." },
    scenes: [
      {
        rect: { x: 3.82, y: 3.94, w: 96.18, h: 96.06 },
        callouts: [
          { kind: "box", x: 7.02, y: 44.66, w: 12.95, h: 32.79 },
          { kind: "box", x: 71.4, y: 42.48, w: 13.97, h: 10.89 },
        ],
        caption: { ja: "スライドで囲んだグループと、論文の文や数式が、同じ色の線で結ばれます。", en: "A group boxed on a slide and a sentence or equation in the paper are joined by lines in the same color." },
      },
      {
        rect: { x: 3.41, y: 39.22, w: 40.9, h: 40.85 },
        callouts: [
          { kind: "box", x: 7.02, y: 44.66, w: 12.95, h: 32.79 },
        ],
        caption: { ja: "スライドの一部を囲むと、Markup-02.01 のような名前のグループになります。", en: "Box part of a slide, and it becomes a group with a name like Markup-02.01." },
      },
      {
        rect: { x: 47.1, y: 17.97, w: 52.9, h: 52.83 },
        callouts: [
          { kind: "box", x: 71.4, y: 42.48, w: 13.97, h: 10.89 },
          { kind: "box", x: 83.16, y: 37.47, w: 2.59, h: 4.14 },
        ],
        caption: { ja: "線の先は論文の文や数式です。論文側の色の印を押すと、スライドのそのページが開きます。", en: "The lines end at sentences and equations in the paper. Click a colored marker there to open that slide." },
      },
      {
        rect: { x: 34.07, y: 8.17, w: 65.93, h: 65.85 },
        callouts: [
          { kind: "box", x: 93.39, y: 11.22, w: 5.86, h: 4.68 },
          { kind: "underline", x: 35.79, y: 26.25, w: 23.52 },
        ],
        caption: { ja: "［補足情報］に切り替えると、論文の右に対訳・訳・用語・数式のタブが並びます。", en: "Switch to 補足情報 (Companion), and tabs for 対訳 (Side by side), 訳 (Highlights), 用語 (Terms), and 数式 (Equations) sit beside the paper." },
        src: "/screenshots/stages/equation.webp",
      },
      {
        rect: { x: 34.07, y: 20.7, w: 65.93, h: 65.85 },
        callouts: [
          { kind: "box", x: 36.54, y: 46.08, w: 60.05, h: 10.02 },
        ],
        caption: { ja: "「用語を調べる」を押すと、Claude が意味とこの論文での使われ方をまとめます。", en: "Choose 用語を調べる (Look up term), and Claude writes up the meaning and how this paper uses it." },
        src: "/screenshots/stages/glossary.webp",
      },
    ],
  },
  "slides-link": {
    id: "slides-link",
    src: "/screenshots/stages/slides-linked.webp",
    srcSet: "/screenshots/stages/slides-linked-800.webp 800w, /screenshots/stages/slides-linked.webp 2400w",
    width: 2400,
    height: 1502,
    alt: { ja: "スライドの囲み Markup-02.01 から、論文の文と数式へ色の線が伸びている。", en: "Colored lines run from the box Markup-02.01 on a slide to a sentence and an equation in the paper." },
    scenes: [
      {
        rect: { x: 0, y: 0, w: 100, h: 100 },
        callouts: [
          { kind: "box", x: 0.61, y: 20.81, w: 2.52, h: 3.59 },
          { kind: "underline", x: 4.64, y: 19.72, w: 8.66 },
          { kind: "underline", x: 55.08, y: 19.72, w: 5.32 },
        ],
        caption: { ja: "左端の「発表スライドと論文の対応」から PDF か PPTX を取り込むと、スライドが論文の左に並びます。", en: "Import a PDF or PPTX from 発表スライドと論文の対応 (Slides and paper) on the left edge, and the slides appear to the left of the paper." },
        src: "/screenshots/stages/slides-import.webp",
        mobileRect: { x: 0, y: 9.8, w: 51.15, h: 51.09 },
      },
      {
        rect: { x: 3.41, y: 39.22, w: 40.9, h: 40.85 },
        callouts: [
          { kind: "box", x: 7.02, y: 44.66, w: 12.95, h: 32.79 },
        ],
        caption: { ja: "「囲む」（R）でスライドをドラッグすると、Markup-02.01 のような名前のグループになります。", en: "Drag across the slide with 囲む (Box, R), and the area becomes a group named like Markup-02.01." },
      },
      {
        rect: { x: 52.83, y: 7.08, w: 47.17, h: 47.11 },
        callouts: [
          {
            kind: "box",
            x: 54.94,
            y: 11.22,
            w: 13.16,
            h: 4.58,
            text: { ja: "文章・図・数式", en: "文章 · 図 · 数式" },
          },
          { kind: "box", x: 71.4, y: 42.48, w: 13.97, h: 10.89 },
        ],
        caption: { ja: "グループを選んだまま、論文の文・図・数式を選ぶと、同じ色の線で結ばれます。", en: "With the group selected, pick a sentence (文章), figure (図), or equation (数式) in the paper, and a line in the group's color joins them." },
      },
      {
        rect: { x: 0, y: 0, w: 100, h: 100 },
        callouts: [
          { kind: "box", x: 7.02, y: 44.66, w: 12.95, h: 32.79 },
          {
            kind: "box",
            x: 83.16,
            y: 37.47,
            w: 2.59,
            h: 4.14,
            text: { ja: "色の印", en: "Marker" },
          },
          { kind: "box", x: 71.57, y: 64.27, w: 2.59, h: 4.14 },
        ],
        caption: { ja: "グループを押すと論文の該当箇所へ、論文側の色の印を押すとスライドへ移ります。", en: "Click a group to jump to the passage; click the colored marker in the paper to jump to the slide." },
        mobileRect: { x: 44.31, y: 27.23, w: 55.69, h: 55.62 },
      },
      {
        rect: { x: 61.28, y: 2.18, w: 38.72, h: 38.67 },
        callouts: [
          {
            kind: "box",
            x: 83.37,
            y: 6.1,
            w: 9.41,
            h: 4.36,
            text: { ja: "選んだ線だけ", en: "選んだ線だけ (Selected lines)" },
          },
          {
            kind: "box",
            x: 94.07,
            y: 6.1,
            w: 4.98,
            h: 4.36,
            text: { ja: "発表 P", en: "発表 (Present) P" },
          },
        ],
        caption: { ja: "「発表」（P）で、スライドと論文を線ごと別の画面に映して発表できます。", en: "Press 発表 (Present, P) to show the slides and paper, lines included, on a separate screen for your talk." },
        src: "/screenshots/stages/translation.webp",
      },
    ],
  },
  supplement: {
    id: "supplement",
    src: "/screenshots/stages/equation.webp",
    srcSet: "/screenshots/stages/equation-800.webp 800w, /screenshots/stages/equation.webp 2400w",
    width: 2400,
    height: 1502,
    alt: { ja: "論文の隣の補足情報で、数式タブに式 (11) の TeX と記号の意味が出ている。", en: "The Equations tab beside the paper shows equation (11) in TeX with each symbol explained." },
    scenes: [
      {
        rect: { x: 34.76, y: 1.46, w: 65.24, h: 65.16 },
        callouts: [
          { kind: "box", x: 93.39, y: 11.22, w: 5.86, h: 4.68 },
          { kind: "underline", x: 35.79, y: 26.25, w: 23.52 },
        ],
        caption: { ja: "右上の［補足情報］に切り替えると、論文の右に対訳・訳・用語・数式のタブが並びます。", en: "Switch to 補足情報 (Companion) at the top right, and tabs for 対訳 (Side by side), 訳 (Highlights), 用語 (Terms), and 数式 (Equations) sit to the right of the paper." },
      },
      {
        rect: { x: 34.76, y: 20.7, w: 64.08, h: 64 },
        callouts: [
          { kind: "underline", x: 43.87, y: 26.25, w: 5.56 },
          { kind: "box", x: 36.54, y: 46.08, w: 60.05, h: 10.02 },
          { kind: "box", x: 36.54, y: 56.64, w: 41.85, h: 6.43 },
        ],
        caption: { ja: "「用語を調べる」を押すと、Claude が意味・詳しい説明・この論文での使われ方・関連する用語をまとめます。", en: "Choose 用語を調べる (Look up term), and Claude writes up the meaning, details, how this paper uses it, and related terms." },
        src: "/screenshots/stages/glossary.webp",
      },
      {
        rect: { x: 34.07, y: 30.23, w: 65.93, h: 65.85 },
        callouts: [
          {
            kind: "box",
            x: 36.91,
            y: 54.25,
            w: 60.26,
            h: 10.95,
            text: { ja: "TeX", en: "TeX" },
          },
          { kind: "underline", x: 36.91, y: 75.11, w: 60.26 },
          { kind: "box", x: 36.91, y: 77.23, w: 60.36, h: 18.57 },
        ],
        caption: { ja: "式を選んで「数式にする」を押すと、Claude が TeX に書き起こし、式の役割と記号ごとの意味を添えます。", en: "Select an equation and choose 数式にする (Make equation). Claude transcribes it into TeX and explains what it does and what each symbol means." },
      },
      {
        rect: { x: 34.56, y: 16.34, w: 65.44, h: 65.36 },
        callouts: [
          {
            kind: "box",
            x: 50.17,
            y: 22,
            w: 4.43,
            h: 4.36,
            text: { ja: "対訳", en: "対訳 (Side by side)" },
          },
          { kind: "box", x: 50.58, y: 48.97, w: 47.82, h: 30.94 },
        ],
        caption: { ja: "Claude に頼んだ全文の訳は、対訳タブに原文と 1 文ずつ並びます。", en: "The full translation you ask Claude for fills the 対訳 (Side by side) tab, each sentence under its original." },
        src: "/screenshots/stages/translation.webp",
      },
      {
        rect: { x: 0, y: 0, w: 100, h: 100 },
        callouts: [
          { kind: "box", x: 7.16, y: 78.98, w: 11.93, h: 8.93 },
          { kind: "box", x: 93.39, y: 11.22, w: 5.86, h: 4.68 },
        ],
        caption: { ja: "スライドの画面でも［論文｜補足情報］に切り替えられます。式や用語の場所を押すと、論文がそこへ動きます。", en: "The slides view can switch to [paper | 補足情報] too. Click where an equation or term appears, and the paper moves there." },
        mobileRect: { x: 0, y: 50.3, w: 49.76, h: 49.7 },
      },
    ],
  },
  "wordbook-graph": {
    id: "wordbook-graph",
    src: "/screenshots/stages/wordbook.webp",
    srcSet: "/screenshots/stages/wordbook-800.webp 800w, /screenshots/stages/wordbook.webp 2400w",
    width: 2400,
    height: 1502,
    alt: { ja: "すべての論文の用語を集めた単語帳。", en: "The wordbook, with terms from every paper." },
    scenes: [
      {
        rect: { x: 0, y: 0, w: 100, h: 100 },
        callouts: [
          { kind: "box", x: 0.61, y: 10.78, w: 2.66, h: 4.36 },
          { kind: "box", x: 30.13, y: 11.11, w: 6.07, h: 4.47 },
        ],
        caption: { ja: "左端の「リスト（用語・数式）」を開くと、すべての論文の用語が単語帳に並びます。", en: "Open リスト (Lists) on the left edge, and terms from all your papers fill the 単語帳 (Wordbook)." },
        mobileRect: { x: 0, y: 8.17, w: 27.27, h: 27.23 },
      },
      {
        rect: { x: 5.11, y: 4.89, w: 85.21, h: 85.1 },
        callouts: [
          {
            kind: "box",
            x: 6,
            y: 9.04,
            w: 20.48,
            h: 4.68,
            text: { ja: "検索", en: "Search" },
          },
          { kind: "box", x: 6.07, y: 23.42, w: 20.42, h: 4.14 },
          {
            kind: "box",
            x: 68.71,
            y: 14.49,
            w: 19.36,
            h: 4.58,
            text: { ja: "並べ替え", en: "Sort" },
          },
        ],
        caption: { ja: "検索欄で絞り込み、「論文・ページ順」と「五十音・ABC順」を切り替えます。「数式帳」には書き起こした式が並びます。", en: "Narrow the list with the search box, and switch between 論文・ページ順 (by paper and page) and 五十音・ABC順 (alphabetical). 数式帳 (Equations) lists your transcribed equations." },
      },
      {
        rect: { x: 29.31, y: 25.59, w: 42.94, h: 42.89 },
        callouts: [
          { kind: "box", x: 30.13, y: 47.39, w: 4.84, h: 3.81 },
        ],
        caption: { ja: "項目のページ番号を押すと、その論文の該当ページが開きます。", en: "Click an entry's page number to open the paper at that page." },
      },
      {
        rect: { x: 17.59, y: 20.7, w: 75.26, h: 75.16 },
        callouts: [
          { kind: "box", x: 36.67, y: 35.62, w: 22.8, h: 2.72 },
          { kind: "box", x: 60.46, y: 68.63, w: 22.7, h: 2.72 },
          {
            kind: "box",
            x: 44.31,
            y: 46.3,
            w: 5.45,
            h: 8.17,
            text: { ja: "共通の用語", en: "Shared terms" },
          },
        ],
        caption: { ja: "「グラフ」では論文と用語が線で結ばれます。同じ用語を使う論文どうしは、その用語を通してつながります。", en: "In グラフ (Graph), papers and terms are joined by lines. Papers that use the same term connect through it." },
        src: "/screenshots/stages/graph-overview.webp",
        mobileRect: { x: 34.07, y: 30.5, w: 49.79, h: 49.73 },
      },
      {
        rect: { x: 19.29, y: 5.72, w: 80.71, h: 80.61 },
        callouts: [
          { kind: "box", x: 33.67, y: 50.98, w: 18.81, h: 4.25 },
          { kind: "box", x: 69.8, y: 52.61, w: 26.79, h: 10.13 },
        ],
        caption: { ja: "用語を選ぶと、意味と「出てくる論文」が表示されます。", en: "Select a term to see its meaning and 出てくる論文 (the papers that use it)." },
        src: "/screenshots/stages/graph-term.webp",
      },
    ],
  },
  mcp: {
    id: "mcp",
    src: "/screenshots/stages/equation.webp",
    srcSet: "/screenshots/stages/equation-800.webp 800w, /screenshots/stages/equation.webp 2400w",
    width: 2400,
    height: 1502,
    alt: { ja: "論文の隣の補足情報で、数式タブに式 (11) の TeX と記号の意味が出ている。", en: "The Equations tab beside the paper shows equation (11) in TeX with each symbol explained." },
    scenes: [
      {
        rect: { x: 38.38, y: 19.61, w: 61.62, h: 61.55 },
        callouts: [
          { kind: "box", x: 50.37, y: 27.45, w: 47.92, h: 3.49 },
          { kind: "box", x: 50.58, y: 48.97, w: 47.82, h: 30.94 },
        ],
        caption: { ja: "「全文を訳して」と頼むと、Claude が 1 文ずつ訳して、対訳タブに入れます。", en: "Ask \"Translate the whole paper,\" and Claude translates it sentence by sentence into the 対訳 (Side by side) tab." },
        src: "/screenshots/stages/translation.webp",
      },
      {
        rect: { x: 34.07, y: 17.97, w: 65.93, h: 65.85 },
        callouts: [
          { kind: "underline", x: 49.69, y: 26.25, w: 5.93 },
          { kind: "box", x: 36.91, y: 34.1, w: 60.26, h: 19.66 },
        ],
        caption: { ja: "「式 (11) を解説して」と頼むと、Claude が TeX に書き起こし、数式タブに登録します。", en: "Ask \"Explain equation (11),\" and Claude transcribes it into TeX and adds it to the 数式 (Equations) tab." },
      },
      {
        rect: { x: 34.07, y: 20.7, w: 65.93, h: 65.85 },
        callouts: [
          { kind: "box", x: 35.72, y: 26.91, w: 62.37, h: 37.25 },
          { kind: "box", x: 90.25, y: 26.8, w: 3.2, h: 2.89 },
        ],
        caption: { ja: "「この用語も調べて入れておいて」と頼むと、用語タブに入ります。「編集」でいつでも直せます。", en: "Ask \"Look this term up too,\" and it goes into the 用語 (Terms) tab. 編集 (Edit) lets you change it any time." },
        src: "/screenshots/stages/glossary.webp",
      },
      {
        rect: { x: 3.82, y: 3.94, w: 96.18, h: 96.06 },
        callouts: [
          { kind: "box", x: 7.02, y: 44.66, w: 12.95, h: 32.79 },
          { kind: "box", x: 71.4, y: 42.48, w: 13.97, h: 10.89 },
        ],
        caption: { ja: "スライドのグループを論文の箇所とリンクするよう頼むと、両方が同じ色の線で結ばれます。", en: "Ask Claude to link a slide group to a passage in the paper, and a line in the group's color joins them." },
        src: "/screenshots/stages/slides-linked.webp",
        mobileRect: { x: 47.1, y: 17.97, w: 52.9, h: 52.83 },
      },
    ],
  },
  "library-search": {
    id: "library-search",
    src: "/screenshots/stages/library.webp",
    srcSet: "/screenshots/stages/library.webp 636w",
    width: 636,
    height: 1330,
    alt: { ja: "左の論文一覧。検索欄、並べ替え、BibTeX の書き出しがある。", en: "The paper list on the left, with search, sorting, and BibTeX export." },
    scenes: [
      {
        rect: { x: 0, y: 0, w: 100, h: 63.76 },
        callouts: [
          { kind: "box", x: 2.52, y: 2.11, w: 11.64, h: 5.56 },
        ],
        caption: { ja: "左端の「論文一覧」に、取り込んだ論文が並びます。", en: "Papers you import are listed under 論文一覧 (Papers) on the left edge." },
      },
      {
        rect: { x: 0, y: 6.77, w: 100, h: 63.76 },
        callouts: [
          { kind: "box", x: 20.44, y: 9.62, w: 77.04, h: 6.77 },
        ],
        caption: { ja: "一覧の上の検索欄に、題名・著者・年・タグを入れて絞り込みます。", en: "Type a title, author, year, or tag into the search box to narrow the list." },
      },
      {
        rect: { x: 0, y: 24.81, w: 100, h: 63.76 },
        callouts: [
          { kind: "box", x: 41.51, y: 29.62, w: 39.94, h: 4.66 },
        ],
        caption: { ja: "追加日・題名・発行年で並べ替えられます。", en: "Sort by date added, title, or year." },
      },
      {
        rect: { x: 0, y: 36.24, w: 100, h: 63.76 },
        callouts: [
          { kind: "box", x: 24.84, y: 92.63, w: 66.98, h: 4.96 },
        ],
        caption: { ja: "「すべての BibTeX を書き出す」で、一覧の論文をまとめて書き出せます。", en: "すべての BibTeX を書き出す (Export all BibTeX) exports every paper in the list at once." },
      },
      {
        rect: { x: 0, y: 0, w: 100, h: 63.76 },
        callouts: [
          { kind: "box", x: 2.52, y: 8.72, w: 11.64, h: 5.56 },
        ],
        caption: { ja: "左端の「検索」では、論文の題名と、マーカーに付けた訳・メモ、用語、数式を探せます。", en: "検索 (Search) on the left edge looks through paper titles and what you've written down: highlight translations and notes, terms, and equations." },
      },
    ],
  },
  present: {
    id: "present",
    src: "/screenshots/stages/present-dual.webp",
    srcSet: "/screenshots/stages/present-dual-800.webp 800w, /screenshots/stages/present-dual.webp 2400w",
    width: 2400,
    height: 1200,
    alt: { ja: "発表中の 2 つの画面。左の画面にスライドと論文が線でつながって映り、右の窓に台本が出ている。", en: "Presenting on two screens: the slides and paper, joined by lines, on the left; the script in the window on the right." },
    scenes: [
      {
        rect: { x: 1.09, y: 1.09, w: 97.82, h: 97.82 },
        callouts: [
          {
            kind: "box",
            x: 1.43,
            y: 19.09,
            w: 54.19,
            h: 61.83,
            text: { ja: "発表の窓", en: "Presentation window" },
          },
          {
            kind: "box",
            x: 56.85,
            y: 27.81,
            w: 41.72,
            h: 53.1,
            text: { ja: "台本", en: "Script" },
          },
        ],
        caption: { ja: "「発表」（P）を押すと、スライドと論文が別の画面に映り、手元の窓には台本が出ます。", en: "Press 発表 (Present, P), and the slides and paper go to another screen while your own window shows a script." },
      },
      {
        rect: { x: 1.06, y: 13.29, w: 77.3, h: 77.3 },
        callouts: [
          { kind: "box", x: 2.42, y: 46.08, w: 10.74, h: 33.2 },
          { kind: "box", x: 56, y: 20.38, w: 20.38, h: 17.11 },
          { kind: "box", x: 56.54, y: 66.53, w: 19.12, h: 10.29 },
        ],
        caption: { ja: "発表の窓には、スライドと論文が線でつながったまま映ります。", en: "The presentation window shows the slides and paper with their link lines in place." },
        src: "/screenshots/stages/present-window.webp",
        mobileRect: { x: 11.76, y: 18.47, w: 65.3, h: 65.3 },
      },
      {
        rect: { x: 12.27, y: 12.44, w: 78.73, h: 78.73 },
        callouts: [
          { kind: "box", x: 14.66, y: 24.68, w: 14.31, h: 3.82 },
          { kind: "box", x: 14.45, y: 29.31, w: 75.8, h: 57.81 },
        ],
        caption: { ja: "台本にはスライドごとにグループのメモが並び、押すと発表の窓がそのスライドへ移ります。", en: "The script lists each slide's group memos; click one, and the presentation window moves to that slide." },
        src: "/screenshots/stages/present-script.webp",
        mobileRect: { x: 12.27, y: 15.68, w: 45.67, h: 45.67 },
      },
      {
        rect: { x: 0.68, y: 0.68, w: 98.64, h: 98.64 },
        callouts: [
          { kind: "box", x: 13.09, y: 7.77, w: 14.59, h: 4.91 },
          { kind: "box", x: 89.91, y: 7.77, w: 9, h: 4.91 },
        ],
        caption: { ja: "← → でスライドを送り、「発表を終える」か P で元の画面に戻ります。", en: "Use ← and → to change slides; 発表を終える (End presentation) or P takes you back." },
        src: "/screenshots/stages/present-script.webp",
        mobileRect: { x: 3.41, y: 4.77, w: 30.67, h: 30.67 },
      },
    ],
  },
  tour: {
    id: "tour",
    src: "/screenshots/stages/tour-select.webp",
    srcSet: "/screenshots/stages/tour-select-800.webp 800w, /screenshots/stages/tour-select.webp 2400w",
    width: 2400,
    height: 1502,
    alt: { ja: "初回の案内。論文の上に「文を選んで記録する」の説明が出ている。", en: "The first-launch tour: a card titled 文を選んで記録する (Select sentences to save them) over the paper." },
    scenes: [
      {
        rect: { x: 21.81, y: 40.77, w: 59.3, h: 59.23 },
        callouts: [
          { kind: "box", x: 35.99, y: 63.34, w: 30.74, h: 32.73 },
        ],
        caption: { ja: "初めて起動すると、画面の案内が始まります。", en: "The first time you launch PaperLens, a guided tour of the screen begins." },
        mobileRect: { x: 33.66, y: 62.09, w: 35.45, h: 35.4 },
      },
      {
        rect: { x: 29.99, y: 0, w: 49.76, h: 49.7 },
        callouts: [
          { kind: "box", x: 63.8, y: 0, w: 6.34, h: 7.73 },
        ],
        caption: { ja: "対訳タブを示し、原文と訳を 1 文ずつ並べて読めることを説明します。", en: "It points to the 対訳 (Side by side) tab and explains reading each sentence next to its translation." },
        src: "/screenshots/stages/tour-translation.webp",
        mobileRect: { x: 30.47, y: 0, w: 41.99, h: 41.94 },
      },
      {
        rect: { x: 0, y: 0.61, w: 51.12, h: 51.06 },
        callouts: [
          { kind: "box", x: 0, y: 18.68, w: 4.23, h: 7.79 },
        ],
        caption: { ja: "スライドのボタンを示し、スライドの一部を論文にリンクできることを説明します。", en: "It points to the slides button and explains linking parts of a slide to the paper." },
        src: "/screenshots/stages/tour-slides.webp",
        mobileRect: { x: 0, y: 5, w: 35.79, h: 35.74 },
      },
      {
        rect: { x: 0, y: 46.9, w: 53.17, h: 53.1 },
        callouts: [
          { kind: "box", x: 0, y: 88.45, w: 4.16, h: 11.55 },
        ],
        caption: { ja: "最後に左下の設定とヘルプを示し、この案内もヘルプから見直せることを伝えます。", en: "Finally, it shows 設定 (Settings) and ヘルプ (Help) at the bottom left, where you can replay the tour." },
        src: "/screenshots/stages/tour-help.webp",
        mobileRect: { x: 0, y: 61.55, w: 38.5, h: 38.45 },
      },
    ],
  },
};

/**
 * 場面データの補足。
 * - aspect: 枠の縦横比。
 * - pairWithChat: Claude の画面は無く、MCP が書き込んだ結果のアプリ画面だけ。CSS のチャットと組み合わせる（チャットの i 行目 = 場面 i）。
 * - placeholders: 合う画面がまだ無く、近い画面で代わりに見せている場面の番号（0 始まり）。吹き出しは付けていない。
 * - strongestScene: 機能がいちばん伝わる場面の番号（0 始まり）。Stage はここから始める。
 */
export const stageMeta: Record<StageKey, { aspect: "16/10" | "3/4" | "2/1"; pairWithChat?: boolean; placeholders?: number[]; strongestScene: number }> = {
  "hero": {"aspect": "16/10", "strongestScene": 0},
  "slides-link": {"aspect": "16/10", "strongestScene": 2},
  "supplement": {"aspect": "16/10", "strongestScene": 2},
  "wordbook-graph": {"aspect": "16/10", "strongestScene": 4},
  "mcp": {"aspect": "16/10", "pairWithChat": true, "strongestScene": 1},
  "library-search": {"aspect": "3/4", "strongestScene": 1},
  "present": {"aspect": "2/1", "strongestScene": 0},
  "tour": {"aspect": "16/10", "strongestScene": 0},
};
