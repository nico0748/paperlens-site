"use client";

import { useEffect, useRef, useState } from "react";
import { ExpandIcon } from "../icons";

export type Screen = {
  id: string;
  label: string;
  sub: string;
  caption: string;
  alt: string;
  src: string;
  small: string;
  width: number;
  height: number;
};

/**
 * 画面写真の切り替え（WAI-ARIA のタブ）。
 * - JavaScript が動く前（サーバーの HTML）は、全部のパネルを縦に並べて見せる。動いたら data-enhanced を付けてタブにする。
 * - 左右の矢印・Home・End でタブを移る（選ぶと同時に表示する）。
 * - #screens-equation のようなアドレスで開くと、そのタブを選ぶ。
 */
export function ScreenTabs({ screens, label, enlarge }: { screens: Screen[]; label: string; enlarge: string }) {
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setEnhanced(true);
    const fromHash = () => {
      const i = screens.findIndex((s) => `#screens-${s.id}` === window.location.hash);
      if (i >= 0) setActive(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [screens]);

  function select(i: number, focus = false) {
    const n = (i + screens.length) % screens.length;
    setActive(n);
    if (focus) tabRefs.current[n]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const keys: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: screens.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    select(keys[e.key], true);
  }

  return (
    <div className="lp-tabs" data-enhanced={enhanced || undefined} data-reveal="scale">
      {enhanced && (
        <div className="lp-tablist" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
          {screens.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={i === active}
              aria-controls={`screens-${s.id}`}
              tabIndex={i === active ? 0 : -1}
              className="lp-tab"
              onClick={() => select(i)}
            >
              <span className="lp-tab-label">{s.label}</span>
              <span className="lp-tab-sub">{s.sub}</span>
            </button>
          ))}
        </div>
      )}
      {screens.map((s, i) => (
        <div
          key={s.id}
          id={`screens-${s.id}`}
          className="lp-panel"
          role={enhanced ? "tabpanel" : undefined}
          aria-labelledby={enhanced ? `tab-${s.id}` : undefined}
          tabIndex={enhanced ? 0 : undefined}
          hidden={enhanced && i !== active}
        >
          <div className="lp-panel-text">
            <p className="lp-panel-count">
              {String(i + 1).padStart(2, "0")} / {String(screens.length).padStart(2, "0")}
            </p>
            {/* タブが画面の名前を示すので、見出しは JavaScript が動く前（タブが無いとき）だけ出す */}
            {!enhanced && <h3 className="lp-h3">{s.label}</h3>}
            <p className="lp-panel-caption">{s.caption}</p>
            <a href={s.src} className="lp-more" target="_blank" rel="noopener">
              <ExpandIcon size={18} />
              {enlarge}
            </a>
          </div>
          <figure className="lp-panel-shot">
            <img
              src={s.small}
              srcSet={`${s.small} 800w, ${s.src} ${s.width}w`}
              sizes="(max-width: 1000px) calc(100vw - 32px), 860px"
              alt={s.alt}
              width={s.width}
              height={s.height}
              loading="lazy"
              decoding="async"
              data-fade
            />
          </figure>
        </div>
      ))}
    </div>
  );
}
