#!/usr/bin/env node
// PaperLens のアイコン一式を brand/*.png（1024px の原本）から書き出す。
// 原本は brand/source/ の元画像から scripts/normalize-icons.py（Pillow）で作る。
// 必要なもの: macOS の sips と iconutil。npm の追加依存はない。
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const brand = join(root, "brand");
const pngDir = join(brand, "png");
const tmp = mkdtempSync(join(tmpdir(), "paperlens-icons-"));

const sources = {
  icon: join(brand, "icon.png"), // 角丸タイル（1024 中 824px、周りは透明）
  mark: join(brand, "icon-mark.png"), // タイル無しの図柄
  fullBleed: join(brand, "icon-full-bleed.png"), // 余白と角丸の無い正方形
};

function render(src, size, out) {
  mkdirSync(dirname(out), { recursive: true });
  execFileSync("sips", ["-s", "format", "png", "-z", String(size), String(size), src, "--out", out], { stdio: "ignore" });
  return out;
}

// 1. brand/png/icon-{size}.png
for (const size of [16, 32, 64, 128, 256, 512, 1024]) {
  render(sources.icon, size, join(pngDir, `icon-${size}.png`));
}

// 2. brand/PaperLens.icns（iconutil に iconset ディレクトリを渡す）
const iconset = join(tmp, "PaperLens.iconset");
mkdirSync(iconset);
for (const base of [16, 32, 128, 256, 512]) {
  render(sources.icon, base, join(iconset, `icon_${base}x${base}.png`));
  render(sources.icon, base * 2, join(iconset, `icon_${base}x${base}@2x.png`));
}
execFileSync("iconutil", ["-c", "icns", iconset, "-o", join(brand, "PaperLens.icns")]);

// 3. brand/icon.ico（PNG を埋め込んだ ICO を自前で組み立てる）
const icoEntries = [16, 32, 48, 256].map((size) => ({
  size,
  data: readFileSync(render(sources.icon, size, join(tmp, `ico-${size}.png`))),
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

// 4. サイト用
const publicBrand = join(root, "public", "brand");
mkdirSync(publicBrand, { recursive: true });
render(sources.icon, 128, join(publicBrand, "icon.png"));
render(sources.mark, 256, join(publicBrand, "icon-mark.png"));
copyFileSync(join(pngDir, "icon-512.png"), join(publicBrand, "icon-512.png"));
render(sources.icon, 64, join(root, "app", "icon.png"));
render(sources.fullBleed, 180, join(root, "app", "apple-icon.png"));

rmSync(tmp, { recursive: true, force: true });

const outputs = [
  ...[16, 32, 64, 128, 256, 512, 1024].map((s) => `brand/png/icon-${s}.png`),
  "brand/PaperLens.icns",
  "brand/icon.ico",
  "public/brand/icon.png",
  "public/brand/icon-mark.png",
  "public/brand/icon-512.png",
  "app/icon.png",
  "app/apple-icon.png",
];
const missing = outputs.filter((p) => !existsSync(join(root, p)));
if (missing.length) {
  console.error(`書き出せなかったファイル: ${missing.join(", ")}`);
  process.exit(1);
}
console.log(`アイコンを ${outputs.length} 件書き出した:\n  ${outputs.join("\n  ")}`);
