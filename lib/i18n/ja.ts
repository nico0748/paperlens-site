/**
 * 日本語の文言。英語（en.ts）はこの形に合わせる（型 Dictionary で揃っているかを確かめる）。
 * "{name}" の形の部分は fill() で値を入れる。文中の `code` はコードとして表示する。
 * トップページの文言は critique/copy-v3.md に沿う（読解ノート・テンプレート・読解の段階には触れない）。
 */
export const ja = {
  meta: {
    title: "PaperLens — スライドと論文をつなぐ、輪講のための論文リーダー",
    description:
      "PaperLens は、発表スライドと論文をつなぐオープンソースの論文リーダーです。スライドの囲みから原文へすぐ移れます。用語・数式・対訳を論文の隣に置き、Claude から操作することもできます。",
  },

  common: {
    skipToContent: "本文へ移動",
    siteNav: "サイト内メニュー",
    menu: "メニュー",
    closeMenu: "閉じる",
    language: "Language",
    languageList: "言語の選択",
    login: "ログイン",
    logout: "ログアウト",
    breadcrumb: "現在地",
    home: "ホーム",
    backToTop: "ページの先頭へ",
  },

  nav: {
    features: "機能",
    privacy: "プライバシー",
    start: "はじめ方",
    shared: "共有データ",
    github: "GitHub",
  },

  /** 機能の詳細ページへのメニュー（ヘッダーの「機能」・フッター・トップページの各行で使う） */
  featureNav: {
    label: "機能",
    toggle: "機能の一覧を開く",
    index: "機能の一覧",
    items: {
      "slides-link": { label: "スライドと論文", sub: "囲んで、原文とつなぐ" },
      supplement: { label: "補足情報", sub: "対訳・訳・用語・数式" },
      "wordbook-graph": { label: "単語帳とグラフ", sub: "論文をまたいで引く" },
      mcp: { label: "Claude と使う（MCP）", sub: "頼んだ結果がアプリに入る" },
      "library-search": { label: "論文一覧と検索", sub: "取り込んで、一覧から開く" },
    },
  },

  hero: {
    eyebrow: "輪講と精読のための論文リーダー",
    catch: ["スライドから、原文へ。", "原文から、スライドへ。"],
    lead: "スライドの一部を囲んで論文とつなぐと、根拠の一文へすぐ戻れます。用語・数式・対訳も、論文の隣に置いておけます。",
    primary: "ソースから動かす",
    github: "GitHub で見る",
    seeFeatures: "機能を見る",
    trustLabel: "PaperLens の特長",
    trust: ["{license} ライセンス", "PDF は手元から出ません", "Obsidian で開ける保管庫", "Claude から操作できます（MCP）"],
    alt: "PaperLens の画面。左に発表スライド、右に論文の PDF が並び、スライドの囲みと論文の箇所が色の線で結ばれている。",
  },

  /** 小さな見出し（セクションの上の英字ラベル） */
  kickers: { uses: "USE CASES", map: "MAP", features: "FEATURES", privacy: "PRIVACY", start: "GET STARTED" },

  uses: {
    title: "こんなふうに使います",
    lead: "輪講の前と最中、ひとりで読むとき、あとで見返すとき。場面ごとに使う機能が少しずつ違います。",
    usesLabel: "使う機能",
    items: [
      {
        kicker: "輪講で",
        title: "質問されても、原文をすぐ見せられる",
        story:
          "スライドを取り込み、項目ごとに論文の該当箇所とつなぎます。発表中に「それは論文のどこ？」と聞かれたら、スライドの囲みを押すだけです。論文がその箇所まで動き、原文の言い回しをそのまま見せられます。",
        uses: ["スライドと論文", "全画面", "補足情報"],
      },
      {
        kicker: "ひとりで読む",
        title: "わからない語と式で、手を止めない",
        story:
          "対訳を横に置いて、1 文ずつ読み進めます。知らない語は選んで調べ、式は TeX に書き起こして記号の意味を確かめます。調べた結果は論文の隣に残るので、同じ語でもう迷いません。",
        uses: ["対訳", "用語", "数式", "訳"],
      },
      {
        kicker: "あとで見返す",
        title: "調べた用語が、論文どうしをつなぐ",
        story:
          "前に調べた用語は、単語帳から引けます。項目を押すと、その論文のページへ戻ります。グラフで同じ用語を持つ論文をたどると、読んできた論文の関係が見えてきます。",
        uses: ["単語帳・数式帳", "グラフ", "検索"],
      },
    ],
  },

  map: {
    title: "画面の見取り図",
    lead: "左端のアイコンと、右側のタブで切り替えます。",
    ribbonTitle: "左端のアイコン",
    tabsTitle: "右側のタブ（補足情報）",
    more: "機能を詳しく見る",
    ribbon: [
      { label: "論文一覧", desc: "PDF や arXiv の番号から論文を取り込み、一覧から開きます。" },
      { label: "検索", desc: "論文の題名と、書き留めた訳・メモ・用語・数式を探します。" },
      { label: "リスト（用語・数式）", desc: "すべての論文の用語と数式を、単語帳と数式帳で引きます。" },
      { label: "グラフ", desc: "論文と用語のつながりを、線で見渡します。" },
      { label: "スライドと論文", desc: "スライドを論文の左に並べ、囲みと線でつなぎます。" },
    ],
    extra: [
      { label: "設定", desc: "Claude の API キー、保管庫の場所、MCP の登録方法を決めます。" },
      { label: "ヘルプ", desc: "使い方、よくある質問、キーボード操作を引けます。" },
    ],
    tabs: [
      { label: "対訳", desc: "全文を 1 文ずつ、原文と訳で並べます。押すと PDF のその文へ移ります。" },
      { label: "訳", desc: "選んだ箇所の訳とマーカーを並べます。" },
      { label: "用語", desc: "調べた用語の意味と、この論文での使われ方です。" },
      { label: "数式", desc: "書き起こした式を TeX で表示し、記号の意味を添えます。" },
    ],
    tabsMore: "補足情報を詳しく見る",
  },

  features: {
    title: "できること",
    slides: {
      kicker: "スライドと論文",
      title: "スライドの根拠を、原文で確かめる。",
      body: "スライドの一部を四角で囲むと、グループになります。グループを選んだまま論文の文・図・数式を指定すると、両者が同じ色の線で結ばれます。グループを押せば論文の該当箇所へ、論文側の印を押せばスライドへ移ります。",
      bullets: ["PDF と PPTX のスライドを取り込めます", "スライドを差し替えても、囲みは残ります", "全画面にしても、線はそのまま映ります"],
      cta: "スライドと論文を詳しく見る",
      alt: "スライドの囲みから、論文の文と数式へ色の線が伸びている。",
    },
    supplement: {
      kicker: "補足情報",
      title: "用語・数式・対訳を、論文の隣に置く。",
      body: "語を選んで「用語を調べる」を押すと、意味と、この論文での使われ方がまとまります。式を選んで「数式にする」を押すと、TeX に書き起こして記号の意味を添えます。どちらも前後の本文をもとに書くので、論文の文脈からずれにくくなります。",
      bullets: [
        "用語: 意味・詳しい説明・論文での使われ方・関連する用語",
        "数式: TeX・式の役割・記号ごとの意味",
        "対訳: 全文を 1 文ずつ。訳語は用語集でそろえます",
      ],
      note: "ボタンでの訳と調べものには、Claude の API キーを使います（利用量に応じて課金されます）。全文の対訳は MCP で Claude に頼みます。手で書くこともできます。",
      cta: "補足情報を詳しく見る",
      alt: "補足情報の数式タブ。式を TeX から表示し、記号ごとの意味が並んでいる。",
    },
    connected: {
      kicker: "スライド・論文・補足情報",
      title: "どこから見ても、論文に戻れる。",
      body: "スライドと補足情報は、どちらも論文とつながっています。画面はタブで［スライド｜論文］と［論文｜補足情報］を切り替えます。論文はいつも同じ場所に残るので、見比べながら読めます。",
      nodes: ["スライド", "論文", "補足情報"],
      bullets: ["スライドのグループを押すと、論文の該当箇所へ", "用語や数式の場所を押すと、論文のその位置へ", "対訳の文を押すと、PDF のその文へ"],
      cta: "つながり方を詳しく見る",
    },
    lists: {
      kicker: "単語帳とグラフ",
      title: "調べた用語は、論文をまたいで残る。",
      body: "どの論文で調べた用語も、単語帳に集まります。書き起こした数式は、数式帳に集まります。グラフでは、同じ用語を通して論文どうしのつながりが見えます。",
      bullets: ["論文・ページ順と、五十音・ABC 順で並べ替え", "項目から、その論文のページへ移れます", "グラフでは、同じ用語を持つ論文どうしが近づきます"],
      cta: "単語帳とグラフを詳しく見る",
      alt: "単語帳。すべての論文の用語が、論文・ページ順に並んでいる。",
    },
    mcp: {
      kicker: "Claude と使う（MCP）",
      title: "Claude に頼むと、結果がアプリに入る。",
      body: "PaperLens を MCP サーバーとして登録すると、Claude Desktop や Claude Code から操作できます。「この式を解説して」「全文を訳して」と頼むと、結果が数式タブや対訳タブに入ります。アプリを開いていれば、画面にすぐ出ます。",
      bullets: ["会話で分かったことを、文やスライドのメモに残せます", "全文の対訳に、API キーは要りません", "スライドの囲みとリンクも頼めます"],
      cta: "Claude との使い方を詳しく見る",
      chatLabel: "Claude との会話の例",
      chat: [
        { ask: "全文を訳して", tool: "set_translations" },
        { ask: "この式を解説して", tool: "add_equation" },
        { ask: "いまの説明を、この文のメモに残して", tool: "add_sentence_note" },
      ],
      alt: "Claude が書き込んだ数式と対訳が、PaperLens の補足情報に並んでいる。",
    },
    library: {
      kicker: "論文一覧と検索",
      title: "論文を取り込み、一覧から開く。",
      body: "PDF や arXiv の番号から論文を取り込み、一覧から開きます。検索では、論文の題名と、書き留めた訳・メモ・用語・数式を探します。",
      bullets: ["一覧は題名・著者・年・タグで絞り込めます", "すべての論文の BibTeX を書き出せます"],
      cta: "論文一覧と検索を詳しく見る",
      alt: "論文一覧。検索欄の下に、取り込んだ論文が並んでいる。",
    },
  },

  privacy: {
    title: "論文は、手元のフォルダに置いたまま。",
    body: "アプリのサーバーは、自分の PC の中（127.0.0.1）だけで動きます。外と通信するのは、Claude に頼んだとき、URL から論文を取り込んだとき、GROBID を別のサーバーに置いたときだけです。",
    sendTitle: "Claude に送るもの",
    detail: "ボタンで Claude に頼むときに送るのは、選んだ範囲と前後の本文、論文の題名です。数式では選んだ範囲の画像も送ります。PDF 全体は送りません。",
    vaultTitle: "データの置き場所",
    vault: "データは保管庫フォルダのふつうのファイルです。データベースは使わず、Obsidian の保管庫としてもそのまま開けます。",
  },

  start: {
    title: "ソースから動かす",
    lead: "配布用のアプリは、まだありません。いまは GitHub のソースから起動します。",
    requirement: "Node.js 22.6 以上が必要です。",
    stepsLabel: "ソースから動かす手順",
    steps: [
      {
        title: "取得してビルドする",
        body: "",
        code: "git clone https://github.com/nico0748/LogiXiv.git\ncd LogiXiv\nnpm install\nnpm run build\ncd apps/reader",
      },
      {
        title: "起動する",
        body: "`npm run app` でアプリのウィンドウが開きます。ブラウザで使うなら `npm start` のあと http://127.0.0.1:5175 を開きます。",
        code: "",
      },
      {
        title: "GROBID を動かす（推奨）",
        body: "リポジトリの最上位で `docker compose -f docker/grobid.yml up -d` を実行します。文の区切りが正確になります。無くても動きますが、精度は落ちます。",
        code: "",
      },
    ],
    codeLabel: "コマンド",
    note: "リポジトリ名は旧名の LogiXiv のままです。",
    readme: ["詳しい手順は ", "README", " にあります。"],
    github: "GitHub で見る",
    sourceZip: "ソースコード（ZIP）",
  },

  closing: {
    title: "次の輪講で、試してみてください。",
    body: "スライドと論文をつなぐところから始められます。",
    facts: ["{license} ライセンス", "Node.js 22.6 以上", "macOS / Windows / Linux"],
  },

  footer: {
    tagline: "スライドと論文と補足情報を、論文を軸につなぐ。",
    features: "機能",
    resources: "資料",
    community: "コミュニティ",
    start: "ソースから動かす",
    releases: "リリースノート",
    readme: "使い方（README）",
    zipFormat: "共有 ZIP の形式",
    formats: "対応形式: PDF / PPTX ・ Markdown ・ Obsidian ・ GROBID ・ KaTeX ・ MCP",
    source: "ソースコード",
    issues: "不具合の報告",
    license: "PaperLens は {license} ライセンスのオープンソースソフトウェアです。",
  },

  login: {
    title: "ログイン",
    lead: "共有データのダウンロードには、ログインが必要です。",
    github: "GitHub でログイン",
    githubHint:
      "GitHub アカウントでログインします。このサイトはデータベースを使いません。ログイン情報は、お使いのブラウザの Cookie にだけ保存されます。",
    errorTitle: "ログインできませんでした",
    errors: {
      AccessDenied: "このアカウントではログインできません。利用を希望する場合は、管理者に連絡してください。",
      CredentialsSignin: "ユーザー名が正しくありません。英数字とハイフンで入力してください。",
      Configuration: "ログインの設定に問題があります。サイトの管理者にお知らせください。",
      OAuthCallbackError: "GitHub でのログインを完了できませんでした。もう一度お試しください。",
      default: "ログインできませんでした。もう一度お試しください。",
    } as Record<string, string>,
    devTitle: "開発用ログイン",
    devHint: "開発環境でのみ表示しています（AUTH_DEV_LOGIN=1）。入力した GitHub ユーザー名でログインします。",
    devLabel: "ユーザー名",
    devFieldHint: "英数字とハイフンで、39 文字以内で入力してください。",
    devSubmit: "このユーザー名でログイン",
  },

  shared: {
    title: "共有データ",
    lead: "PaperLens で開ける論文を、ZIP でダウンロードできます。",
    upload: "アップロード",
    loadErrorTitle: "一覧を読み込めませんでした",
    loadError: "しばらくしてから、ページを再読み込みしてください。",
    empty: "共有データはまだありません。",
    listLabel: "共有データの一覧",
    papers: "含まれる論文",
    singleFolder: "論文 1 本（フォルダ単体）",
    paperCount: "{count} 本",
    withTemplates: "（テンプレート付き）",
    size: "サイズ",
    uploadedBy: "登録者",
    uploadedAt: "登録日時",
    showPapers: "収録論文を表示",
    morePapers: "ほか {count} 本",
    download: "ダウンロード",
    downloadLabel: "「{title}」をダウンロード（{size}）",
    howToTitle: "ZIP の使い方",
    howToIntro: "ZIP の中身は、PaperLens の保管庫と同じフォルダ構成です。",
    howToLayout: [
      "papers/<論文ID>/paper.pdf        原文の PDF（必ず入っています）",
      "papers/<論文ID>/note.md          読解ノート",
      "papers/<論文ID>/paperlens.json   マーカー・用語・数式",
      "papers/<論文ID>/sentences.json   1 文ずつの対訳",
    ],
    howToSteps: [
      "ZIP をダウンロードして展開します。",
      "展開した papers フォルダの中身を、保管庫の papers フォルダへ移します。保管庫の場所は、PaperLens の設定画面で確認できます。",
      "PaperLens を開いていれば、論文一覧に自動で追加されます。表示されない場合は、アプリを再起動してください。",
    ],
    howToOverwrite:
      "同じ論文 ID のフォルダがすでにある場合は、上書きする前に中身を確認してください。なお、ZIP が <論文ID>/paper.pdf の形（論文 1 本だけ）の場合は、そのフォルダを papers フォルダの中へ移します。",
    howToLicense: "共有された PDF は、元の論文の利用条件に従って扱ってください。再配布できないものもあります。",
    delete: "削除",
    deleting: "削除しています…",
    deleteLabel: "「{title}」を削除",
    deleteConfirm: "「{title}」を削除しますか？ この操作は元に戻せません。",
    deleteForbidden: "削除できるのは管理者だけです。",
    deleteNotFound: "このデータは見つかりません。すでに削除された可能性があります。",
    deleteFailed: "削除に失敗しました。時間をおいてもう一度お試しください。",
  },

  upload: {
    title: "共有データのアップロード",
    lead: "PaperLens の論文フォルダを ZIP にまとめて登録します。",
    forbiddenTitle: "アップロードできません",
    forbidden: "共有データをアップロードできるのは、管理者だけです。",
    backToList: "共有データの一覧へ戻る",
    aboutZip: "ZIP の形式について",
    required: "必須",
    optional: "任意",
    fileLabel: "ZIP ファイル",
    fileHint: "papers/<論文ID>/paper.pdf の形式の ZIP を選んでください（{max} まで）。",
    notZip: "拡張子が .zip のファイルを選んでください。",
    tooLarge: "ファイルが大きすぎます。{max} 以下のファイルを選んでください。",
    chooseFile: "ZIP ファイルを選んでください。",
    stillChecking: "ZIP の中身を確認しています。完了するまでお待ちください。",
    cannotUpload: "このファイルはアップロードできません。理由は下に表示しています。",
    checking: "ZIP の中身を確認しています…",
    rejected: "この ZIP はアップロードできません。",
    titleLabel: "題名",
    titleHint: "一覧に表示される名前です（120 文字以内）。",
    titleRequired: "題名を入力してください。",
    descLabel: "説明",
    descHint: "収録している論文の内容を書いてください（2,000 文字以内）。",
    sending: "アップロード中… {percent}%（{loaded} / {total}）",
    finishing: "ZIP の中身を確認し、登録しています…",
    submit: "アップロード",
    submitting: "アップロードしています…",
    serverError: "サーバーでエラーが発生しました（{status}）。",
    sendFailedStatus: "アップロードに失敗しました（{status}）。",
    sendFailed: "アップロードに失敗しました。ネットワークの接続を確認してください。",
    failed: "アップロードに失敗しました。",
    previewSingle: "論文 1 本（フォルダ単体）",
    previewCount: "論文 {count} 本",
    previewTemplates: "（テンプレート付き）",
    previewMeta: "{name}・{size}・{files} ファイル（展開後 {unpacked}）",
  },
};

export type Dictionary = typeof ja;
