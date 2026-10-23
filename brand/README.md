# PaperLens アイコン

セリフ体の P の丸い部分を虫眼鏡にした図柄である。レンズの中に本文の行と Σ が見える。図柄は象牙色で、アプリのアイコンでは藍色の角丸タイルに載せる。

## 元データ

| ファイル | 用途 |
| --- | --- |
| `source/icon-original.png` | 受け取った元画像。象牙色の図柄だけで、背景は透明。 |
| `icon.png` | 原本。1024×1024。アプリの primary と同じ藍（`#545a92` の前後）の角丸タイルを Apple の規格どおり 824px にし、周りを透明にしてある。 |
| `icon-mark.png` | タイル無しの図柄を藍色（`#545a92`）に塗ったもの。サイトの白い部分（ヘッダー）で使う。 |
| `icon-mark-light.png` | タイル無しの図柄（象牙色）。サイトの藍色の部分（ヒーロー・締め・フッター）で使う。 |
| `icon-full-bleed.png` | 余白と角丸の無い正方形。apple-touch-icon（iOS が角を丸める）に使う。 |

上の原本は `python3 scripts/normalize-icons.py brand/source/icon-original.png brand`（Pillow が要る）で作る。

## 書き出し

```sh
npm run icons
```

`scripts/build-icons.mjs` が macOS の `sips` と `iconutil` を使って次を作る。原本を差し替えたら必ず再実行する。

| 出力 | 中身 |
| --- | --- |
| `png/icon-{16,32,64,128,256,512,1024}.png` | アプリタイルの PNG。 |
| `PaperLens.icns` | macOS 用。16〜512 の各サイズと @2x を含む。 |
| `icon.ico` | Windows 用。16/32/48/256 の PNG を埋め込んだ ICO。 |
| `../public/brand/icon.png`, `icon-mark.png`, `icon-mark-light.png`, `icon-512.png` | サイトの画像。 |
| `../app/icon.png` | Next.js のファビコン（64px）。 |
| `../app/apple-icon.png` | 180×180 の apple-touch-icon。 |

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
