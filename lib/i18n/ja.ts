/**
 * 日本語の文言。英語（en.ts）はこの形に合わせる（型 Dictionary で揃っているかを確かめる）。
 * "{name}" の形の部分は fill() で値を入れる。文中の `code` はコードとして表示する。
 * トップページの文言は critique/copy-v3.md と v3-copy-r1.md に沿う（読解ノート・テンプレート・読解の段階には触れない）。
 */
export const ja = {
  meta: {
    title: "PaperLens — スライドと論文をつなぐ、輪講のための論文リーダー",
    description:
      "PaperLens は、発表スライドと論文をつなぐオープンソースの論文リーダーです。スライドで囲んだ部分から、原文へすぐ移れます。用語・数式・対訳を論文の隣にまとめ、Claude（MCP）からも操作できます。",
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

  /** プレリリース準備中の表示（lib/site.ts の prerelease） */
  prerelease: {
    badge: "プレリリース準備中",
    title: "プレリリースの準備中です",
    body: "ログインと共有データは、安全性を確認してから公開します。公開までもうしばらくお待ちください。",
    back: "トップへ戻る",
    dmgTitle: "macOS 版（.dmg）",
    dmgBody: "安全性の確認が済みしだい、ここからダウンロードできるようにします。それまでは、下の手順でソースから起動できます。",
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
      "slides-link": { label: "スライドと論文", sub: "囲んでつなぎ、そのまま発表" },
      supplement: { label: "補足情報", sub: "対訳・訳・用語・数式" },
      "wordbook-graph": { label: "単語帳とグラフ", sub: "論文をまたいで引く" },
      mcp: { label: "Claude から使う（MCP）", sub: "頼んだ結果がアプリに入る" },
      "library-search": { label: "論文一覧と検索", sub: "取り込んで、一覧から開く" },
    },
  },

  hero: {
    eyebrow: "輪講と精読のための論文リーダー",
    catch: ["伝えるスライド。", "確かめる原文。"],
    tagline: "スライドと論文を直接つなぐ、新しい論文リーダー。",
    lead: "発表中も、根拠となる文章・図・数式へ瞬時にアクセス。読む、理解する、伝える。そのすべてを、ひとつの場所で。",
    primary: "ソースから動かす",
    github: "GitHub で見る",
    trustLabel: "PaperLens の特長",
    trust: ["論文は手元のフォルダに保存", "Obsidian で開ける保管庫", "Claude から使える（MCP）"],
    alt: "PaperLens の画面。左の発表スライドで囲んだ部分から、右の論文の文と数式へ、赤い線が伸びている。",
  },

  /** 使う場面（ヒーローのすぐ下の 3 枚）。target は機能の行の id */
  uses: {
    title: "こんな場面で使います",
    items: [
      {
        scene: "輪講で",
        title: "質問されても、原文をすぐ見せられる",
        body: "「それは論文のどこ？」と聞かれたら、スライドで囲んだ部分を押すだけ。論文がその箇所まで動きます。発表中は、手元の台本から操作できます。",
        target: "f-slides",
        link: "スライドと論文を見る",
      },
      {
        scene: "ひとりで読む",
        title: "知らない語や式でも、手を止めずに読める",
        body: "語は選んで調べ、式は TeX に書き起こして記号の意味を確かめます。結果は論文の隣に残ります。",
        target: "f-supplement",
        link: "補足情報を見る",
      },
      {
        scene: "あとで見返す",
        title: "調べた用語が、論文どうしをつなぐ",
        body: "前に調べた用語は、単語帳から引けます。グラフでは、同じ用語を使う論文どうしが線でつながります。",
        target: "f-lists",
        link: "単語帳とグラフを見る",
      },
    ],
  },

  /** アイコンで見る機能（#features）。app はアプリの画面での表記 */
  index: {
    title: "アイコンで見る、PaperLens の機能",
    lead: "5 つの機能を、アイコンと 1 行で。押すと、機能ごとのページへ移ります。",
    all: "機能の一覧を見る",
    items: {
      "slides-link": {
        label: "スライドと論文",
        app: "アプリでは「発表スライドと論文の対応」",
        desc: "スライドを囲み、論文の文・図・数式と線でつなぎます。そのまま発表もできます。",
      },
      supplement: {
        label: "補足情報",
        app: "論文の右のタブ: 対訳・訳・用語・数式",
        desc: "Claude に頼んだ訳と、調べた用語・数式を論文の隣に並べます。",
      },
      "wordbook-graph": {
        label: "単語帳とグラフ",
        app: "アプリでは「リスト（用語・数式）」「グラフ」",
        desc: "すべての論文の用語と数式を引き、同じ用語を使う論文をたどります。",
      },
      mcp: {
        label: "Claude から使う（MCP）",
        app: "Claude Desktop・Claude Code から",
        desc: "Claude に頼んだ訳・用語・数式・メモが、アプリに入ります。",
      },
      "library-search": {
        label: "論文一覧と検索",
        app: "アプリでは「論文一覧」「検索」",
        desc: "PDF や arXiv の番号から取り込みます。題名や、書き留めたメモ・用語・数式も探せます。",
      },
    },
  },

  features: {
    slides: {
      scene: "輪講で",
      kicker: "スライドと論文",
      title: "スライドの根拠を、原文で確かめる。",
      body: "スライドの一部を囲んでグループにし、論文の文・図・数式を選ぶと、同じ色の線で結ばれます。グループを押せば論文へ、論文側の印を押せばスライドへ移ります。",
      bullets: ["PDF と PPTX のスライドを取り込めます", "スライドを差し替えても、囲みは残ります", "「発表」で線ごと別の窓に映し、手元には台本が出ます"],
      cta: "スライドと論文を詳しく見る",
    },
    supplement: {
      scene: "ひとりで読む",
      kicker: "補足情報",
      title: "用語・数式・対訳を、論文の隣に置く。",
      body: "語を選んで「用語を調べる」を押すと、Claude が意味と、この論文での使われ方をまとめます。式を選んで「数式にする」を押すと、TeX に書き起こして記号の意味を添えます。",
      bullets: [
        "用語: 意味・説明・論文での使われ方・関連する用語",
        "数式: TeX・式の役割・記号ごとの意味",
        "対訳: Claude に頼んだ全文の訳を、1 文ずつ原文と並べます",
      ],
      cta: "補足情報を詳しく見る",
    },
    connected: {
      kicker: "スライド・論文・補足情報",
      title: "どこから見ても、論文に戻れる。",
      body: "スライドと補足情報は、どちらも論文とつながっています。タブで［スライド｜論文］と［論文｜補足情報］を切り替えても、論文は同じ場所に残ります。",
      nodes: ["スライド", "論文", "補足情報"],
      shots: ["スライドで囲んだグループ", "線の先にある、論文の文と数式", "数式タブに書き起こした式"],
    },
    lists: {
      scene: "あとで見返す",
      kicker: "単語帳とグラフ",
      title: "調べた用語は、論文をまたいで残る。",
      body: "どの論文で調べた用語も単語帳に、書き起こした数式は数式帳に集まります。グラフでは、同じ用語を使う論文どうしが線でつながります。",
      bullets: ["論文・ページ順と、五十音・ABC順で並べ替え", "項目から、その論文のページへ移れます"],
      cta: "単語帳とグラフを詳しく見る",
    },
    mcp: {
      scene: "",
      kicker: "Claude から使う（MCP）",
      title: "Claude に頼むと、結果がアプリに入る。",
      body: "PaperLens を MCP サーバーとして登録すると、Claude Desktop や Claude Code から操作できます。全文の対訳も、会話で頼めます。",
      bullets: ["全文の対訳に、API キーは要りません", "アプリを開いていれば、結果はすぐ画面に出ます", "会話で分かったことを、文やスライドのメモに残せます"],
      cta: "Claude から使う方法を詳しく見る",
      chatLabel: "Claude への頼み方と、アプリに入った結果の例",
      chat: [
        {
          ask: "この論文を全文訳して",
          result: "対訳タブに、1 文ずつ訳が入りました",
          alt: "対訳タブ。論文の英文の下に、日本語の訳が 1 文ずつ並んでいる。",
        },
        {
          ask: "式 (11) を解説して",
          result: "数式タブに、TeX と式の役割が入りました",
          alt: "数式タブ。式 (11) 平滑化フィルタが TeX から表示されている。",
        },
        {
          ask: "リカレンスプロットを用語に足して",
          result: "用語タブに、意味と説明が入りました",
          alt: "用語タブ。リカレンスプロットの意味と、初学者向けの説明。",
        },
        {
          ask: "この囲みを、論文の該当箇所とつないで",
          result: "スライドの囲みと論文が、線で結ばれました",
          alt: "スライドで囲んだグループから、論文の数式へ赤い線が伸びている。",
        },
      ],
    },
  },

  privacy: {
    title: "論文は、手元のフォルダに置いたまま。",
    body: "アプリは自分の PC の中（127.0.0.1）で動きます。外と通信するのは、Claude に頼んだとき・URL から取り込んだとき・GROBID を別のサーバーに置いたときだけです。",
    sendTitle: "Claude に送るもの",
    detail: "「訳す」「用語を調べる」「数式にする」で送るのは、選んだ範囲と前後の本文、論文の題名です。数式では選んだ範囲の画像も送ります。PDF 全体は送りません。MCP で頼んだときは、Claude が読んだ本文やページの画像が Claude に送られます。",
    apiNote: "3 つのボタンは Claude の API キーで動きます（利用量に応じて課金されます）。全文の対訳は MCP で頼むので、API キーは要りません。",
    vaultTitle: "データの置き場所",
    vault: "データは保管庫フォルダのふつうのファイルです。データベースは使わず、Obsidian の保管庫としてもそのまま開けます。",
  },

  /** はじめ方（ページの締めを兼ねる） */
  start: {
    kicker: "はじめ方",
    title: "次の輪講で、試してみてください。",
    lead: "配布用のアプリは、まだありません。いまは GitHub のソースから起動します。Node.js 22.6 以上が必要です。",
    stepsLabel: "ソースから動かす手順",
    steps: [
      {
        title: "取得してビルドする",
        body: "",
        code: "git clone https://github.com/nico0748/LogiXiv.git\ncd LogiXiv\nnpm install\nnpm run build\ncd apps/reader",
      },
      {
        title: "起動する",
        body: "アプリのウィンドウが開きます。ブラウザで使うなら `npm start` のあと http://127.0.0.1:5175 を開きます。",
        code: "npm run app",
      },
      {
        title: "GROBID を動かす（推奨）",
        body: "別のターミナルで、リポジトリの最上位（LogiXiv）から実行します。Docker が要ります。対訳の文の区切りが正確になります。無いと、区切りがずれることがあります。",
        code: "docker compose \\\n  -f docker/grobid.yml up -d",
      },
    ],
    codeLabel: "コマンド",
    /** 初めて起動したときの画面の案内（ツアー）。読解ノート・テンプレートには触れない */
    tour: {
      title: "初めて起動すると、画面の案内（ツアー）が始まります",
      body: "画面のどこで何をするかを、7 つの手順で示します。← → で進み、Esc で閉じられます。",
      replay: "ヘルプの「画面の案内（ツアー）をもう一度見る」から、いつでも見直せます。",
    },
    note: "リポジトリ名は旧名の LogiXiv のままです。",
    readme: ["詳しい手順は ", "README", " にあります。"],
    github: "GitHub で見る",
    sourceZip: "ソースコード（ZIP）",
  },

  footer: {
    tagline: "輪講と精読のための、オープンソースの論文リーダー。",
    features: "機能",
    resources: "資料",
    community: "コミュニティ",
    start: "ソースから動かす",
    releases: "リリースノート",
    readme: "使い方（README）",
    zipFormat: "共有 ZIP の形式",
    formats: "読み込めるファイル: PDF・PPTX ／ 連携: Obsidian・GROBID・MCP",
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
    withTemplates: "（_templates フォルダ付き）",
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
      "papers/<論文ID>/paperlens.json   マーカー・用語・数式",
      "papers/<論文ID>/sentences.json   1 文ずつの対訳",
      "papers/<論文ID>/slides.json      スライドの囲みとリンク（あれば）",
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
    previewTemplates: "（_templates フォルダ付き）",
    previewMeta: "{name}・{size}・{files} ファイル（展開後 {unpacked}）",
  },
};

export type Dictionary = typeof ja;
