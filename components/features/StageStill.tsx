import "./stage.css";
import type { Scene, Stage } from "@/lib/stage-types";
import { StageView } from "./StageView";
import { stillRect } from "./stage-geometry";

const sameRect = (a: Scene["rect"], b: Scene["rect"]) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;

/**
 * 動かない 1 場面だけの画面写真（手順の横・狭い画面・ヒーロー）。サーバーでも描ける。
 * 狭い画面（1000px 以下）では、場面の mobileRect か、吹き出しのまわりに寄せた範囲に切り替える
 * （全体の画面は、幅 358px では文字が読めない）。両方を描いて CSS で切り替えるので、読み込みのずれは起きない。
 */
export function StageStill({
  stage,
  lang,
  scene,
  className,
  aspect,
  narrowAspect,
  narrow = true,
  priority = false,
  alt,
  fit = "scene",
}: {
  stage: Stage;
  lang: "ja" | "en";
  scene: number;
  className?: string;
  /** 枠の縦横比（広い画面） */
  aspect?: string;
  /** 枠の縦横比（狭い画面）。省略時は aspect */
  narrowAspect?: string;
  /** 狭い画面で寄せた範囲に切り替えるか（既定 true） */
  narrow?: boolean;
  priority?: boolean;
  alt?: string;
  /** scene: 広い画面は場面の範囲のまま / callouts: 広い画面でも吹き出しのまわりに寄せる（幅は画像いっぱい） */
  fit?: "scene" | "callouts";
}) {
  const s0 = stage.scenes[scene];
  // callouts: 広い画面も寄せた範囲（幅いっぱい・高さは枠の縦横比）にした Stage で描く
  const base: Stage =
    fit === "callouts" && s0
      ? { ...stage, scenes: stage.scenes.map((x, i) => (i === scene ? { ...x, rect: stillRect(x, 100) } : x)) }
      : stage;
  if (fit === "callouts") stage = base;
  const s = stage.scenes[scene];
  const nr = s ? (fit === "callouts" ? s.rect : stillRect(s)) : undefined;
  const hasNarrow = narrow && !!s && !!nr && (!sameRect(nr, s.rect) || (narrowAspect !== undefined && narrowAspect !== aspect));
  // 寄せた範囲の場面に差し替えた Stage（場面の数と順は同じ。代わりの画面かどうかは番号で引ける）
  const narrowStage: Stage | undefined = hasNarrow
    ? { ...stage, scenes: stage.scenes.map((x, i) => (i === scene ? { ...x, rect: nr! } : x)) }
    : undefined;
  return (
    <div
      className={["stage stage-still", className].filter(Boolean).join(" ")}
      data-orient={stage.height > stage.width ? "portrait" : undefined}
      data-has-narrow={hasNarrow ? "" : undefined}
    >
      <div className="stage-frame stage-still-wide">
        <StageView stage={stage} lang={lang} active={scene} aspect={aspect} priority={priority} alt={alt} />
      </div>
      {narrowStage && (
        <div className="stage-frame stage-still-narrow">
          <StageView stage={narrowStage} lang={lang} active={scene} aspect={narrowAspect ?? aspect} alt={alt} />
        </div>
      )}
    </div>
  );
}
