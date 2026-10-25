"use client";

import "./mcp.css";
import { useEffect, useMemo, useState } from "react";
import type { Stage } from "@/lib/stage-types";
import { featuresEn } from "@/lib/i18n/features-en";
import { featuresJa } from "@/lib/i18n/features-ja";
import { ScreenStage } from "./ScreenStage";
import { isPlaceholder } from "./StageView";

/** prompt: ツールの前に使うプロンプト（全文の対訳の translate_paper など）。あれば「→ プロンプト → ツール」と並べる */
export type McpExchange = { user: string; tool: string; result: string; prompt?: string };

/** 会話のあと、画面が動き出すまで（ms）。利用者の発言 → 0ms、ツール名 → 400ms、画面 → 700ms、結果 → 画面が止まるころ */
const LEAD = 700;

/**
 * Claude との会話の例（CSS で描いた会話）と、その結果が入るアプリの画面を上下に並べる。
 * - やり取り k ⇔ k 番目の場面（0 全文の対訳 / 1 数式 / 2 用語 / 3 スライドと論文の線）。代わりの画面の場面（stageMeta.placeholders）があれば外す。
 * - 場面が替わると、まず会話が替わり（発言 → ツール名）、少し遅れて画面が動き、結果の吹き出しは画面が止まるころに出る。
 * - やり取りは全部 DOM にあり、同じ場所に重ねて今の 1 つだけを見せる（高さは最も高いやり取りに合うのでずれない）。
 * - 動きを減らす設定でも 1 つずつ見せる（自動では進まず、場面の点で切り替える）。
 * - JavaScript が動かないときは、全部を縦に並べて出す。
 */
export function McpStage({
  stage,
  lang,
  chat,
  autoplay = true,
  priority = false,
}: {
  stage: Stage;
  lang: "ja" | "en";
  chat?: McpExchange[];
  autoplay?: boolean;
  priority?: boolean;
}) {
  const t = (lang === "ja" ? featuresJa : featuresEn).ui;
  const all = chat ?? (lang === "ja" ? featuresJa : featuresEn).mcpChat;
  // 本物の画面の場面だけ（場面のオブジェクトはそのまま。代わりの画面かどうかは元の番号で引ける）
  const real = useMemo<Stage>(() => {
    const scenes = stage.scenes.filter((_, i) => !isPlaceholder(stage, i));
    const m = Math.min(scenes.length, all.length);
    return { ...stage, scenes: scenes.slice(0, m) };
  }, [stage, all.length]);
  const lines = all.slice(0, real.scenes.length);
  const [scene, setScene] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => setEnhanced(true), []);
  const upto = lines.length ? Math.min(scene, lines.length - 1) : -1;

  return (
    <div className="mcp-stage" data-enhanced={enhanced ? "" : undefined}>
      <div className="mcp-chat" role="group" aria-label={t.chatLabel}>
        <ol className="mcp-chat-list">
          {lines.map((l, i) => (
            <li
              key={i}
              className="mcp-turn"
              data-state={!enhanced ? undefined : i === upto ? "current" : "hidden"}
              aria-hidden={enhanced && i !== upto ? true : undefined}
            >
              <p className="mcp-bubble mcp-user">
                <span className="visually-hidden">{t.chatYou}: </span>
                {l.user}
              </p>
              <p className="mcp-tool">
                {l.prompt && (
                  <>
                    <span aria-hidden="true">→ </span>
                    <code>{l.prompt}</code>
                  </>
                )}
                <span aria-hidden="true">→ </span>
                <code>{l.tool}</code>
              </p>
              <p className="mcp-bubble mcp-claude">
                <span className="visually-hidden">{t.chatClaude}: </span>
                {l.result}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <ScreenStage
        stage={real}
        lang={lang}
        autoplay={autoplay}
        onSceneChange={setScene}
        priority={priority}
        interval={7500}
        lead={LEAD}
        showCaption={false}
      />
    </div>
  );
}
