"use client";

import { useState } from "react";
import type { Stage } from "@/lib/stage-types";
import { ScreenStage } from "@/components/features/ScreenStage";

type Props = {
  stage: Stage;
  lang: "ja" | "en";
  label: string;
  chat: { ask: string; tool: string }[];
};

/**
 * MCP の行の画面。上に実際の画面（Claude が書き込んだ結果）、下に Claude への頼み方の例を 3 つ。
 * 画面の場面が替わると、対応する頼み方の例に印が付く。印は飾りで、読み上げには影響しない。
 * lib/scenes.ts の mcp の場面は「登録 → 全文の対訳 → 式の解説 → メモ → 画面で確かめる」。例はその 2〜4 番目に当たる。
 * Claude の画面は描かない（他社の画面やロゴを真似しない）。
 */
export function McpMedia({ stage, lang, label, chat }: Props) {
  const [active, setActive] = useState(-1);
  return (
    <div className="lp-mcp">
      <ScreenStage stage={stage} lang={lang} onSceneChange={(i) => setActive(i - 1)} />
      <ol className="lp-chat" aria-label={label}>
        {chat.map((c, i) => (
          <li key={c.tool} className="lp-chat-item" data-on={i === active ? "" : undefined}>
            <p className="lp-chat-ask">{c.ask}</p>
            <p className="lp-chat-tool">
              <span aria-hidden="true">→ </span>
              <code>{c.tool}</code>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
