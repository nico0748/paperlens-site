import type { Callout, Scene, Stage } from "@/lib/stage-types";

/** 拡大する範囲（元画像の px）。枠の縦横比に合わせて広げ、画像の外にはみ出さないよう寄せたもの */
export type ViewRect = { x: number; y: number; w: number; h: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * 場面の rect（元画像に対する 0〜100 の割合）を、枠の縦横比 frame（幅 / 高さ）に合う範囲にする。
 * 細長い範囲は中心を保ったまま短い辺を伸ばし、画像の外に出ないよう寄せる（画像より大きくなるときは縮める）。
 */
export function fitRect(stage: Pick<Stage, "width" | "height">, rect: Scene["rect"], frame = stage.width / stage.height): ViewRect {
  const W = stage.width;
  const H = stage.height;
  const cx = ((rect.x + rect.w / 2) / 100) * W;
  const cy = ((rect.y + rect.h / 2) / 100) * H;
  let w = Math.max(1, (rect.w / 100) * W);
  let h = Math.max(1, (rect.h / 100) * H);
  if (w / h < frame) w = h * frame;
  else h = w / frame;
  if (w > W) {
    w = W;
    h = W / frame;
  }
  if (h > H) {
    h = H;
    w = H * frame;
  }
  return { x: clamp(cx - w / 2, 0, W - w), y: clamp(cy - h / 2, 0, H - h), w, h };
}

/** 枠の縦横比（幅 / 高さ）。"16/10" のような文字列か数。無ければ画像の縦横比 */
export function frameAspect(stage: Pick<Stage, "width" | "height">, aspect?: string | number) {
  if (typeof aspect === "number" && aspect > 0) return aspect;
  if (typeof aspect === "string") {
    const [a, b] = aspect.split("/").map((v) => Number(v.trim()));
    if (a > 0 && b > 0) return a / b;
  }
  return stage.width / stage.height;
}

/**
 * 画像の層に付ける transform。transform-origin は左上。
 * 層は枠と同じ幅で、縦横比は画像と同じ。translate の % は層自身（拡大前）に対する割合なので、
 * 枠の大きさを測らずに、範囲 r がちょうど枠に収まる。
 */
export function layerTransform(stage: Pick<Stage, "width" | "height">, r: ViewRect) {
  const k = stage.width / r.w;
  const tx = (r.x / stage.width) * 100;
  const ty = (r.y / stage.height) * 100;
  return { k, transform: `scale(${round(k)}) translate(${round(-tx)}%, ${round(-ty)}%)` };
}

/** 吹き出し・囲みの位置を、枠（表示している範囲）に対する % で返す */
export function calloutBox(stage: Pick<Stage, "width" | "height">, r: ViewRect, c: Callout) {
  const px = (c.x / 100) * stage.width;
  const py = (c.y / 100) * stage.height;
  const pw = ((c.w ?? 0) / 100) * stage.width;
  const ph = ((c.h ?? 0) / 100) * stage.height;
  return {
    left: ((px - r.x) / r.w) * 100,
    top: ((py - r.y) / r.h) * 100,
    width: (pw / r.w) * 100,
    height: (ph / r.h) * 100,
  };
}

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

/** 場面ごとの画像（省略時は stage.src） */
export const sceneSrc = (stage: Stage, s: Scene | undefined) => s?.src ?? stage.src;

/**
 * 場面ごとの画像の srcSet。stage.src 以外は、同じ名前に -800 を付けた 800w 版がある約束（lib/scenes.ts）。
 */
export function srcSetFor(stage: Stage, src: string) {
  if (src === stage.src) return stage.srcSet || undefined;
  if (!/-800\.webp\b/.test(stage.srcSet) || !src.endsWith(".webp")) return undefined;
  return `${src.replace(/\.webp$/, "-800.webp")} 800w, ${src} ${stage.width}w`;
}

/** srcSet の中でいちばん大きい画像（「画面を拡大」で開く） */
export function largestSrc(stage: Stage, src: string) {
  const set = srcSetFor(stage, src);
  if (!set) return src;
  let best = src;
  let bestW = 0;
  for (const part of set.split(",")) {
    const [url, d] = part.trim().split(/\s+/);
    const w = d?.endsWith("w") ? Number(d.slice(0, -1)) : 0;
    if (url && w > bestW) {
      best = url;
      bestW = w;
    }
  }
  return best;
}

/**
 * 場面 a から b へ動く時間（ms）。拡大率の差（log2）と、中心の移動距離（画像の幅に対する割合）で伸ばす。
 * clamp(700, 700 + 350·|log2(k1/k0)| + 400·d, 1300)
 */
export function panDuration(stage: Pick<Stage, "width" | "height">, a: ViewRect, b: ViewRect) {
  const ka = stage.width / a.w;
  const kb = stage.width / b.w;
  const d = Math.hypot(a.x + a.w / 2 - (b.x + b.w / 2), a.y + a.h / 2 - (b.y + b.h / 2)) / stage.width;
  return Math.round(clamp(700 + 350 * Math.abs(Math.log2(kb / ka)) + 400 * d, 700, 1300));
}

/** 拡大したまま遠くへ飛ぶ移動か（いったん両方が入る範囲まで引いてから寄る） */
export function isLongJump(stage: Pick<Stage, "width" | "height">, a: ViewRect, b: ViewRect) {
  const d = Math.hypot(a.x + a.w / 2 - (b.x + b.w / 2), a.y + a.h / 2 - (b.y + b.h / 2)) / stage.width;
  return d > 0.35 && stage.width / a.w > 1.3 && stage.width / b.w > 1.3;
}

/** 2 つの範囲を両方含む範囲（元画像の px）を、rect（0〜100）で返す */
export function unionPct(stage: Pick<Stage, "width" | "height">, a: ViewRect, b: ViewRect): Scene["rect"] {
  const x0 = Math.min(a.x, b.x);
  const y0 = Math.min(a.y, b.y);
  const x1 = Math.max(a.x + a.w, b.x + b.w);
  const y1 = Math.max(a.y + a.h, b.y + b.h);
  return { x: (x0 / stage.width) * 100, y: (y0 / stage.height) * 100, w: ((x1 - x0) / stage.width) * 100, h: ((y1 - y0) / stage.height) * 100 };
}

/**
 * 狭い画面の静止画で見せる範囲（0〜100）。scene.mobileRect があればそれ。
 * 無ければ、場面がほぼ全体を見せている（幅 60% 超）ときだけ、吹き出しを囲む範囲に余白を足して寄せる
 * （幅は画像の 38% 以上に保つ。寄せすぎると何の画面か分からなくなる）。
 */
export function stillRect(scene: Scene, minW = 38): Scene["rect"] {
  if (scene.mobileRect && minW < 100) return scene.mobileRect;
  const r = scene.rect;
  const cs = scene.callouts;
  if ((r.w <= 60 && minW < 100) || cs.length === 0) return r;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const c of cs) {
    const w = c.kind === "dot" || c.kind === "label" ? 0 : c.w ?? 0;
    const h = c.kind === "box" ? c.h ?? 0 : 0;
    x0 = Math.min(x0, c.x);
    y0 = Math.min(y0, c.y);
    x1 = Math.max(x1, c.x + w);
    y1 = Math.max(y1, c.y + h);
  }
  const pad = 6;
  x0 = Math.max(0, x0 - pad);
  y0 = Math.max(0, y0 - pad);
  x1 = Math.min(100, x1 + pad);
  y1 = Math.min(100, y1 + pad);
  let w = x1 - x0;
  if (w < minW) {
    const cx = (x0 + x1) / 2;
    x0 = clamp(cx - minW / 2, 0, 100 - minW);
    w = minW;
  }
  return { x: x0, y: y0, w, h: y1 - y0 };
}
