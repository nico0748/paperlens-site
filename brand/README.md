# PaperLens アイコン

論文の紙（折り返した角と本文の行）にルーペを重ねた図柄である。ルーペの中では 1 行が拡大され、マーカー黄（`#ffe083`）で強調されている。色はアプリの M3 パレット（primary `#545a92`、primary-strong `#3c4279`、primary-container `#dfe0ff`、surface `#fbf8ff`）に合わせた。

## 元データ（手で編集するのはこの 3 つだけ）

| ファイル | 用途 |
| --- | --- |
| `icon.svg` | 原本。1024×1024 のアプリタイル。824px の角丸正方形（角の半径 185 = 約 22%）を上下左右 100px の余白の内側に置いている（Apple のアイコン規格に沿う）。64px 以上はこれから書き出す。 |
| `icon-mark.svg` | 図柄だけ（背景は透明）。サイトのヘッダーなど、明るい背景と暗い背景のどちらにも置ける。 |
| `favicon.svg` | 小さいサイズ用の簡略版。本文の行を省き、紙・ルーペ・黄色の行だけにした。余白なしの角丸タイル。 |

## 書き出し

```sh
npm run icons
```

`scripts/build-icons.mjs` が `rsvg-convert`（`brew install librsvg`）と macOS の `iconutil` を使って次を作る。SVG を直したら必ず再実行する。

| 出力 | 中身 |
| --- | --- |
| `png/icon-{16,32,64,128,256,512,1024}.png` | アプリタイルの PNG。32px 以下は `favicon.svg` の図柄を同じ余白に置いた簡略版になる。 |
| `PaperLens.icns` | macOS 用。16〜512 の各サイズと @2x を含む。 |
| `icon.ico` | Windows 用。16/32/48 は簡略版（余白なし）、256 は原本。PNG を埋め込んだ ICO。 |
| `../public/brand/icon.svg`, `icon-mark.svg`, `icon-512.png` | サイトの画像として使うコピー。 |
| `../app/icon.svg` | Next.js のファビコン（`favicon.svg` のコピー）。 |
| `../app/apple-icon.png` | 180×180 の apple-touch-icon。iOS が角を丸めるので、余白と角丸のない正方形にしてある。 |

## PaperLens アプリ（Electron）で使う

electron-builder は、ビルド資材のディレクトリ（既定は `build/`）にある `icon.icns`・`icon.ico`・`icon.png` を自動で拾う。PaperLens のリポジトリでは次のように置く。

```sh
cp brand/PaperLens.icns    <PaperLens>/apps/reader/build/icon.icns
cp brand/icon.ico          <PaperLens>/apps/reader/build/icon.ico
cp brand/png/icon-1024.png <PaperLens>/apps/reader/build/icon.png
```

`icon.png` は 512px 以上が必要なので 1024 を使う（Linux 向けにもこれが使われる）。

別の場所に置く場合は、`electron-builder` の設定で明示する。

```json
{
  "build": {
    "mac": { "icon": "build/icon.icns" },
    "win": { "icon": "build/icon.ico" },
    "linux": { "icon": "build/icon.png" }
  }
}
```

開発中（`electron .` で起動したとき）の Dock のアイコンは electron-builder では変わらない。必要なら main プロセスで `app.dock?.setIcon(path)` に `icon.png` を渡し、Windows/Linux では `BrowserWindow` の `icon` に同じ PNG を渡す。
