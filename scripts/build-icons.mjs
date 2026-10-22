#!/usr/bin/env node
// PaperLens のアイコン一式を brand/*.svg から書き出す。
// 必要なもの: rsvg-convert (Homebrew の librsvg) と macOS の iconutil。npm の追加依存はない。
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const brand = join(root, "brand");
const pngDir = join(brand, "png");
const tmp = mkdtempSync(join(tmpdir(), "paperlens-icons-"));

const RSVG = ["/opt/homebrew/bin/rsvg-convert", "/usr/local/bin/rsvg-convert"].find(existsSync) ?? "rsvg-convert";

const iconSvg = readFileSync(join(brand, "icon.svg"), "utf8");
const faviconSvg = readFileSync(join(brand, "favicon.svg"), "utf8");

// 小さいサイズ (32px 以下) 用: 簡略版の図柄を、本体と同じ余白 (1024 中 100px) の中に置いたもの。
const faviconInner = faviconSvg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const smallTileSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
<svg x="100" y="100" width="824" height="824" viewBox="0 0 64 64">${faviconInner}</svg></svg>`;

// apple-touch-icon 用: iOS が角を丸めるので、余白と角丸を外した正方形にする。
const fullBleedSvg = iconSvg
  .replace(/viewBox="0 0 1024 1024"/, 'viewBox="100 100 824 824"')
  .replace(/ rx="185"/, "");

const sources = {
  icon: join(brand, "icon.svg"),
  small: writeTmp("small.svg", smallTileSvg),
  favicon: join(brand, "favicon.svg"),
  fullBleed: writeTmp("full-bleed.svg", fullBleedSvg),
};

function writeTmp(name, text) {
  const p = join(tmp, name);
  writeFileSync(p, text);
  return p;
}

function render(svg, size, out) {
  mkdirSync(dirname(out), { recursive: true });
  execFileSync(RSVG, ["-w", String(size), "-h", String(size), "-o", out, svg]);
  return out;
}

// アプリ用の図柄は 32px 以下で簡略版に切り替える。
const appSource = (size) => (size <= 32 ? sources.small : sources.icon);

// 1. brand/png/icon-{size}.png
for (const size of [16, 32, 64, 128, 256, 512, 1024]) {
  render(appSource(size), size, join(pngDir, `icon-${size}.png`));
}

// 2. brand/PaperLens.icns (iconutil に iconset ディレクトリを渡す)
const iconset = join(tmp, "PaperLens.iconset");
mkdirSync(iconset);
for (const base of [16, 32, 128, 256, 512]) {
  render(appSource(base), base, join(iconset, `icon_${base}x${base}.png`));
  render(appSource(base * 2), base * 2, join(iconset, `icon_${base}x${base}@2x.png`));
}
execFileSync("iconutil", ["-c", "icns", iconset, "-o", join(brand, "PaperLens.icns")]);

// 3. brand/icon.ico (PNG を埋め込んだ ICO を自前で組み立てる)
const icoEntries = [16, 32, 48, 256].map((size) => ({
  size,
  data: readFileSync(render(size <= 48 ? sources.favicon : sources.icon, size, join(tmp, `ico-${size}.png`))),
}));
writeFileSync(join(brand, "icon.ico"), buildIco(icoEntries));

function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = header.length + dir.length;
  entries.forEach(({ size, data }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o); // 0 は 256 を表す
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2); // パレット数
    dir.writeUInt8(0, o + 3); // reserved
    dir.writeUInt16LE(1, o + 4); // color planes
    dir.writeUInt16LE(32, o + 6); // bits per pixel
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

// 4. サイト用のコピー
const publicBrand = join(root, "public", "brand");
mkdirSync(publicBrand, { recursive: true });
copyFileSync(join(brand, "icon.svg"), join(publicBrand, "icon.svg"));
copyFileSync(join(brand, "icon-mark.svg"), join(publicBrand, "icon-mark.svg"));
copyFileSync(join(pngDir, "icon-512.png"), join(publicBrand, "icon-512.png"));
copyFileSync(join(brand, "favicon.svg"), join(root, "app", "icon.svg"));
render(sources.fullBleed, 180, join(root, "app", "apple-icon.png"));

rmSync(tmp, { recursive: true, force: true });

const outputs = [
  ...[16, 32, 64, 128, 256, 512, 1024].map((s) => `brand/png/icon-${s}.png`),
  "brand/PaperLens.icns",
  "brand/icon.ico",
  "public/brand/icon.svg",
  "public/brand/icon-mark.svg",
  "public/brand/icon-512.png",
  "app/icon.svg",
  "app/apple-icon.png",
];
const missing = outputs.filter((p) => !existsSync(join(root, p)));
if (missing.length) {
  console.error(`書き出せなかったファイル: ${missing.join(", ")}`);
  process.exit(1);
}
console.log(`アイコンを ${outputs.length} 件書き出した:\n  ${outputs.join("\n  ")}`);
