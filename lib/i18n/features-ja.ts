/**
 * 機能のページ（/[lang]/features と /[lang]/features/[slug]）の日本語の文言。
 * 英語（features-en.ts）はこの形に合わせる（型 FeaturesDictionary で揃っているかを確かめる）。
 * 方針: です・ます。1 文に 1 つのこと。読解ノート（note.md）・テンプレート・読解の段階には触れない。
 * ツール名・関連する機能・場面の割り当てはコード（components/features/data.ts）に置く。
 */
export type FeatureSlugKey = "slides-link" | "supplement" | "wordbook-graph" | "mcp" | "library-search";

export type FeatureStep = { title: string; body: string; ui?: string[] };
export type FeaturePage = {
  metaTitle: string;
  metaDescription: string;
  /** アプリでの表記（ヒーローの小見出し、カードの小見出し） */
  appLabel: string;
  title: string;
  lead: string;
  /** 一覧・関連する機能のカードに出す 1 文 */
  cardLine: string;
  steps: FeatureStep[];
  cases: string[];
  notes: string[];
  /** 「Claude からもできる」の 1 文（mcp のページでは使わない） */
  mcpLine: string;
};

export const featuresJa = {
  nav: {
    home: "ホーム",
    features: "機能",
    breadcrumb: "現在地",
  },

  index: {
    metaTitle: "機能",
    metaDescription:
      "PaperLens の機能の一覧です。スライドと論文をつなぐ、補足情報（対訳・用語・数式）、単語帳とグラフ、Claude からの操作（MCP）、論文一覧と検索を紹介します。",
    title: "機能",
    lead: "PaperLens でできることを、ページごとに紹介します。どのページにも、実際の画面と使い方の流れがあります。",
    mapKicker: "画面の見取り図",
    mapTitle: "左端のアイコンと、右側のタブで切り替えます。",
    ribbonTitle: "左端のアイコン",
    tabsTitle: "右側のタブ（補足情報）",
    ribbon: [
      { key: "files", label: "論文一覧", body: "PDF や arXiv の番号から論文を取り込み、一覧から開きます。" },
      { key: "search", label: "検索", body: "論文の題名と、書き留めた訳・メモ・用語・数式を探します。" },
      { key: "lists", label: "リスト（用語・数式）", body: "すべての論文の用語と数式を、単語帳と数式帳で引きます。" },
      { key: "graph", label: "グラフ", body: "論文と用語のつながりを、線で見渡します。" },
      { key: "slides", label: "発表スライドと論文の対応", body: "スライドを論文の左に並べ、囲みと線でつなぎます。" },
      { key: "settings", label: "設定", body: "Claude の API キー、保管庫の場所、MCP の登録方法を決めます。" },
      { key: "help", label: "ヘルプ", body: "使い方、よくある質問、キーボード操作を引けます。" },
    ],
    tabs: [
      { label: "対訳", body: "全文を 1 文ずつ、原文と訳で並べます。押すと PDF のその文へ移ります。" },
      { label: "訳", body: "選んだ箇所の訳とマーカーを並べます。" },
      { label: "用語", body: "調べた用語の意味と、この論文での使われ方です。" },
      { label: "数式", body: "書き起こした式を TeX で表示し、記号の意味を添えます。" },
    ],
    tabsMore: "補足情報を詳しく見る",
  },

  ui: {
    more: "詳しく見る",
    stepsTitle: "使い方の流れ",
    stepLabel: "手順 {n}",
    casesTitle: "こんなときに",
    notesTitle: "注記",
    mcpKicker: "MCP",
    mcpTitle: "Claude からもできる",
    mcpMore: "Claude との使い方を見る",
    toolsTitle: "機能ごとのツール",
    toolsLead: "PaperLens の MCP サーバーには、読み取り 18・書き込み 32 のツールがあります。主なものを機能ごとに並べます。",
    toolsArea: "機能",
    toolsNames: "ツール",
    promptsTitle: "用意してあるプロンプト",
    relatedTitle: "関連する機能",
    pagerLabel: "前後の機能",
    prev: "前の機能",
    next: "次の機能",
    ctaTitle: "次の輪講で、試してみてください。",
    ctaBody: "配布用のアプリは、まだありません。いまは GitHub のソースから起動します。",
    ctaPrimary: "ソースから動かす",
    ctaSecondary: "GitHub で見る",
    chatLabel: "Claude との会話の例",
    chatYou: "あなた",
    chatClaude: "Claude",
  },

  mcpTools: [
    { area: "論文を読む", tools: ["import_paper", "list_papers", "read_paper_text", "find_in_paper", "get_page_image"] },
    { area: "対訳", tools: ["get_sentence_outline", "get_translation_batch", "set_translations", "update_glossary", "search_sentences"] },
    { area: "用語・数式", tools: ["add_term", "update_term", "add_equation", "update_equation"] },
    { area: "マーカーとメモ", tools: ["add_highlight", "update_highlight", "add_sentence_note"] },
    { area: "スライド", tools: ["import_slides", "add_slide_markup", "link_slide_markup", "set_slide_markup_memo"] },
    { area: "一覧と検索", tools: ["get_lists", "get_graph", "search_notes", "get_bibtex"] },
  ],
  mcpPrompts: [
    { name: "translate_paper", body: "全文を 1 文ずつ訳して、対訳タブに入れます。" },
    { name: "read_paper", body: "論文を読み進め、用語と数式を書き込みます。" },
    { name: "review_notes", body: "読んだ論文で書き留めたことを、ふり返ります。" },
  ],

  /** MCP のページの会話の例。やり取り i は lib/scenes.ts の mcp の場面 i に当たる */
  mcpChat: [
    { user: "PaperLens につながった？", tool: "get_settings", result: "つながりました。保管庫の論文を読めます。" },
    { user: "この論文を全文訳して。", tool: "set_translations", result: "対訳タブに、1 文ずつ訳を入れています。" },
    { user: "式 (11) を解説して。", tool: "add_equation", result: "TeX と、記号ごとの意味を数式タブに入れました。" },
    { user: "いまの説明を、このスライドのグループのメモに残して。", tool: "set_slide_markup_memo", result: "Markup-02.01 にメモを付けました。" },
    { user: "この用語も調べて入れておいて。", tool: "add_term", result: "用語タブに入れました。画面の「編集」で直せます。" },
  ],

  pages: {
    "slides-link": {
      metaTitle: "スライドと論文をつなぐ",
      metaDescription:
        "スライドの一部を囲み、論文の文・図・数式と線で結びます。どちらから押しても、もう一方の該当箇所へ移ります。輪講の準備と発表に使えます。",
      appLabel: "発表スライドと論文の対応",
      title: "スライドと論文をつなぐ",
      lead: "スライドの一部を囲み、論文の文・図・数式と線で結びます。どちらから押しても、もう一方の該当箇所へ移ります。",
      cardLine: "スライドの囲みと論文の箇所を、色の線で結びます。",
      steps: [
        {
          title: "スライドを取り込む",
          body: "左端の「発表スライドと論文の対応」を開き、PDF か PPTX をドロップします。スライドが論文の左に並びます。",
        },
        {
          title: "スライドを囲む",
          body: "「囲む」（R）を選び、スライドの上をドラッグします。囲んだ部分はグループになり、Markup-03.02 のような名前が付きます。",
          ui: ["囲む R"],
        },
        {
          title: "論文の箇所とつなぐ",
          body: "グループを選んだまま、論文の文をドラッグして「文章としてリンク」を押します。図と式は「図」（F）か「数式」（E）で囲みます。グループと論文が、同じ色の線で結ばれます。1 つのグループから、何か所にでもつなげます。",
          ui: ["文章としてリンク", "図 F", "数式 E"],
        },
        {
          title: "行き来する",
          body: "スライドのグループを押すと、論文が該当箇所まで動きます。論文側の色の印を押すと、スライドのそのページへ戻ります。",
          ui: ["選んだ線だけ"],
        },
        {
          title: "そのまま発表する",
          body: "「全画面」（P）で、スライドと論文を線ごと映します。質問が出たら、グループを押して原文を見せます。",
          ui: ["全画面 P"],
        },
      ],
      cases: [
        "スライドの要約が、原文とずれていないか確かめたい",
        "質疑で「論文ではどう書いてある？」と聞かれた",
        "先輩のスライドを手がかりに、論文を読みたい",
        "図の出典ページを、すぐ示したい",
      ],
      notes: ["PPTX の表示には LibreOffice か Keynote を使います。無いときは PDF に書き出してから取り込んでください。"],
      mcpLine: "囲みとリンクは、Claude に頼んで付けることもできます。",
    },

    supplement: {
      metaTitle: "補足情報（対訳・訳・用語・数式）",
      metaDescription:
        "論文を読むのに要る情報を、論文の隣にまとめます。用語の意味と論文での使われ方、TeX に書き起こした数式と記号の意味、全文の対訳。どれも論文の場所とつながっています。",
      appLabel: "補足情報",
      title: "補足情報（対訳・訳・用語・数式）",
      lead: "論文を読むのに要る情報を、論文の隣にまとめます。どれも論文の場所とつながっていて、押せばそこへ移ります。",
      cardLine: "用語・数式・対訳を、論文の隣にまとめます。",
      steps: [
        {
          title: "文を選ぶ",
          body: "PDF の語や文をドラッグで選びます。マーカーの色と、「訳す」「用語を調べる」「数式にする」が出ます。",
          ui: ["訳す", "用語を調べる", "数式にする"],
        },
        {
          title: "用語を調べる",
          body: "「用語を調べる」を押すと、意味、詳しい説明、この論文での使われ方、関連する用語がまとまります。用語タブに並び、あとから直せます。",
          ui: ["用語を調べる"],
        },
        {
          title: "数式を書き起こす",
          body: "式を選んで「数式にする」を押すと、TeX に書き起こして表示します。式の役割と、記号ごとの意味も添えます。",
          ui: ["数式にする"],
        },
        {
          title: "対訳で読む",
          body: "Claude に頼んだ全文の訳が、対訳タブに 1 文ずつ並びます。文を押すと PDF のその文へ、PDF の文の枠を押すとその訳へ移ります。",
        },
        {
          title: "スライドの横で使う",
          body: "スライドの画面でも、タブで［論文｜補足情報］に切り替えられます。用語や数式の場所を押すと、論文がそこへ動きます。",
        },
      ],
      cases: [
        "分野外の論文で、知らない語が多い",
        "式の記号が何を表すのか、追いきれない",
        "英語の言い回しを、訳と並べて確かめたい",
        "発表の前に、用語の説明をそろえておきたい",
      ],
      notes: [
        "「訳す」「用語を調べる」「数式にする」は、設定で Claude の API キーを入れると使えます（利用量に応じて課金されます）。全文の対訳はアプリのボタンではなく、MCP で Claude に頼みます。手で書き込むこともできます。",
      ],
      mcpLine: "用語・数式・全文の対訳は、Claude との会話から頼めます。",
    },

    "wordbook-graph": {
      metaTitle: "単語帳とグラフ",
      metaDescription:
        "論文ごとに調べた用語と数式を、単語帳と数式帳に集めます。同じ用語を持つ論文どうしが、グラフでつながります。",
      appLabel: "リストとグラフ",
      title: "単語帳とグラフ",
      lead: "論文ごとに調べた用語と数式を、1 か所に集めます。同じ用語を持つ論文どうしが、グラフでつながります。",
      cardLine: "調べた用語と数式が、論文をまたいで集まります。",
      steps: [
        {
          title: "リストを開く",
          body: "左端の「リスト」（⌘/Ctrl + Shift + L）を開きます。すべての論文の用語が、単語帳に並びます。",
          ui: ["⌘/Ctrl + Shift + L"],
        },
        {
          title: "探して、並べ替える",
          body: "検索欄に語を入れて絞り込みます。論文・ページ順と、五十音・ABC 順を切り替えられます。",
          ui: ["論文・ページ順", "五十音・ABC順"],
        },
        {
          title: "論文のページへ戻る",
          body: "項目のページ番号を押すと、その論文の該当ページが開きます。",
          ui: ["p.1"],
        },
        {
          title: "数式帳を見る",
          body: "数式帳に切り替えると、書き起こした式が論文ごとに並びます。",
        },
        {
          title: "グラフでたどる",
          body: "左端の「グラフ」を開くと、論文と用語が線で結ばれます。同じ用語を持つ論文は近くに寄ります。用語を選ぶと意味と出てくる論文が、論文を選ぶと「この論文を開く」が出ます。",
          ui: ["出てくる論文", "この論文を開く"],
        },
      ],
      cases: [
        "前に読んだ論文で調べた語を、もう一度引きたい",
        "同じ用語を使う論文を、まとめて見返したい",
        "ゼミの前に、分野の用語を見直したい",
      ],
      notes: ["単語帳と数式帳は、サーバー版とデスクトップ版で使えます。"],
      mcpLine: "単語帳とグラフの中身は、Claude からも読めます。",
    },

    mcp: {
      metaTitle: "Claude から操作する（MCP）",
      metaDescription:
        "PaperLens を MCP サーバーとして登録すると、Claude Desktop や Claude Code から操作できます。頼んだ結果は、アプリの対訳・用語・数式・メモに入ります。",
      appLabel: "Claude と使う（MCP）",
      title: "Claude から操作する（MCP）",
      lead: "Claude との会話から、PaperLens を操作できます。頼んだ結果は、アプリの対訳・用語・数式・メモに入ります。",
      cardLine: "Claude に頼んだ結果が、アプリの中に入ります。",
      steps: [
        {
          title: "登録する",
          body: "設定の「AI エージェント（MCP）」に、この PC での登録方法が出ます。「コピーする」を押し、Claude Desktop か Claude Code に貼ります。",
          ui: ["AI エージェント（MCP）", "コピーする"],
        },
        {
          title: "全文の対訳を頼む",
          body: "「PaperLens の論文○○を全文訳して」と頼みます。訳は 1 文ずつ対訳タブに入っていきます。",
        },
        {
          title: "式や用語を頼む",
          body: "「式 (3) を解説して」「この語を調べて」と頼みます。Claude がページを見て書き起こし、数式タブや用語タブに登録します。",
        },
        {
          title: "会話をメモに残す",
          body: "論文について質問して分かったことを、「この箇所のメモに残して」と頼みます。対訳の文、マーカー、スライドのグループに、メモとして付きます。",
        },
        {
          title: "画面で確かめる",
          body: "アプリを開いていれば、Claude の書き込みはすぐ画面に出ます。内容は、いつでも自分で直せます。",
        },
      ],
      cases: [
        "長い論文を、まとめて対訳にしたい",
        "Claude と議論した内容を、論文の横に残したい",
        "スライドの囲みとリンクを、まとめて付けてほしい",
      ],
      notes: [
        "アプリを起動していなくても使えます。「読み取りだけを許可する」設定もあります。Claude が読んだ本文は、Claude に送られます。",
      ],
      mcpLine: "",
    },

    "library-search": {
      metaTitle: "論文一覧と検索",
      metaDescription:
        "論文は左端の「論文一覧」から取り込み、開きます。「検索」では、論文の題名と、書き留めた訳・メモ・用語・数式を探せます。",
      appLabel: "論文一覧・検索",
      title: "論文一覧と検索",
      lead: "論文は左端の「論文一覧」から取り込み、開きます。「検索」では、論文の題名と、書き留めた内容を探せます。",
      cardLine: "論文を取り込んで開く一覧と、書き留めた内容の検索です。",
      steps: [
        {
          title: "論文を取り込む",
          body: "「論文一覧」を開き、PDF をドロップします。URL や arXiv の番号からも取り込めます。arXiv なら、題名・著者・年が自動で入ります。",
        },
        {
          title: "一覧で絞り込む",
          body: "一覧の上の検索欄に、題名・著者・年・タグを入れて絞り込みます。「#タグ」と入れると、タグで絞れます。",
          ui: ["#タグ"],
        },
        {
          title: "並べ替えて、開く",
          body: "追加日・題名・発行年で並べ替えられます。論文を押すと、前回読んでいた位置から開きます。",
        },
        {
          title: "BibTeX を書き出す",
          body: "「すべての BibTeX を書き出す」で、一覧の論文をまとめて書き出せます。絞り込んでいるときは、表示中の論文だけを書き出します。",
          ui: ["すべての BibTeX を書き出す"],
        },
        {
          title: "書き留めた内容を探す",
          body: "左端の「検索」で、論文の題名と、書き留めた訳・メモ・用語・数式を探します。結果を押すと、その論文の訳・用語・数式のタブへ移ります。",
        },
      ],
      cases: [
        "前に読んだ論文を、題名や著者ですぐ開きたい",
        "どの論文で調べた語だったか、思い出せない",
        "発表の参考文献を、BibTeX でまとめて出したい",
      ],
      notes: [
        "検索は、PDF の本文と対訳の文は探しません。対訳の文は、対訳タブの中の検索で探します。",
        "URL と arXiv からの取り込みは、サーバー版とデスクトップ版で使えます。",
      ],
      mcpLine: "論文の取り込みと一覧、書き留めた内容の検索は、Claude からも頼めます。",
    },
  } satisfies Record<FeatureSlugKey, FeaturePage>,
};

export type FeaturesDictionary = Omit<typeof featuresJa, "pages"> & { pages: Record<FeatureSlugKey, FeaturePage> };
