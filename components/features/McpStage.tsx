"use client";

import "./mcp.css";
import { useEffect, useState } from "react";
import type { Stage } from "@/lib/stage-types";
import { featuresEn } from "@/lib/i18n/features-en";
import { featuresJa } from "@/lib/i18n/features-ja";
import { ScreenStage } from "./ScreenStage";

export type McpExchange = { user: string; tool: string; result: string };

/**
 * Claude との会話の例（CSS で描いた会話）と、その結果が入るアプリの画面を上下に並べる。
 * 画面の場面が進むと、会話も同じ番号のやり取りに替わる（場面 i ⇔ やり取り i）。
 * やり取りは全部 DOM にあり、同じ場所に重ねて今の 1 つだけを見せる（高さは最も高いやり取りに合うのでずれない）。
 * JavaScript が動かないときと、動きを減らす設定では、全部を縦に並べて出す。
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
  const lines = chat ?? (lang === "ja" ? featuresJa : featuresEn).mcpChat;
  const [scene, setScene] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setEnhanced(true);
  }, []);
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
      <ScreenStage stage={stage} lang={lang} autoplay={autoplay} onSceneChange={setScene} priority={priority} interval={5200} />
    </div>
  );
}
