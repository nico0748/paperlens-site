import type { CSSProperties } from "react";
import type { Callout, Stage } from "@/lib/stage-types";
import { stageMeta, type StageKey } from "@/lib/scenes";
import { calloutBox, fitRect, frameAspect, layerTransform, sceneSrc, srcSetFor, type ViewRect } from "./stage-geometry";

type Lang = "ja" | "en";

/**
 * 画面写真の中身（枠の内側）。画像の層と、場面ごとの囲み・点・下線・吹き出しを描く。
 * フックを使わないので、サーバーでもクライアントでも使える。
 * - 画像は src ごとに 1 枚の層。表示中の場面の src の層だけ不透明にする（src が替わるとクロスフェード）。
 * - 層は transform（scale + translate）だけで動かす。表示していない層は「次にその層を使う場面」の位置に置いておくので、
 *   出てくるときはフェードだけで、急に動かない。
 * - 囲みなどは拡大しない別の面に、表示範囲に対する % で置く（線の太さと文字の大きさが拡大で変わらない）。
 */
export function StageView({
  stage,
  lang,
  active,
  priority = false,
  sizes,
  id,
  role,
  label,
  aspect,
}: {
  stage: Stage;
  lang: Lang;
  active: number;
  priority?: boolean;
  sizes?: string;
  id?: string;
  role?: string;
  label?: string;
  /** 枠の縦横比（"16/10" など）。省略時は lib/scenes.ts の stageMeta、それも無ければ画像の縦横比 */
  aspect?: string;
}) {
  const scenes = stage.scenes;
  const n = scenes.length;
  const cur = Math.min(Math.max(active, 0), Math.max(n - 1, 0));
  const frame = frameAspect(stage, aspect ?? stageMeta[stage.id as StageKey]?.aspect);
  const rects = scenes.map((s) => fitRect(stage, s.rect, frame));
  const srcs = Array.from(new Set([stage.src, ...scenes.map((s) => sceneSrc(stage, s))]));
  const activeSrc = sceneSrc(stage, scenes[cur]);
  // 拡大する分だけ大きい画像を選ばせる（枠に対する倍率の最大）
  const maxK = rects.reduce((m, r) => Math.max(m, stage.width / r.w), 1);
  const imgSizes = sizes ?? `(max-width: 1000px) ${Math.round(100 * Math.min(maxK, 3))}vw, ${Math.round(720 * Math.min(maxK, 3))}px`;

  /** 層 src の置き場所: 表示中ならその場面、そうでなければ次にその層を使う場面 */
  const rectFor = (src: string): ViewRect => {
    for (let d = 0; d < n; d++) {
      const j = (cur + d) % n;
      if (sceneSrc(stage, scenes[j]) === src) return rects[j];
    }
    return fitRect(stage, { x: 0, y: 0, w: 100, h: 100 }, frame);
  };

  return (
    <div
      className="stage-view"
      id={id}
      role={role}
      aria-label={label}
      style={{ aspectRatio: String(Math.round(frame * 10000) / 10000) }}
    >
      {srcs.map((src, li) => {
        const { k, transform } = layerTransform(stage, rectFor(src));
        const on = src === activeSrc;
        const isBase = src === stage.src;
        const set = srcSetFor(stage, src);
        return (
          <div
            key={src}
            className="stage-layer"
            data-on={on ? "" : undefined}
            style={{ transform, aspectRatio: `${stage.width} / ${stage.height}`, "--k": k } as CSSProperties}
          >
            <img
              src={src}
              srcSet={set}
              sizes={set ? imgSizes : undefined}
              width={stage.width}
              height={stage.height}
              alt={li === 0 ? stage.alt[lang] : ""}
              loading={priority && isBase ? "eager" : "lazy"}
              fetchPriority={priority && isBase ? "high" : undefined}
              decoding="async"
              draggable={false}
            />
          </div>
        );
      })}
      {scenes.map((s, si) => (
        <div key={si} className="stage-callouts" data-on={si === cur ? "" : undefined} aria-hidden="true">
          {s.callouts.map((c, ci) => (
            <CalloutMark key={ci} c={c} pos={calloutBox(stage, rects[si], c)} lang={lang} i={ci} />
          ))}
        </div>
      ))}
    </div>
  );
}

function CalloutMark({
  c,
  pos,
  lang,
  i,
}: {
  c: Callout;
  pos: { left: number; top: number; width: number; height: number };
  lang: Lang;
  i: number;
}) {
  const text = c.text?.[lang];
  const base = { "--i": i } as Record<string, string | number>;
  const pct = (v: number) => `${Math.round(v * 100) / 100}%`;

  if (c.kind === "dot") {
    const cx = pos.left + pos.width / 2;
    const cy = pos.top + pos.height / 2;
    return (
      <span className="stage-co stage-co-dot" style={{ ...base, left: pct(cx), top: pct(cy) } as CSSProperties}>
        {text && <Chip text={text} left={cx} top={cy} gap={14} />}
      </span>
    );
  }
  if (c.kind === "label") {
    return (
      <span className="stage-co stage-co-anchor" style={{ ...base, left: pct(pos.left), top: pct(pos.top) } as CSSProperties}>
        {text && <Chip text={text} left={pos.left} top={pos.top} gap={0} inline />}
      </span>
    );
  }
  const cls = c.kind === "underline" ? "stage-co stage-co-underline" : "stage-co stage-co-box";
  const style =
    c.kind === "underline"
      ? { ...base, left: pct(pos.left), top: pct(pos.top + pos.height), width: pct(pos.width) }
      : { ...base, left: pct(pos.left), top: pct(pos.top), width: pct(pos.width), height: pct(pos.height) };
  return (
    <span className={cls} style={style as CSSProperties}>
      {text && <Chip text={text} left={pos.left} top={pos.top} right={pos.left + pos.width} gap={0} edge={c.kind === "box"} />}
    </span>
  );
}

/**
 * 吹き出し。囲みでは枠の上辺にまたがせる（どの囲みの札か分かるように）。上端に近い囲みでは枠の内側に入れる。
 * 点では点の上（上が詰まっていれば下）。右寄りのものは右端にそろえる。
 * 位置は親（囲み・点）に対する相対指定なので、枠の大きさが変わってもずれない。
 */
function Chip({
  text,
  left,
  top,
  right,
  gap,
  inline,
  edge,
}: {
  text: string;
  left: number;
  top: number;
  right?: number;
  gap: number;
  inline?: boolean;
  edge?: boolean;
}) {
  const below = top < 16;
  const alignRight = (right ?? left) > 62;
  const cls = [
    "stage-chip",
    inline ? "stage-chip-inline" : edge ? (top < 6 ? "stage-chip-inset" : "stage-chip-edge") : below ? "stage-chip-below" : "stage-chip-above",
    alignRight ? "stage-chip-right" : "",
  ].join(" ");
  return (
    <span className={cls} style={{ "--gap": `${gap}px` } as CSSProperties}>
      {text}
    </span>
  );
}
