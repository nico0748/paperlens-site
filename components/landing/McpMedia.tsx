import { TRANSLATION_SHOT, hasShot } from "../features/data";
import { CheckIcon } from "../icons";
import { Crop, shot } from "./Crop";

/**
 * 頼みごとの結果として見せる画面の切り抜き（chat の i 番目 = CROPS[i]）。
 * 0 全文の対訳（対訳タブの 1 文: 原文と訳）/ 1 数式 / 2 用語 / 3 スライドと論文の線
 */
const CROPS = [
  hasShot(TRANSLATION_SHOT) ? { ...shot(TRANSLATION_SHOT), rect: { x: 50.3, y: 49, w: 48.6, h: 26 } } : undefined,
  { ...shot("equation"), rect: { x: 36.5, y: 33.5, w: 61.5, h: 20 } },
  { ...shot("glossary"), rect: { x: 36, y: 71.2, w: 62, h: 16.2 } },
  { ...shot("slides-linked"), rect: { x: 5, y: 41, w: 82, h: 23 } },
];

type Props = {
  label: string;
  chat: { ask: string; result: string; alt: string }[];
};

/**
 * MCP の行の画面。Claude への頼みごと（右の吹き出し）と、その結果がアプリに入った画面の切り抜きを 4 組。
 * Claude の画面は描かない（他社の画面やロゴを真似しない）。ツール名は詳細ページに任せる。
 */
export function McpMedia({ label, chat }: Props) {
  return (
    <ol className="lp-chat" aria-label={label}>
      {chat.map((c, i) => (
        <li key={c.ask} className="lp-chat-item" data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
          <p className="lp-chat-ask">{c.ask}</p>
          <div className="lp-chat-result">
            <p className="lp-chat-done">
              <CheckIcon size={16} />
              {c.result}
            </p>
            {CROPS[i] && <Crop {...CROPS[i]} sizes="(max-width: 1100px) 160vw, 1100px" alt={c.alt} />}
          </div>
        </li>
      ))}
    </ol>
  );
}
