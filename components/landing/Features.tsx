type Feature = {
  title: string;
  body: string[];
  tag?: string;
  stages?: boolean;
};

const features: Feature[] = [
  {
    title: "1 文ごとの対訳",
    tag: "対訳",
    body: [
      "取り込んだ PDF を 1 文ずつに分け、右側に原文と訳を並べます。",
      "文の区切りと位置は GROBID で取ります。PDF 上の枠を押すとその文の訳へ、訳を押すと PDF のその場所へ移ります。",
      "GROBID が無くても簡易解析で動きます。ただし精度は落ちます。",
    ],
  },
  {
    title: "訳・用語・数式を残す",
    tag: "訳・用語・数式",
    body: [
      "PDF の文を選ぶと、マーカーを引いて訳や用語の説明を書けます。",
      "数式は TeX で記録し、KaTeX で数式として表示します。",
    ],
  },
  {
    title: "テンプレートから作る読解ノート",
    tag: "記録",
    stages: true,
    body: [
      "論文を取り込むと、テンプレートから読解ノート（note.md）を作ります。",
      "読む段階ごとに書く欄があるので、途中でやめても、どこまで分かったかがノートに残ります。",
    ],
  },
  {
    title: "Claude から使う（MCP）",
    tag: "AI",
    body: [
      "MCP サーバーを登録すると、Claude Desktop や Claude Code から画面と同じ操作ができます。",
      "全文の対訳は Claude に頼めます。翻訳 API のキーは要りません。",
      "アプリを起動していなくても使えます。開いていれば、書き込みは画面にすぐ出ます。",
    ],
  },
  {
    title: "発表スライドと論文をつなぐ",
    tag: "三面レイアウト",
    body: [
      "論文発表会のスライド（PDF か PPTX）を論文の左に並べられます。",
      "スライドの一部を四角で囲み、論文のどの文章・図・数式が根拠なのかをつなぐと、両者が色の線で結ばれます。",
      "表示はスライド・論文・補足情報の三面で、いつも 2 面を並べて見せます。",
    ],
  },
  {
    title: "単語帳・数式帳・グラフ",
    tag: "リスト",
    body: [
      "すべての論文の用語と数式を、単語帳と数式帳として 1 つの画面で引けます。",
      "グラフでは、論文と用語のつながりを見られます。",
    ],
  },
  {
    title: "Obsidian 互換の保管庫",
    tag: "保管庫",
    body: [
      "データは保存先フォルダの普通のファイルです。データベースは使いません。",
      "Obsidian の保管庫としてそのまま開けます。Obsidian で note.md を書き換えても、画面にすぐ反映されます。",
    ],
  },
];

const stages = ["未読", "概要把握", "精読", "検討", "まとめ済み"];

export function Features() {
  return (
    <section id="features" className="lp-section" aria-labelledby="features-title">
      <div className="container">
        <h2 id="features-title" className="lp-h2">できること</h2>
        <p className="lp-section-lead">
          読む、訳す、書き留める。この 3 つを 1 つの画面で続けられます。
        </p>
        <ul className="lp-features" role="list">
          {features.map((f) => (
            <li key={f.title} className="lp-feature">
              {f.tag && <p className="lp-tag">{f.tag}</p>}
              <h3 className="lp-h3">{f.title}</h3>
              {f.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {f.stages && (
                <ol className="lp-stages" aria-label="読解の段階">
                  {stages.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
