/**
 * 日本語の文言。英語（en.ts）はこの形に合わせる（型 Dictionary で揃っているかを確かめる）。
 * "{name}" の形の部分は fill() で値を入れる。
 */
export const ja = {
  meta: {
    title: "PaperLens — 論文を読みながら、訳・用語・数式・読解メモを Markdown に残す",
    description:
      "PaperLens は、論文 PDF を読みながら 1 文ごとの対訳と、訳・用語・数式・読解メモを Markdown の保管庫に残す、ローカルファーストな論文リーダーです。",
  },

  common: {
    skipToContent: "本文へ移動",
    siteNav: "サイト内",
    menu: "メニュー",
    closeMenu: "閉じる",
    language: "Language",
    languageList: "表示する言語",
    login: "ログイン",
    logout: "ログアウト",
    breadcrumb: "現在の位置",
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
    eyebrow: "ローカルファーストな論文リーダー",
    lead: "論文を 1 文ずつ対訳で読み、訳・用語・数式・読解メモを Markdown のノートに残せます。",
    desc: "PDF は手元の端末から出ません。アプリは自分の PC の中だけで動きます。記録は保存先フォルダの普通のファイルなので、Obsidian の保管庫としてそのまま開けます。",
    download: "無料でダウンロード",
    github: "GitHub で見る",
    platformsLabel: "対応環境",
    note: "無料で使えるオープンソースです（{license} ライセンス）。",
  },

  shot: {
    alt: "Mac で開いた PaperLens。左に発表スライド、右に論文の PDF が並び、論文には色分けしたマーカーと囲みが付いている。",
    caption: "スライドと論文を並べて読んでいるところ。",
  },

  stack: {
    title: "いつもの道具とつながる",
    items: [
      { name: "Markdown", desc: "ノートは普通のファイル" },
      { name: "Obsidian", desc: "保管庫としてそのまま開く" },
      { name: "GROBID", desc: "文の区切りと位置を取る" },
      { name: "KaTeX", desc: "TeX の数式を表示する" },
      { name: "MCP", desc: "Claude から操作する" },
      { name: "PDF / PPTX", desc: "論文と発表スライド" },
    ],
  },

  features: {
    title: "読む、訳す、書き留める。",
    lead: "この 3 つを 1 つの画面で続けられます。",
    blocks: [
      {
        kicker: "01 — 読む",
        title: "1 文ごとの対訳",
        body: [
          "取り込んだ PDF を 1 文ずつに分け、右側に原文と訳を並べます。",
          "PDF 上の枠を押すとその文の訳へ、訳を押すと PDF のその場所へ移ります。",
        ],
        points: [
          "文の区切りと位置は GROBID で取ります",
          "GROBID が無くても簡易解析で動きます（精度は落ちます）",
          "全文の対訳は Claude に頼めます。翻訳 API のキーは要りません",
        ],
      },
      {
        kicker: "02 — 書き留める",
        title: "テンプレートから作る読解ノート",
        body: [
          "論文を取り込むと、テンプレートから読解ノート（note.md）を作ります。",
          "読む段階ごとに書く欄があるので、途中でやめても、どこまで分かったかがノートに残ります。",
        ],
        points: [],
      },
      {
        kicker: "03 — つなぐ",
        title: "発表スライドと論文をつなぐ",
        body: [
          "論文発表会のスライド（PDF か PPTX）を論文の左に並べられます。",
          "スライドの一部を四角で囲み、論文のどの文章・図・数式が根拠なのかをつなぐと、両者が色の線で結ばれます。",
        ],
        points: ["表示はスライド・論文・補足情報の三面", "いつも 2 面を並べて見せます"],
      },
    ],
    linkShotAlt: "スライドの囲みから論文の数式と文へ、赤い線が引かれている画面。",
    gallery: {
      title: "画面で見る",
      items: [
        { alt: "数式タブ。式 (11) を KaTeX で表示し、TeX の原文、解説、記号ごとの意味が並んでいる。", caption: "数式: TeX で記録し、記号ごとに意味を書き添えます。" },
        { alt: "用語タブ。スロー特徴分析とリカレンスプロットの説明、この論文での使われ方、関連する用語が並んでいる。", caption: "用語: 意味と、その論文での使われ方を残します。" },
        { alt: "単語帳。すべての論文の用語を、論文・ページ順に一覧している。", caption: "単語帳: すべての論文の用語を 1 か所で引けます。" },
        { alt: "グラフ。論文と用語が線で結ばれ、選んだ FORCE 学習の説明が右に出ている。", caption: "グラフ: 用語を押すと、その意味と出てくる論文が出ます。" },
        { alt: "グラフの全体。2 本の論文から、多くの用語へ線が伸びている。", caption: "論文と用語のつながりを俯瞰できます。" },
      ],
    },
    stagesLabel: "読解の段階",
    stages: ["未読", "概要把握", "精読", "検討", "まとめ済み"],
    moreTitle: "ほかにできること",
    more: [
      {
        tag: "訳・用語・数式",
        title: "選んだところに書き込む",
        body: "PDF の文を選ぶと、マーカーを引いて訳や用語の説明を書けます。数式は TeX で記録し、KaTeX で表示します。",
      },
      {
        tag: "AI",
        title: "Claude から使う（MCP）",
        body: "MCP サーバーを登録すると、Claude Desktop や Claude Code から画面と同じ操作ができます。アプリを開いていれば、書き込みは画面にすぐ出ます。",
      },
      {
        tag: "リスト",
        title: "単語帳・数式帳・グラフ",
        body: "すべての論文の用語と数式を、単語帳と数式帳として 1 つの画面で引けます。グラフでは論文と用語のつながりを見られます。",
      },
      {
        tag: "保管庫",
        title: "Obsidian 互換の保管庫",
        body: "データは保存先フォルダの普通のファイルで、データベースは使いません。Obsidian で note.md を書き換えても、画面にすぐ反映されます。",
      },
    ],
  },

  privacy: {
    title: "論文は手元から出ません",
    lead: "未公開の原稿も安心して読めるよう、外へ出る通信を最小にしています。",
    local: {
      tag: "いつも",
      title: "手元で完結すること",
      items: [
        "アプリのサーバーは自分の PC の中（127.0.0.1）だけで待ち受けます。ほかの端末からはつながりません。",
        "PDF と記録は、選んだ保存先フォルダにだけ置きます。",
        "文の区切りに使う GROBID は、手元の Docker で動かせます。",
      ],
    },
    remote: {
      tag: "頼んだときだけ",
      title: "外へ送ること",
      lead: "次の操作をしたときだけ、外へ通信します。",
      items: [
        "設定で Claude の API キーを入れ、「訳す」「用語を調べる」「数式にする」を押したとき。送るのは選んだ範囲と前後の本文、題名です（数式では選んだ範囲の画像も）。PDF 全体は送りません。",
        "URL（arXiv など）を指定して論文を取り込んだとき。",
        "GROBID を別のホストに置いたとき。",
      ],
    },
  },

  download: {
    title: "ダウンロード",
    lead: "PaperLens は GitHub で配布しています。{license} ライセンスのオープンソースです。",
    desktopTitle: "デスクトップ版",
    desktopDesc: "macOS・Windows・Linux 向けの配布物は、GitHub のリリースのページに置きます。",
    desktopNote: "まだ配布物が無いことがあります。そのときは「ソースから動かす」をお使いください。",
    platforms: [
      { name: "macOS", file: ".dmg" },
      { name: "Windows", file: "インストーラー" },
      { name: "Linux", file: "AppImage" },
    ],
    desktopCta: "リリースのページを開く",
    sourceTitle: "ソースコード",
    sourceDesc: "最新のソースコードを ZIP でダウンロードできます。git を使う場合は下の手順でも取得できます。",
    sourceCta: "ソースコード（ZIP）",
    runTitle: "ソースから動かす",
    runRequirement: ["Node.js 22.6 以上が必要です。", "node -v", " で確かめられます。"],
    runStepsLabel: "ソースから動かす手順",
    runOpenApp: "# デスクトップ版のウィンドウで開く",
    runOr: "# または",
    runOpenBrowser: "# ブラウザで http://127.0.0.1:5175 を開く",
    grobidText: "文の区切りを正確にするため、GROBID を Docker で動かすことを強くおすすめします。リポジトリの最上位で次を実行します。",
    grobidLabel: "GROBID を起動する手順",
    readme: ["詳しい使い方は ", "GitHub の README", " にあります。"],
  },

  sharedBand: {
    eyebrow: "共有データ",
    title: "論文データを、すぐ開ける形で",
    body: "ログインすると、PaperLens で開ける論文データ（ZIP）をダウンロードできます。訳・用語・読解ノートが入った状態から読み始められます。",
    cta: "共有データを見る",
  },

  footer: {
    tagline: "論文を読みながら、訳・用語・数式・読解メモを Markdown に残す。",
    product: "製品",
    resources: "資料",
    community: "コミュニティ",
    releases: "リリースノート",
    readme: "使い方（README）",
    zipFormat: "共有 ZIP の形",
    source: "ソースコード",
    issues: "不具合の報告",
    license: "PaperLens は {license} ライセンスのオープンソースソフトウェアです。",
  },

  login: {
    title: "ログイン",
    lead: "共有データのダウンロードには、ログインが必要です。",
    github: "GitHub でログイン",
    githubHint:
      "GitHub のアカウントでログインします。このサイトはデータベースを持たず、ログインの情報はお使いのブラウザの Cookie にだけ保存します。",
    errorTitle: "ログインできませんでした",
    errors: {
      AccessDenied: "このアカウントではログインできません。管理者に、使えるアカウントの一覧に入れてもらってください。",
      CredentialsSignin: "ユーザー名が正しくありません。英数字とハイフンで入力してください。",
      Configuration: "ログインの設定に問題があります。サイトの管理者に知らせてください。",
      OAuthCallbackError: "GitHub でのログインを完了できませんでした。もう一度お試しください。",
      default: "ログインできませんでした。もう一度お試しください。",
    } as Record<string, string>,
    devTitle: "開発用ログイン",
    devHint: "開発環境でだけ表示しています（AUTH_DEV_LOGIN=1）。入力した GitHub のユーザー名としてログインします。",
    devLabel: "ユーザー名",
    devFieldHint: "英数字とハイフンで、39 文字まで入力してください。",
    devSubmit: "このユーザー名でログイン",
  },

  shared: {
    title: "共有データ",
    lead: "PaperLens で読み込める論文データを、ZIP でダウンロードできます。",
    upload: "アップロード",
    loadErrorTitle: "一覧を読み込めませんでした",
    loadError: "時間をおいて、ページを開き直してください。",
    empty: "共有データはまだありません。",
    listLabel: "共有データの一覧",
    papers: "含まれる論文",
    singleFolder: "論文フォルダ 1 本",
    paperCount: "{count} 本",
    withTemplates: "（テンプレート付き）",
    size: "大きさ",
    uploadedBy: "アップロードした人",
    uploadedAt: "日時",
    showPapers: "論文の一覧を見る",
    morePapers: "ほか {count} 本",
    download: "ダウンロード",
    downloadLabel: "「{title}」をダウンロード（{size}）",
    howToTitle: "ZIP の使い方",
    howToIntro: "ZIP の中身は、PaperLens の保管庫と同じ並びになっています。",
    howToLayout: [
      "papers/<論文ID>/paper.pdf        原文の PDF（必ず入っています）",
      "papers/<論文ID>/note.md          読解ノート",
      "papers/<論文ID>/paperlens.json   マーカー・用語・数式",
      "papers/<論文ID>/sentences.json   1 文ずつの対訳",
    ],
    howToSteps: [
      "ZIP をダウンロードして展開します。",
      "展開してできた papers フォルダの中身を、保管庫の papers フォルダへ移します。保管庫の場所は、PaperLens の設定画面で確かめられます。",
      "PaperLens を開いていれば、論文一覧に自動で加わります。出てこないときは、アプリを開き直してください。",
    ],
    howToOverwrite:
      "同じ論文 ID のフォルダが既にあるときは、上書きする前に中身を確かめてください。ZIP が <論文ID>/paper.pdf の形（論文フォルダ 1 本）のときは、そのフォルダを papers の中へ移します。",
    howToLicense: "共有された PDF は、元の論文の利用条件に従って扱ってください。再配布できないものもあります。",
    delete: "削除",
    deleting: "削除しています…",
    deleteLabel: "「{title}」を削除",
    deleteConfirm: "「{title}」を削除します。元に戻せません。よろしいですか？",
    deleteForbidden: "削除は管理者だけができます。",
    deleteNotFound: "削除するデータが見つかりません。",
    deleteFailed: "削除に失敗しました。時間をおいてもう一度お試しください。",
  },

  upload: {
    title: "共有データのアップロード",
    lead: "PaperLens の論文フォルダをまとめた ZIP を登録します。",
    forbiddenTitle: "アップロードできません",
    forbidden: "共有データのアップロードは、管理者だけができます（403）。",
    backToList: "共有データの一覧へ戻る",
    aboutZip: "ZIP の形について",
    required: "必須",
    optional: "任意",
    fileLabel: "ZIP ファイル",
    fileHint: "papers/<論文ID>/paper.pdf の形の ZIP を選んでください。{max} までです。",
    notZip: "拡張子が .zip のファイルを選んでください。",
    tooLarge: "ファイルが大きすぎます。{max} までにしてください。",
    chooseFile: "ZIP ファイルを選んでください。",
    stillChecking: "ZIP の中身を確かめています。終わるまでお待ちください。",
    cannotUpload: "このファイルはアップロードできません。下の理由を確かめてください。",
    checking: "ZIP の中身を確かめています…",
    rejected: "この ZIP はアップロードできません。",
    titleLabel: "題名",
    titleHint: "一覧に出る名前です。120 文字までです。",
    titleRequired: "題名を入力してください。",
    descLabel: "説明",
    descHint: "どんな論文をまとめたものかを書きます。2000 文字までです。",
    sending: "送信しています… {percent}%（{loaded} / {total}）",
    finishing: "ZIP の中身を確かめて、登録しています…",
    submit: "アップロード",
    submitting: "アップロードしています…",
    serverError: "サーバーがエラーを返しました（{status}）。",
    sendFailedStatus: "送信に失敗しました（{status}）。",
    sendFailed: "送信に失敗しました。通信の状態を確かめてください。",
    failed: "アップロードに失敗しました。",
    previewSingle: "論文フォルダ 1 本",
    previewCount: "論文 {count} 本",
    previewTemplates: "（テンプレート付き）",
    previewMeta: "{name}・{size}・ファイル {files} 個（展開すると {unpacked}）",
  },
};

export type Dictionary = typeof ja;
