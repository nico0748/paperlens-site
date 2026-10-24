/**
 * ScreenStage の場面データ。scripts/make-stages.py が書き出す（手で直さず、スクリプトを直して再実行する）。
 *
 * - 座標はすべて画像に対する割合（0〜100）。1 つの Stage の中の画像（src と各 scene.src）は同じ大きさ。
 * - scene.src の 800w 版は同じ名前に -800 を付けたファイル（例: equation.webp → equation-800.webp）。
 * - 吹き出し: box は (x, y) が左上で w, h が大きさ。dot は (x, y) が中心。underline は (x, y) が左端で w が長さ。
 * - rect は枠の縦横比（stageMeta[key].aspect）に合わせてある。
 * - 場面 i は、lib/i18n の詳細ページの手順 i と 1 対 1（hero と library-search は詳細ページの手順なし）。
 */
import type { Stage } from "./stage-types";

export type StageKey = "hero" | "slides-link" | "supplement" | "wordbook-graph" | "mcp" | "library-search";

export const stages: Record<StageKey, Stage> = {
  hero: {
    id: "hero",
    src: "/screenshots/stages/overview.webp",
    srcSet: "/screenshots/stages/overview-800.webp 800w, /screenshots/stages/overview.webp 2400w",
    width: 2400,
    height: 1502,
    alt: { ja: "左にスライド、右に論文を並べた PaperLens の画面。", en: "PaperLens with slides on the left and the paper on the right." },
    scenes: [
      {
        rect: { x: 0, y: 0, w: 100, h: 100 },
        callouts: [
          { kind: "underline", x: 4.64, y: 19.72, w: 7.63 },
          { kind: "underline", x: 70.07, y: 19.72, w: 5.32 },
        ],
        caption: { ja: "スライドと論文を並べて、1 つの画面で読みます。", en: "Slides and the paper sit side by side in one window." },
      },
      {
        rect: { x: 6.13, y: 6.25, w: 93.87, h: 93.75 },
        callouts: [
          { kind: "box", x: 7.09, y: 44.88, w: 12.85, h: 32.03 },
          { kind: "box", x: 71.92, y: 43.25, w: 12.61, h: 10.13 },
        ],
        caption: { ja: "スライドで囲んだグループと論文の箇所が、同じ色の線で結ばれます。", en: "A box on a slide and a passage in the paper are joined by a line in the same color." },
        src: "/screenshots/stages/slides-linked.webp",
      },
      {
        rect: { x: 34.07, y: 8.17, w: 65.93, h: 65.85 },
        callouts: [
          { kind: "box", x: 86.74, y: 11.22, w: 12.51, h: 4.68 },
          { kind: "underline", x: 35.79, y: 26.25, w: 23.52 },
        ],
        caption: { ja: "［補足情報］に切り替えると、論文の隣に対訳・訳・用語・数式のタブが並びます。", en: "Switch to the companion panel, and tabs for translation, terms, and equations sit beside the paper." },
        src: "/screenshots/stages/equation.webp",
      },
      {
        rect: { x: 34.07, y: 20.7, w: 65.93, h: 65.85 },
        callouts: [
          { kind: "box", x: 36.54, y: 46.08, w: 60.05, h: 10.02 },
        ],
        caption: { ja: "用語には、意味とこの論文での使われ方がまとまります。", en: "Each term comes with its meaning and how this paper uses it." },
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
          { kind: "dot", x: 1.84, y: 22.55 },
          { kind: "underline", x: 4.64, y: 19.72, w: 8.66 },
          { kind: "underline", x: 55.08, y: 19.72, w: 5.32 },
        ],
        caption: { ja: "取り込んだスライド（PDF・PPTX）が、論文の左に並びます。", en: "Imported slides (PDF or PPTX) appear to the left of the paper." },
        src: "/screenshots/stages/slides-import.webp",
      },
      {
        rect: { x: 0, y: 5.45, w: 73.62, h: 73.53 },
        callouts: [
          { kind: "box", x: 10.84, y: 6.86, w: 5.32, h: 3.38 },
          { kind: "box", x: 7.09, y: 44.88, w: 12.85, h: 32.03 },
        ],
        caption: { ja: "「囲む」でスライドをドラッグすると、Markup-02.01 のような名前のグループになります。", en: "Drag across the slide with \"Box,\" and the area becomes a group named like Markup-02.01." },
      },
      {
        rect: { x: 52.83, y: 10.35, w: 47.17, h: 47.11 },
        callouts: [
          { kind: "box", x: 54.74, y: 11.33, w: 12.75, h: 4.58 },
          { kind: "box", x: 71.92, y: 43.25, w: 12.61, h: 10.13 },
        ],
        caption: { ja: "グループを選んだまま論文の文・図・数式を指定すると、同じ色の線で結ばれます。", en: "With the group selected, pick a sentence, figure, or equation in the paper, and a line in the group's color joins them." },
      },
      {
        rect: { x: 0, y: 0, w: 100, h: 100 },
        callouts: [
          { kind: "dot", x: 8.28, y: 46.3 },
          { kind: "dot", x: 84.53, y: 39.32 },
          { kind: "dot", x: 72.84, y: 66.07 },
        ],
        caption: { ja: "グループを押すと論文の該当箇所へ、論文側の色の印を押すとスライドへ移ります。", en: "Click a group to jump to the passage; click the colored marker in the paper to jump back to the slide." },
      },
      {
        rect: { x: 23.86, y: 8.16, w: 76.14, h: 76.05 },
        callouts: [
          { kind: "box", x: 79.52, y: 11.33, w: 5.93, h: 4.58 },
        ],
        caption: { ja: "「全画面」（P）で、スライドと論文を線ごと映して発表できます。", en: "Press \"Full screen\" (P) to present the slides and paper, lines included." },
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
        rect: { x: 0, y: 44.66, w: 37.52, h: 37.47 },
        callouts: [
          { kind: "box", x: 19.09, y: 61.98, w: 11.93, h: 3.49 },
        ],
        caption: { ja: "PDF の語や文をドラッグで選ぶと、マーカーと「訳す」「用語を調べる」「数式にする」が出ます。", en: "Drag over a word or sentence in the PDF to get highlight colors plus \"Translate,\" \"Look up term,\" and \"Make equation.\"" },
      },
      {
        rect: { x: 34.76, y: 20.7, w: 64.08, h: 64 },
        callouts: [
          { kind: "underline", x: 43.87, y: 26.25, w: 5.56 },
          { kind: "box", x: 36.54, y: 46.08, w: 60.05, h: 10.02 },
          { kind: "box", x: 36.54, y: 56.64, w: 41.85, h: 6.43 },
        ],
        caption: { ja: "「用語を調べる」で、意味・詳しい説明・この論文での使われ方・関連する用語がまとまります。", en: "\"Look up term\" gathers a definition, details, how this paper uses it, and related terms." },
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
          {
            kind: "box",
            x: 36.91,
            y: 66.78,
            w: 60.26,
            h: 8.33,
            text: { ja: "式の役割", en: "What it does" },
          },
          { kind: "box", x: 36.91, y: 77.23, w: 60.36, h: 18.57 },
        ],
        caption: { ja: "「数式にする」で式を TeX に書き起こし、式の役割と記号ごとの意味を添えます。", en: "\"Make equation\" transcribes it to TeX, with what it does and what each symbol means." },
      },
      {
        rect: { x: 34.76, y: 17.97, w: 36.81, h: 36.76 },
        callouts: [
          { kind: "box", x: 35.89, y: 21.79, w: 3.48, h: 4.36 },
        ],
        caption: { ja: "Claude に頼んだ全文の訳は、対訳タブに 1 文ずつ並びます。", en: "The full translation you asked Claude for fills the Translation tab, one sentence at a time." },
      },
      {
        rect: { x: 0, y: 0, w: 100, h: 100 },
        callouts: [
          { kind: "box", x: 86.74, y: 11.22, w: 12.51, h: 4.68 },
          { kind: "box", x: 7.16, y: 78.98, w: 11.93, h: 8.93 },
        ],
        caption: { ja: "スライドの画面でも［論文｜補足情報］に切り替えられ、式や用語の場所を押すと論文がそこへ動きます。", en: "The slides view switches to [paper | companion panel] too; click an entry's location, and the paper moves there." },
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
          { kind: "dot", x: 1.91, y: 12.85 },
          { kind: "box", x: 30.13, y: 11.11, w: 6.07, h: 4.47 },
        ],
        caption: { ja: "左端の「リスト」を開くと、すべての論文の用語が単語帳に並びます。", en: "Open \"Lists\" on the left edge, and terms from all your papers fill the wordbook." },
      },
      {
        rect: { x: 5.11, y: 7.61, w: 85.21, h: 85.1 },
        callouts: [
          { kind: "box", x: 6, y: 9.04, w: 20.48, h: 4.68 },
          { kind: "box", x: 68.71, y: 14.49, w: 19.36, h: 4.58 },
        ],
        caption: { ja: "検索欄で絞り込み、論文・ページ順と五十音・ABC 順を切り替えます。", en: "Narrow the list with the search box, and switch between paper-and-page and alphabetical order." },
      },
      {
        rect: { x: 29.31, y: 25.59, w: 42.94, h: 42.89 },
        callouts: [
          { kind: "box", x: 30.13, y: 47.39, w: 4.84, h: 3.81 },
        ],
        caption: { ja: "項目のページ番号を押すと、その論文の該当ページが開きます。", en: "Click an entry's page number to open the paper at that page." },
      },
      {
        rect: { x: 5.11, y: 7.61, w: 44.31, h: 44.25 },
        callouts: [
          { kind: "box", x: 6.07, y: 23.42, w: 20.42, h: 4.14 },
        ],
        caption: { ja: "数式帳に切り替えると、書き起こした式が論文ごとに並びます。", en: "Switch to the equation book to see your transcribed equations, grouped by paper." },
      },
      {
        rect: { x: 19.29, y: 5.72, w: 80.71, h: 80.61 },
        callouts: [
          { kind: "box", x: 33.67, y: 50.98, w: 18.81, h: 4.25 },
          { kind: "box", x: 69.8, y: 52.61, w: 26.79, h: 10.13 },
          { kind: "dot", x: 36.13, y: 83.99 },
        ],
        caption: { ja: "「グラフ」では論文と用語が線で結ばれ、用語を選ぶと意味と出てくる論文が出ます。", en: "In \"Graph,\" papers and terms are joined by lines; select a term to see its meaning and the papers that use it." },
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
        rect: { x: 0, y: 54.38, w: 45.67, h: 45.62 },
        callouts: [
          { kind: "dot", x: 1.91, y: 92.16 },
        ],
        caption: { ja: "設定の「AI エージェント（MCP）」から登録方法をコピーし、Claude Desktop か Claude Code に貼ります。", en: "Copy the setup from Settings → \"AI agents (MCP)\" and paste it into Claude Desktop or Claude Code." },
      },
      {
        rect: { x: 34.76, y: 17.97, w: 36.81, h: 36.76 },
        callouts: [
          { kind: "box", x: 35.89, y: 21.79, w: 3.48, h: 4.36 },
        ],
        caption: { ja: "「全文を訳して」と頼むと、訳が対訳タブに 1 文ずつ入ります。", en: "Ask Claude to \"translate the whole paper,\" and the Translation tab fills sentence by sentence." },
      },
      {
        rect: { x: 34.07, y: 17.97, w: 65.93, h: 65.85 },
        callouts: [
          { kind: "underline", x: 49.69, y: 26.25, w: 5.93 },
          { kind: "box", x: 36.91, y: 34.1, w: 60.26, h: 19.66 },
        ],
        caption: { ja: "「式 (11) を解説して」と頼むと、Claude が書き起こして数式タブに登録します。", en: "Ask \"explain equation (11),\" and Claude writes it up and adds it to the Equations tab." },
      },
      {
        rect: { x: 0, y: 34.84, w: 44.31, h: 44.25 },
        callouts: [
          { kind: "box", x: 7.09, y: 44.88, w: 12.85, h: 32.03 },
        ],
        caption: { ja: "「この箇所のメモに残して」と頼むと、文・マーカー・スライドのグループにメモが付きます。", en: "Say \"save that as a note here,\" and it's attached to a sentence, a highlight, or a slide group." },
        src: "/screenshots/stages/slides-linked.webp",
      },
      {
        rect: { x: 34.07, y: 20.7, w: 65.93, h: 65.85 },
        callouts: [
          { kind: "box", x: 90.25, y: 26.8, w: 3.2, h: 2.89 },
          { kind: "box", x: 35.72, y: 26.91, w: 62.37, h: 37.25 },
        ],
        caption: { ja: "アプリを開いていれば Claude の書き込みはすぐ画面に出て、「編集」でいつでも直せます。", en: "If the app is open, Claude's changes appear right away, and \"Edit\" lets you change them." },
        src: "/screenshots/stages/glossary.webp",
      },
    ],
  },
  "library-search": {
    id: "library-search",
    src: "/screenshots/stages/library.webp",
    srcSet: "/screenshots/stages/library.webp 636w",
    width: 636,
    height: 1330,
    alt: { ja: "左の論文一覧。検索欄、段階のチップ、並べ替え、BibTeX の書き出しがある。", en: "The paper list on the left, with search, status chips, sorting, and BibTeX export." },
    scenes: [
      {
        rect: { x: 0, y: 0, w: 100, h: 63.76 },
        callouts: [
          { kind: "dot", x: 8.33, y: 4.74 },
        ],
        caption: { ja: "左端の「論文一覧」に、取り込んだ論文が並びます。", en: "Papers you import are listed under \"Papers\" on the left edge." },
      },
      {
        rect: { x: 0, y: 6.77, w: 100, h: 63.76 },
        callouts: [
          { kind: "box", x: 20.44, y: 9.62, w: 77.04, h: 6.77 },
          { kind: "box", x: 20.44, y: 16.69, w: 59.75, h: 6.02 },
        ],
        caption: { ja: "検索欄と段階のチップで、題名・著者・タグなどから絞り込みます。", en: "Filter by title, author, tags, and more with the search box and status chips." },
      },
      {
        rect: { x: 0, y: 24.81, w: 100, h: 63.76 },
        callouts: [
          { kind: "box", x: 41.51, y: 29.62, w: 39.94, h: 4.66 },
        ],
        caption: { ja: "追加日・題名・発行年・段階で並べ替えられます。", en: "Sort by date added, title, year, or reading stage." },
      },
      {
        rect: { x: 0, y: 36.24, w: 100, h: 63.76 },
        callouts: [
          { kind: "box", x: 24.84, y: 92.63, w: 66.98, h: 4.96 },
        ],
        caption: { ja: "「すべての BibTeX を書き出す」で、一覧の論文をまとめて書き出せます。", en: "\"Export all BibTeX\" exports every paper in the list at once." },
      },
      {
        rect: { x: 0, y: 0, w: 100, h: 63.76 },
        callouts: [
          { kind: "dot", x: 8.33, y: 11.65 },
        ],
        caption: { ja: "左端の「検索」では、論文の題名と、書き留めた訳・メモ・用語・数式を探せます。", en: "\"Search\" on the left edge looks through paper titles and what you've written down: translations, notes, terms, equations." },
      },
    ],
  },
};

/**
 * 場面データの補足。
 * - aspect: 枠の縦横比。
 * - pairWithChat: Claude の画面は無く、MCP が書き込んだ結果のアプリ画面だけ。CSS のチャットと組み合わせる（チャットの i 行目 = 場面 i）。
 * - placeholders: 合う画面がまだ無く、近い画面で代わりに見せている場面の番号（0 始まり）。
 */
export const stageMeta: Record<StageKey, { aspect: "16/10" | "3/4"; pairWithChat?: boolean; placeholders?: number[] }> = {
  "hero": {"aspect": "16/10"},
  "slides-link": {"aspect": "16/10"},
  "supplement": {"aspect": "16/10", "placeholders": [0, 3]},
  "wordbook-graph": {"aspect": "16/10", "placeholders": [3]},
  "mcp": {"aspect": "16/10", "pairWithChat": true, "placeholders": [0, 1, 3]},
  "library-search": {"aspect": "3/4", "placeholders": [4]},
};
