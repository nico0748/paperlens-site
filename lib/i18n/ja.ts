/**
 * 日本語の文言。英語（en.ts）はこの形に合わせる（型 Dictionary で揃っているかを確かめる）。
 * "{name}" の形の部分は fill() で値を入れる。
 */
export const ja = {
  meta: {
    title: "PaperLens — 1 文ずつ対訳で読む、ローカルファーストな論文リーダー",
    description:
      "PaperLens は、論文 PDF を 1 文ずつ対訳で読めるローカルファーストな論文リーダーです。訳・用語・数式・読解ノートを、Markdown の保管庫に残します。",
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
    download: "ダウンロード",
    shared: "共有データ",
    github: "GitHub",
  },

  hero: {
    eyebrow: "PC の中で動く論文リーダー",
    catch: ["論文を、一文ずつ対訳で読む。", "分かったことは、手元のノートに残す。"],
    lead: "PDF を 1 文ずつに分け、原文と訳を並べて表示します。訳・用語・数式・読解ノートは、Markdown のファイルとして保存します。",
    desc: "アプリはお使いの PC の中だけで動き、PDF を外部へ送りません。訳やノートは保管庫（データを置くフォルダ）にふつうのファイルとして保存するので、Obsidian でもそのまま開けます。",
    download: "無料でダウンロード",
    github: "GitHub で見る",
    platformsLabel: "対応環境",
    note: "{license} ライセンスのオープンソースです。無料で使えます。",
  },

  shot: {
    alt: "Mac で開いた PaperLens。左に発表スライド、右に論文の PDF が並び、論文には色分けしたマーカーと囲みが付いている。",
    caption: "スライドと論文を並べて読んでいるところ。",
  },

  stack: {
    title: "いつもの道具と、そのままつながります。",
    items: [
      { name: "Markdown", desc: "ノートはふつうのテキスト" },
      { name: "Obsidian", desc: "保管庫をそのまま開ける" },
      { name: "GROBID", desc: "文の区切りと位置を抽出" },
      { name: "KaTeX", desc: "TeX の数式を表示する" },
      { name: "MCP", desc: "Claude から操作できる" },
      { name: "PDF / PPTX", desc: "論文と発表スライドを読み込む" },
    ],
  },

  features: {
    title: "読む。書き留める。つなぐ。",
    lead: "論文を読む作業が、1 つの画面で完結します。",
    blocks: [
      {
        kicker: "01 — 読む",
        title: "1 文ずつ、原文と訳を並べる",
        body: [
          "取り込んだ PDF を 1 文ずつに分けます。右側には原文と訳が並びます。",
          "PDF 上の枠をクリックすると、その文の訳へ移ります。訳をクリックすると、PDF の該当箇所へ戻ります。",
        ],
        points: [
          "文の区切りと位置は GROBID で抽出します",
          "GROBID が無くても、簡易解析で動きます（精度は下がります）",
          "全文の翻訳は、MCP 経由で Claude に任せられます。翻訳 API のキーは不要です",
        ],
      },
      {
        kicker: "02 — 書き留める",
        title: "読解ノートを、テンプレートから自動で作る",
        body: [
          "論文を取り込むと、テンプレートから読解ノート（note.md）が作られます。",
          "ノートには、読解の段階ごとに記入欄があります。途中で中断しても、どこまで理解したかが残ります。",
        ],
        points: [],
      },
      {
        kicker: "03 — つなぐ",
        title: "発表スライドと論文をつなぐ",
        body: [
          "論文紹介のスライド（PDF または PPTX）を、論文の左に並べて表示できます。",
          "スライドの一部を四角で囲み、根拠となる論文の文・図・数式とリンクします。リンクすると、両者が色付きの線で結ばれます。",
        ],
        points: ["画面はスライド・論文・補足情報の 3 面です", "そのうち 2 面を並べて表示します"],
      },
    ],
    linkShotAlt: "スライドの囲みから論文の数式と文へ、赤い線が引かれている画面。",
    gallery: {
      title: "実際の画面",
      items: [
        { alt: "数式タブ。式 (11) を KaTeX で表示し、TeX の原文、解説、記号ごとの意味が並んでいる。", caption: "数式：TeX で記録し、記号ごとの意味も書き添えられます。" },
        { alt: "用語タブ。スロー特徴分析とリカレンスプロットの説明、この論文での使われ方、関連する用語が並んでいる。", caption: "用語：意味と、その論文での使われ方を記録します。" },
        { alt: "単語帳。すべての論文の用語を、論文・ページ順に一覧している。", caption: "単語帳：すべての論文の用語を、1 か所で調べられます。" },
        { alt: "グラフ。論文と用語が線で結ばれ、選んだ FORCE 学習の説明が右に出ている。", caption: "グラフ：用語をクリックすると、意味と、その用語が登場する論文を表示します。" },
        { alt: "グラフの全体。2 本の論文から、多くの用語へ線が伸びている。", caption: "論文と用語のつながりを、全体から見渡せます。" },
      ],
    },
    stagesLabel: "読解の段階",
    stages: ["未読", "概要把握", "精読", "検討", "まとめ済み"],
    moreTitle: "ほかにも、こんなことができます。",
    more: [
      {
        tag: "訳・用語・数式",
        title: "選んだ箇所に、訳や用語を書き込む",
        body: "PDF の文を選ぶと、マーカーを引いて訳や用語の説明を書き込めます。数式は TeX で記録し、KaTeX で表示します。",
      },
      {
        tag: "AI",
        title: "Claude から使う（MCP）",
        body: "MCP サーバーを登録すると、Claude Desktop や Claude Code からアプリと同じ操作ができます。アプリを開いていれば、Claude の書き込みがすぐ画面に反映されます。",
      },
      {
        tag: "リスト",
        title: "単語帳・数式帳・グラフ",
        body: "すべての論文の用語と数式を、単語帳と数式帳にまとめて調べられます。グラフでは、論文と用語のつながりを確認できます。",
      },
      {
        tag: "保管庫",
        title: "Obsidian 互換の保管庫",
        body: "データはすべて、保管庫のふつうのファイルです。データベースは使いません。Obsidian で note.md を書き換えると、その内容がすぐアプリに反映されます。",
      },
    ],
  },

  privacy: {
    title: "論文は、あなたの PC から出ません。",
    lead: "外部と通信するのは、あなたが指示したときだけです。未公開の原稿も安心して読めます。",
    local: {
      tag: "常に",
      title: "PC の中で完結すること",
      items: [
        "アプリのサーバーは、お使いの PC の中（127.0.0.1）だけで動きます。ほかの端末からは接続できません。",
        "PDF とノートは、あなたが選んだ保管庫にだけ保存します。",
        "文の区切りに使う GROBID も、PC 上の Docker で動かせます。",
      ],
    },
    remote: {
      tag: "指示したときだけ",
      title: "外部へ送るもの",
      lead: "次の場合だけ、外部と通信します。",
      items: [
        "設定で Claude の API キーを入力し、「訳す」「用語を調べる」「数式にする」を押したとき。送るのは、選んだ範囲とその前後の本文、論文の題名だけです。数式の場合は、選んだ範囲の画像も送ります。PDF 全体は送りません。",
        "arXiv などの URL から論文を取り込んだとき。",
        "GROBID を別のサーバーで動かしているとき。",
      ],
    },
  },

  download: {
    title: "今すぐ、無料で使えます。",
    lead: "PaperLens は GitHub で配布しています。{license} ライセンスのオープンソースです。",
    desktopTitle: "デスクトップ版",
    desktopDesc: "macOS・Windows・Linux 版のアプリは、GitHub の Releases ページで公開します。",
    desktopNote: "アプリ版をまだ公開していない場合があります。そのときは、下の「ソースから動かす」の手順で起動してください。",
    platforms: [
      { name: "macOS", file: ".dmg" },
      { name: "Windows", file: "インストーラー" },
      { name: "Linux", file: "AppImage" },
    ],
    desktopCta: "Releases ページを開く",
    sourceTitle: "ソースコード",
    sourceDesc: "最新のソースコードを ZIP でダウンロードできます。git を使う場合は、下の手順で取得してください。",
    sourceCta: "ソースコード（ZIP）",
    runTitle: "ソースから動かす",
    runRequirement: ["Node.js 22.6 以上が必要です。バージョンは ", "node -v", " で確認できます。"],
    runStepsLabel: "ソースから動かす手順",
    runOpenApp: "# アプリのウィンドウで開く",
    runOr: "# または",
    runOpenBrowser: "# ブラウザで http://127.0.0.1:5175 を開く",
    grobidText: "文の区切りを正確にするため、GROBID を Docker で動かすことを強くおすすめします。リポジトリのルート（最上位のフォルダ）で、次のコマンドを実行してください。",
    grobidLabel: "GROBID を起動する手順",
    readme: ["詳しい使い方は、", "GitHub の README", " をご覧ください。"],
  },

  sharedBand: {
    eyebrow: "共有データ",
    title: "訳とノートの付いた論文を、すぐに読み始められます。",
    body: "ログインすると、PaperLens 用の共有データ（ZIP）をダウンロードできます。訳・用語・読解ノートがそろった状態から読み始められます。",
    cta: "共有データを見る",
  },

  /** トップページのデザインで足した短い文言（チップ・タブ・締めの帯など） */
  landing: {
    kickers: { features: "FEATURES", screens: "SCREENS", privacy: "PRIVACY", download: "DOWNLOAD" },
    trustLabel: "PaperLens の特長",
    trust: ["{license} ライセンス・無料", "PDF を外部へ送りません", "Obsidian でそのまま開けます"],
    chips: [
      { label: "スライド連携", text: "スライドと論文を線でつなぐ" },
      { label: "対訳", text: "1 文ずつ、原文と訳を並べる" },
      { label: "数式・用語", text: "TeX と用語の意味を記録" },
      { label: "保管庫", text: "ノートは Markdown で保存" },
    ],
    screens: {
      lead: "数式・用語・単語帳・グラフの画面を、切り替えて表示できます。",
      tabsLabel: "表示する画面",
      tabs: [
        { label: "数式", sub: "TeX と記号の意味" },
        { label: "用語", sub: "論文での使われ方" },
        { label: "単語帳", sub: "全論文の用語を一覧" },
        { label: "グラフ", sub: "用語から論文へ" },
        { label: "全体図", sub: "つながりを見渡す" },
      ],
      enlarge: "画像を拡大して見る",
    },
    closing: {
      title: "次に読む論文から、始められます。",
      body: "インストールは無料です。PDF もノートも、お使いの PC の中に残ります。",
    },
  },

  footer: {
    tagline: "論文を 1 文ずつ対訳で読み、分かったことを Markdown に残す。",
    product: "製品",
    resources: "資料",
    community: "コミュニティ",
    releases: "リリースノート",
    readme: "使い方（README）",
    zipFormat: "共有 ZIP の形式",
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
