import type { Stage } from "@/lib/stage-types";
import type { FeatureSlug } from "@/lib/site";
import { stages } from "@/lib/scenes";

/** 機能ごとの ScreenStage のデータ（lib/scenes.ts）。場面 i は詳細ページの手順 i に当たる */
export function stageFor(slug: FeatureSlug): Stage {
  return stages[slug];
}
