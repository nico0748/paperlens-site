"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Stage } from "@/lib/stage-types";
import { ScreenStage } from "./ScreenStage";
import { StageStill } from "./StageStill";

export type ScrollStep = {
  title: string;
  body: string;
  /** 画面のボタン名・キーなど（チップで出す） */
  ui?: string[];
  /** この手順で見せる場面の番号 */
  scene: number;
  id?: string;
};

/**
 * 手順と画面写真を並べ、スクロールで場面を切り替える（機能のページの「使い方の流れ」）。
 * - 広い画面: 画面写真を横に固定し（sticky）、画面の中央に来た手順の場面を見せる（IntersectionObserver）。
 * - 狭い画面（1000px 以下）: 手順ごとに、その場面の静止画を手順の下に置く（固定しない）。
 *   静止画は吹き出しのまわりに寄せた範囲（StageStill）。前の手順と同じ場面なら出さない。
 * - layout="stills": 広い画面でも固定せず、手順ごとに静止画のカードにする（同じ画像の場面ばかりのページ用）。
 * - layout="text": 画面写真を出さない（手順の本文だけのカード）。
 * - 場面の点を押すと、その場面を使う手順までスクロールする。
 * - start: 手順の番号を何番から数えるか（章に分けたとき、2 つ目の章を続き番号にする）。
 * 動きを減らす設定では、ScreenStage が場面を動かさずに切り替える。
 */
export function ScrollStage({
  stage,
  lang,
  steps,
  stepLabel,
  layout = "sticky",
  stillAspect,
  start = 1,
}: {
  stage: Stage;
  lang: "ja" | "en";
  steps: ScrollStep[];
  stepLabel: string;
  layout?: "sticky" | "stills" | "text";
  /** 狭い画面の静止画の縦横比（省略時は場面の枠と同じ） */
  stillAspect?: string;
  start?: number;
}) {
  const [cur, setCur] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const n = stage.scenes.length;
  const sceneOf = (i: number) => Math.min(Math.max(steps[i]?.scene ?? 0, 0), Math.max(n - 1, 0));

  useEffect(() => {
    if (layout !== "sticky") return;
    const items = listRef.current?.querySelectorAll<HTMLLIElement>("li[data-step]");
    if (!items?.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCur(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    items.forEach((li) => io.observe(li));
    return () => io.disconnect();
  }, [layout]);

  const onSelect = useCallback(
    (scene: number) => {
      const i = steps.findIndex((s, k) => sceneOf(k) === scene);
      if (i < 0) return;
      setCur(i);
      const li = listRef.current?.querySelector<HTMLLIElement>(`li[data-step="${i}"]`);
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      li?.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    },
    [steps, n],
  );

  return (
    <div className="fp-steps-grid" data-layout={layout}>
      {layout === "sticky" && (
        <div className="fp-steps-stage">
          <ScreenStage stage={stage} lang={lang} autoplay={false} active={sceneOf(cur)} onSelect={onSelect} showCaption={false} />
        </div>
      )}
      <ol className="fp-steps-list" ref={listRef}>
        {steps.map((s, i) => (
          <li
            key={i}
            id={s.id}
            data-step={i}
            data-current={layout === "sticky" && i === cur ? "" : undefined}
            className="fp-step"
          >
            <div className="fp-step-text">
              <p className="fp-step-n">
                <span aria-hidden="true">{i + start}</span>
                <span className="visually-hidden">{stepLabel.replace("{n}", String(i + start))}</span>
              </p>
              <h3 className="fp-step-title">{s.title}</h3>
              <p className="fp-step-body">{s.body}</p>
              {s.ui && s.ui.length > 0 && (
                <ul className="fp-ui-chips" role="list">
                  {s.ui.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              )}
            </div>
            {layout !== "text" && (i === 0 || sceneOf(i) !== sceneOf(i - 1)) && (
              <StageStill
                stage={stage}
                lang={lang}
                scene={sceneOf(i)}
                className="fp-step-still"
                aspect={layout === "stills" ? stillAspect : undefined}
                narrowAspect={stillAspect}
                fit={layout === "stills" ? "callouts" : "scene"}
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
