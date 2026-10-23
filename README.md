# paperlens-site

[PaperLens](https://github.com/nico0748/LogiXiv) の公開サイト。次の 3 つを置く。

- 機能紹介とダウンロードへの案内（`/`）
- ログインした人だけが使える、PaperLens で開ける論文データ（ZIP）の共有場所（`/shared`）
- 共有する ZIP を上げるページ（`/upload`、管理者だけ）

PaperLens のアイコン一式は `brand/` にある（作り方は [brand/README.md](brand/README.md)）。

## 構成

| 項目 | 採ったもの | 理由 |
| --- | --- | --- |
| 枠組み | Next.js（App Router）+ TypeScript | 静的な紹介ページと、ログインが要る API を 1 つのアプリで持てる |
| ログイン | Auth.js v5 + GitHub OAuth | 利用者は研究者・開発者なので GitHub アカウントを持っている前提にした。DB は使わない（JWT） |
| ZIP の置き場 | S3 互換ストレージ（Cloudflare R2 を想定）／手元のフォルダ | ZIP は数十 MB になりうる。ブラウザから署名付き URL で直接上げ下げし、サーバーの本文サイズ上限を避ける |
| 置き場所（ホスティング） | Vercel を想定 | Next.js をそのまま載せられる。ほかの Node.js ホストでも `npm run build && npm start` で動く |

権限は 2 段にした。

- **ログインした人**: 共有データの一覧を見て、ZIP をダウンロードできる。
  `ALLOWED_GITHUB_LOGINS` を設定すると、ログインできる人をその GitHub アカウントに絞れる
- **管理者**（`ADMIN_GITHUB_LOGINS`）: ZIP を上げる・消す

## 手元で動かす

Node 20.9 以上。

```bash
npm install
cp .env.example .env.local     # 値を埋める（下を参照）
npm run dev                    # http://localhost:3000
```

GitHub の OAuth App を作らずに試すときは、`.env.local` に次を書くと
「開発用ログイン」が出る（`npm run dev` のときだけ有効で、本番では無視される）。

```bash
AUTH_SECRET=dev-secret
AUTH_DEV_LOGIN=1
ADMIN_GITHUB_LOGINS=nico0748
STORAGE_DRIVER=local          # ZIP は ./.data/shared/ に入る
```

## 本番に出す（Vercel + Cloudflare R2 の例）

1. GitHub で OAuth App を作る（Settings → Developer settings → OAuth Apps）。
   Callback URL は `https://<サイトのドメイン>/api/auth/callback/github`
2. Cloudflare R2 でバケットを作り、API トークン（オブジェクトの読み書き）を発行する。
   ブラウザから直接上げるので、バケットの CORS に次を足す

   ```json
   [{ "AllowedOrigins": ["https://<サイトのドメイン>"], "AllowedMethods": ["PUT", "GET"], "AllowedHeaders": ["content-type"], "MaxAgeSeconds": 3600 }]
   ```

3. Vercel にこのリポジトリを読み込み、環境変数を入れる（一覧と意味は `.env.example`）
   - `AUTH_SECRET`（`npx auth secret` で作る）、`AUTH_GITHUB_ID`、`AUTH_GITHUB_SECRET`
   - `ADMIN_GITHUB_LOGINS`、必要なら `ALLOWED_GITHUB_LOGINS`
   - `STORAGE_DRIVER=s3`、`S3_BUCKET`、`S3_ENDPOINT`（`https://<account>.r2.cloudflarestorage.com`）、`S3_ACCESS_KEY_ID`、`S3_SECRET_ACCESS_KEY`
4. デプロイする

Vercel では `STORAGE_DRIVER=local` は使えない（ファイルが残らない）。

## 共有する ZIP の形

PaperLens の保管庫の `papers/<論文ID>/` をそのまま ZIP にしたもの。
詳しくは [docs/zip-format.md](docs/zip-format.md)。

## アイコンを作り直す

```bash
npm run icons     # brand/icon.png から PNG・.icns・.ico と、サイト用の画像を作る（macOS の sips と iconutil を使う）
```
