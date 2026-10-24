/**
 * 実画像のアニメーション（ScreenStage / ScrollStage）が使うデータの型。
 * 座標はすべて元画像に対する割合（0〜100）。
 */
export type L10n = { ja: string; en: string };

export type Callout = {
  /** box: 四角で囲む / dot: 点で示す / underline: 下線 / label: 吹き出し */
  kind: "box" | "dot" | "underline" | "label";
  x: number;
  y: number;
  w?: number;
  h?: number;
  text?: L10n;
};

export type Scene = {
  /** 拡大して見せる範囲。全体を見せるときは { x: 0, y: 0, w: 100, h: 100 } */
  rect: { x: number; y: number; w: number; h: number };
  callouts: Callout[];
  caption: L10n;
  /** 別の画像に切り替えるとき（省略時は Stage.src） */
  src?: string;
  /**
   * 狭い画面（1000px 以下）の静止画で使う範囲（任意）。無ければ吹き出しを囲む範囲から決める
   * （components/features/stage-geometry.ts の stillRect）。
   */
  mobileRect?: { x: number; y: number; w: number; h: number };
};

export type Stage = {
  id: string;
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: L10n;
  scenes: Scene[];
};
