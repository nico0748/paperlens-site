"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { FeatureSignature } from "@/lib/i18n/features-ja";
import type { Stage } from "@/lib/stage-types";
import { StageStill } from "./StageStill";

/**
 * 補足情報のページの図: アプリと同じ並びのタブ（対訳・訳・用語・数式）を切り替えると、そのタブの説明と実際の画面が出る。
 * 画面写真が無いタブ（訳）は、説明の文だけにする（違う画面で代用しない・空の枠も置かない）。
 * ← → Home End でタブを移る（WAI-ARIA のタブの作法）。
 */
export function PanelTabs({
  t,
  lang,
  shots,
  initial = 0,
}: {
  t: FeatureSignature;
  lang: "ja" | "en";
  /** タブ i の画面（無ければ undefined） */
  shots: (Stage | undefined)[];
  initial?: number;
}) {
  const [cur, setCur] = useState(initial);
  const uid = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const n = t.items.length;
  const go = (i: number) => {
    const j = ((i % n) + n) % n;
    setCur(j);
    listRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[j]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: cur + 1, ArrowLeft: cur - 1, Home: 0, End: n - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    go(keys[e.key]);
  };
  return (
    <div className="fp-ptabs" data-fp-reveal>
      <div className="fp-ptabs-list" role="tablist" aria-label={t.title} ref={listRef} onKeyDown={onKey}>
        {t.items.map((it, i) => (
          <button
            key={it.label}
            type="button"
            role="tab"
            id={`${uid}-t${i}`}
            aria-controls={`${uid}-p${i}`}
            aria-selected={i === cur}
            tabIndex={i === cur ? 0 : -1}
            className="fp-ptab"
            onClick={() => setCur(i)}
          >
            {it.label}
          </button>
        ))}
      </div>
      {t.items.map((it, i) => {
        const shot = shots[i];
        return (
          <div
            key={it.label}
            role="tabpanel"
            id={`${uid}-p${i}`}
            aria-labelledby={`${uid}-t${i}`}
            hidden={i !== cur}
            className="fp-ptab-panel"
            data-noshot={shot ? undefined : ""}
            tabIndex={0}
          >
            <p className="fp-ptab-body">{it.body}</p>
            {shot && <StageStill stage={shot} lang={lang} scene={0} aspect="16/9" narrow={false} alt={it.body} />}
          </div>
        );
      })}
    </div>
  );
}
