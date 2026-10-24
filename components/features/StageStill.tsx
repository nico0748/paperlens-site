import "./stage.css";
import type { Stage } from "@/lib/stage-types";
import { StageView } from "./StageView";

/** 動かない 1 場面だけの画面写真（手順の横・狭い画面で使う）。サーバーでも描ける */
export function StageStill({ stage, lang, scene, className }: { stage: Stage; lang: "ja" | "en"; scene: number; className?: string }) {
  return (
    <div className={["stage stage-still", className].filter(Boolean).join(" ")} data-orient={stage.height > stage.width ? "portrait" : undefined}>
      <div className="stage-frame">
        <StageView stage={stage} lang={lang} active={scene} />
      </div>
    </div>
  );
}
