# 共有 ZIP の形式

サイトの「共有データ」（`/shared`）で配る ZIP の決まり。
PaperLens 本体にはまだ ZIP を取り込む機能が無いので、**保管庫のフォルダの並びをそのまま ZIP にしたもの**を形式とする。
展開して保管庫に置けば、そのまま PaperLens で開ける。

## 中身の並び

### 保管庫の形（基本）

```
papers/<論文ID>/paper.pdf               必須。原文の PDF
papers/<論文ID>/note.md                 任意。読解ノート（frontmatter の title を一覧に出す）
papers/<論文ID>/paperlens.json          任意。マーカー・用語・数式
papers/<論文ID>/sentences.json          任意。1 文ずつの対訳
papers/<論文ID>/sentences.status.json   任意。解析の進み具合
papers/<論文ID>/slides.pdf              任意。発表スライド
papers/<論文ID>/slides.pptx             任意。スライドの元ファイル
papers/<論文ID>/slides.json             任意。スライドのグループと論文へのリンク
_templates/reading-note.md              任意。読解ノートのテンプレート
```

- 論文はいくつ入れてもよい。論文ごとに `paper.pdf` が必須
- `papers/` と `_templates/` の外にファイルを置いてはいけない（`.paperlens/` の画面の配置も入れない）
- ZIP の一番上に `papers/` が来るようにする。Finder で保管庫フォルダごと圧縮すると `<保管庫名>/papers/...` になり、受け付けない。保管庫の中で `papers` フォルダ（と `_templates`）を選んで圧縮する

### 論文フォルダ 1 本の形

```
<論文ID>/paper.pdf
<論文ID>/note.md
...
```

論文フォルダを 1 つだけ圧縮したもの。一番上のフォルダは 1 つに限る。一覧では「論文フォルダ 1 本」と表示する。

## 受け付けない ZIP

アップロード前（ブラウザ）とアップロード後（サーバー）の両方で同じ検査をする（`lib/zip/inspect.ts`）。

- `..` を含むパス、`/` や `C:` で始まる絶対パス、`\` を含むパス、制御文字を含むパス
- `paper.pdf` の無い論文フォルダがあるもの、論文フォルダが 1 つも無いもの
- 上の 2 つの形のどちらにも当てはまらないもの
- パスワード付きのもの
- 上限（`MAX_UPLOAD_MB`、既定 200MB）を超えるもの、ファイルが 5 万個を超えるもの

`__MACOSX/`、`.DS_Store`、`Thumbs.db` は無視する（あってもよい）。

ファイル名は UTF-8 として読む。macOS の Finder と `zip` コマンド、Windows 10 以降の「圧縮フォルダー」で作ったものは問題ない。

検査は ZIP の末尾にある目次（中央ディレクトリ）だけを読むので、大きな ZIP でも速い。
題名を出すために `note.md` だけは中身を読む（512KB まで・60 本まで）。PDF の中身は確かめない。

## PaperLens への取り込み方

1. ZIP をダウンロードして展開する
2. 展開してできた `papers/` の中の論文フォルダを、保管庫の `papers/` に移す。
   保管庫の場所は PaperLens の設定画面で確かめられる（初期値は `apps/reader/data`、配布版は「書類」の `PaperLens`）
3. `_templates/reading-note.md` が入っていて、そのテンプレートを使いたいときだけ、保管庫の `_templates/` に移す（今のテンプレートは上書きされる）
4. PaperLens（デスクトップ版、または `npm start` のブラウザ版）を開いていれば、論文一覧に自動で加わる。
   ローカルサーバーが保管庫の `papers/` を見張っていて、新しい論文フォルダができると画面に知らせるため。
   出てこないとき、またはサーバーの無い 1 枚の HTML 版（`build:single`）では、アプリを開き直す

同じ論文 ID のフォルダが既にあるときは、上書きすると手元の訳やメモが消える。先に中身を見比べる。

`sentences.json` が無い論文は、開いたときに 1 文ずつの解析が始まる。

## 保存先とアップロードの流れ

| 手順 | API | local | s3 |
| --- | --- | --- | --- |
| 1. 予約 | `POST /api/shared/uploads`（管理者） | ID を作り、送り先として下の PUT を返す | ID を作り、署名付き PUT URL（10 分）を返す |
| 2. 本体を送る | `PUT` | `PUT /api/shared/uploads/<id>` がディスクへ流し込む（大きさを数え、申告を超えたら止める） | ブラウザからストレージへ直接送る |
| 3. 仕上げ | `POST /api/shared/uploads/<id>/complete`（管理者） | 目次を読み直して検査し、`items/<id>.json` を書く | 同じ（範囲読み込みで目次だけ取る） |
| ダウンロード | `GET /api/shared/<id>/download`（ログイン必須） | 本体を流す | 署名付き GET URL（60 秒）へ 302 で転送 |

保存の形はどちらも同じ。

```
items/<id>.zip    ZIP 本体
items/<id>.json   メタデータ（題名・説明・ファイル名・大きさ・アップロードした人と日時・論文の一覧）
```

一覧は `items/*.json` を数えて作る。DB は無い。

### 信頼の考え方

- アップロードと削除は `ADMIN_GITHUB_LOGINS` の人だけ。各 API と Server Action で毎回確かめる
- ID はサーバーが `crypto.randomUUID()` で作る。クライアントから来たパスは使わない
- 一覧に出す論文の一覧は、クライアントの申告ではなく、サーバーが ZIP を読み直して作る
- ただし PDF やノートの中身までは確かめない。中身の正しさは、アップロードした管理者を信じる
- s3 では、予約だけして本体を送らなかった（または仕上げをしなかった）ZIP がバケットに残ることがある。一覧には出ない。ライフサイクルルールなどで時々消す

### S3・R2 の準備

バケットの CORS で、サイトのオリジンからの `PUT` と `Content-Type` ヘッダーを許す。R2 の例:

```json
[
  {
    "AllowedOrigins": ["https://<サイトのドメイン>"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

ダウンロードは転送先へのページ遷移なので CORS は要らない。バケットは公開しない。
