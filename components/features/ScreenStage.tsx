"use client";

import "./stage.css";
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";
import type { Stage } from "@/lib/stage-types";
import { stageMeta, type StageKey } from "@/lib/scenes";
import { StageView } from "./StageView";
import { fitRect, frameAspect, isLongJump, largestSrc, panDuration, sceneSrc, unionPct } from "./stage-geometry";

type Lang = "ja" | "en";

export type ScreenStageProps = {
  stage: Stage;
  lang: Lang;
  /** 自動で場面を進める（既定 true）。見えている間・ポインターや操作の焦点が無い間だけ進み、2 周で止まる */
  autoplay?: boolean;
  /** 外から場面を決める（ScrollStage 用）。渡すとタイマーは動かない */
  active?: number;
  /** 点（場面の切り替え）を押したとき。active を渡すときに使う */
  onSelect?: (i: number) => void;
  /** 表示中の場面が替わったとき */
  onSceneChange?: (i: number) => void;
  /**
   * 1 場面の時間（ms）。渡すとすべての場面で同じ時間。
   * 省略時は説明の長さから決める: ja は clamp(5500, 2600 + 75 × 文字数, 8000)、en は 2600 + 40 × 文字数（同じ範囲）。
   * 最初の場面だけ 1 秒長く待つ（ページを開いた直後は見出しを読んでいる）。
   */
  interval?: number;
  /** 何周で止めるか。既定 2（WCAG 2.2.2: 動き続けるものを置かない） */
  loops?: number;
  /** ヒーローなど最初に見える画像（LCP）。画像を先に読む */
  priority?: boolean;
  /** 説明文の行を出すか（既定 true）。ScrollStage では手順の本文が説明を兼ねるので消す */
  showCaption?: boolean;
  /** 「画面を拡大」（枠の右下の小さな札）を出すか（既定 true） */
  enlarge?: boolean;
  /** 最初に見せる場面（既定 0） */
  startScene?: number;
  /** 枠の縦横比（"16/10" など）。省略時は lib/scenes.ts の stageMeta */
  aspect?: string;
  /**
   * 場面が替わってから画面が動き出すまでの時間（ms、既定 0）。onSceneChange は先に呼ぶので、
   * 外の表示（McpStage の会話）を先に出し、そのあとで画面を動かせる。
   */
  lead?: number;
  className?: string;
};

const labels = {
  ja: {
    play: "再生",
    pause: "一時停止",
    held: "一時停止中（再生）",
    replay: "もう一度再生",
    dots: "場面の切り替え",
    scene: "場面 {n} / {total}",
    enlarge: "画面を拡大",
    close: "閉じる",
    captions: "この画面で見られること",
  },
  en: {
    play: "Play",
    pause: "Pause",
    held: "Paused (play)",
    replay: "Play again",
    dots: "Choose a scene",
    scene: "Scene {n} of {total}",
    enlarge: "Enlarge",
    close: "Close",
    captions: "What this screen shows",
  },
} as const;

const fmt = (t: string, n: number, total: number) => t.replace("{n}", String(n)).replace("{total}", String(total));
const clampN = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** 説明を読み終えられる時間（ms） */
function holdFor(text: string | undefined, lang: Lang) {
  const chars = (text ?? "").replace(/\s+/g, lang === "ja" ? "" : " ").length;
  return Math.round(clampN(2600 + (lang === "ja" ? 75 : 40) * chars, 5500, 8000));
}

/**
 * 実際の画面写真を枠に入れ、場面ごとに拡大・移動して見せる。
 * - 動かすのは transform と opacity だけ（コンポジターだけで動き、レイアウトがずれない）。
 * - 説明文は全場面ぶんを同じ場所に重ねて、いちばん長い説明の高さを取っておく（場面が替わっても下がずれない）。
 * - 読み上げ: 自動で進んでいる間は aria-live を off にし、止まっている間（利用者が操作したあと）は polite。
 * - 場面の点は role="tablist"（← → Home End で移る）。再生・一時停止のボタンを常に置く。
 * - 動きを減らす設定では自動で進めず、場面は動かさずに切り替える。
 * - JavaScript が動く前（サーバーの HTML）は最初の場面と、全場面の説明の一覧を出す。
 */
export function ScreenStage({
  stage,
  lang,
  autoplay = true,
  active,
  onSelect,
  onSceneChange,
  interval,
  loops = 2,
  priority = false,
  showCaption = true,
  enlarge = true,
  startScene = 0,
  aspect,
  lead = 0,
  className,
}: ScreenStageProps) {
  const t = labels[lang];
  const n = stage.scenes.length;
  const controlled = active !== undefined;
  const uid = useId();
  const viewId = `${uid}-view`;
  const rootRef = useRef<HTMLElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [idx, setIdx] = useState(() => clampN(startScene, 0, Math.max(n - 1, 0)));
  const cur = clampN(controlled ? active! : idx, 0, Math.max(n - 1, 0));

  const [enhanced, setEnhanced] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [done, setDone] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const advances = useRef(0);

  const canPlay = autoplay && !controlled && n > 1;
  const playing = canPlay && !userPaused && !done;
  const running = playing && enhanced && visible && pageVisible && !hover && !focusIn && !dialogOpen;
  const held = playing && !running && (hover || focusIn);

  // 画面に見せている場面（lead があると cur より遅れて替わる）
  const [lagged, setLagged] = useState(cur);
  useEffect(() => {
    if (!lead || reduced) return setLagged(cur);
    const tm = window.setTimeout(() => setLagged(cur), lead);
    return () => window.clearTimeout(tm);
  }, [cur, lead, reduced]);
  const view = lead && !reduced ? clampN(lagged, 0, Math.max(n - 1, 0)) : cur;

  // ---- 場面の移り方（どこから来たか）。描画のたびに計算し直さないよう ref に持つ ----
  const frame = frameAspect(stage, aspect ?? stageMeta[stage.id as StageKey]?.aspect);
  const move = useRef({ cur: view, from: view });
  if (move.current.cur !== view) move.current = { cur: view, from: move.current.cur };
  const from = move.current.from;
  const scenes = stage.scenes;
  const sameSrc = from !== view && sceneSrc(stage, scenes[from]) === sceneSrc(stage, scenes[view]);
  const ra = fitRect(stage, scenes[from]?.rect ?? { x: 0, y: 0, w: 100, h: 100 }, frame);
  const rb = fitRect(stage, scenes[view]?.rect ?? { x: 0, y: 0, w: 100, h: 100 }, frame);
  const pan = from === view ? 900 : sameSrc ? panDuration(stage, ra, rb) : 500;
  const longJump = sameSrc && !reduced && isLongJump(stage, ra, rb);
  // 遠くへ飛ぶときは、まず両方が入る範囲まで引き（移動時間の 45%）、それから寄る（55%）
  const [viaDone, setViaDone] = useState(-1);
  const via = longJump && viaDone !== view ? unionPct(stage, ra, rb) : undefined;
  const panMs = longJump ? Math.round(pan * (via ? 0.45 : 0.55)) : pan;
  useEffect(() => {
    if (!longJump) return;
    const tm = window.setTimeout(() => setViaDone(view), Math.round(pan * 0.45));
    return () => window.clearTimeout(tm);
  }, [view, longJump, pan]);

  // 動きを減らす設定・タブの表示・画面に入っているか
  useEffect(() => {
    setEnhanced(true);
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const applyMq = () => {
      setReduced(mq.matches);
      if (mq.matches) setUserPaused(true);
    };
    applyMq();
    mq.addEventListener("change", applyMq);
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    let io: IntersectionObserver | undefined;
    if (rootRef.current && "IntersectionObserver" in window) {
      io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && e.intersectionRatio >= 0.5), {
        threshold: [0, 0.5, 1],
      });
      io.observe(rootRef.current);
    } else setVisible(true);
    return () => {
      mq.removeEventListener("change", applyMq);
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  // タイマー。場面が替わるたびに 1 場面ぶん待ち直す
  const hold = (interval ?? holdFor(scenes[cur]?.caption[lang], lang)) + (advances.current === 0 ? 1000 : 0);
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      advances.current += 1;
      setIdx((i) => (i + 1) % n);
      if (advances.current >= loops * n - 1) setDone(true);
    }, hold);
    return () => window.clearTimeout(timer);
  }, [running, idx, hold, loops, n]);

  const lastReported = useRef(-1);
  useEffect(() => {
    if (lastReported.current === cur) return;
    lastReported.current = cur;
    onSceneChange?.(cur);
  }, [cur, onSceneChange]);

  const select = useCallback(
    (i: number, focus = false) => {
      const j = ((i % n) + n) % n;
      if (controlled) onSelect?.(j);
      else setIdx(j);
      if (focus) dotsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[j]?.focus();
    },
    [controlled, n, onSelect],
  );

  const onDotsKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: cur + 1, ArrowDown: cur + 1, ArrowLeft: cur - 1, ArrowUp: cur - 1, Home: 0, End: n - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    select(keys[e.key], true);
  };

  const togglePlay = () => {
    if (done) {
      advances.current = 0;
      setDone(false);
      setUserPaused(false);
      setIdx(0);
    } else if (running) setUserPaused(true);
    else {
      // ポインターや焦点で止まっているときも、押したら進める（押した意図を優先する）
      setUserPaused(false);
      setFocusIn(false);
    }
    setHover(false);
  };

  const openDialog = () => {
    const d = dialogRef.current;
    if (!d || typeof d.showModal !== "function") return false;
    d.showModal();
    setDialogOpen(true);
    return true;
  };

  // 焦点: キーボードで中に入ったときだけ止める（再生ボタンを押した直後は止めない）
  const onFocusCapture = (e: FocusEvent) => {
    const el = e.target as HTMLElement;
    if (el.dataset.stagePlay !== undefined) return setFocusIn(false);
    setFocusIn(el.matches(":focus-visible"));
  };
  const onBlurCapture = (e: FocusEvent) => {
    if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setFocusIn(false);
  };

  const scene = scenes[view];
  const fullSrc = largestSrc(stage, sceneSrc(stage, scene));
  const playLabel = done ? t.replay : running ? t.pause : held ? t.held : t.play;
  const showDots = enhanced && n > 1;

  return (
    <figure
      ref={rootRef}
      className={["stage", className].filter(Boolean).join(" ")}
      data-enhanced={enhanced ? "" : undefined}
      data-reduced={reduced ? "" : undefined}
      data-orient={stage.height > stage.width ? "portrait" : undefined}
      data-scene={cur}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
    >
      <div className="stage-frame">
        <StageView
          stage={stage}
          lang={lang}
          active={view}
          priority={priority}
          id={viewId}
          role={showDots ? "tabpanel" : undefined}
          label={showDots ? fmt(t.scene, cur + 1, n) : undefined}
          aspect={aspect}
          via={via}
          panMs={panMs}
        />
        {enlarge && (
          <a
            className="stage-enlarge"
            href={fullSrc}
            target="_blank"
            rel="noopener"
            aria-label={t.enlarge}
            onClick={(e) => {
              if (openDialog()) e.preventDefault();
            }}
          >
            <ExpandGlyph />
            <span className="stage-enlarge-text" aria-hidden="true">
              {t.enlarge}
            </span>
          </a>
        )}
      </div>

      {(showCaption || showDots) && (
        <figcaption className="stage-bar">
          {showDots && (
            <div className="stage-controls">
              <div className="stage-dots" role="tablist" aria-label={t.dots} ref={dotsRef} onKeyDown={onDotsKey}>
                {scenes.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    className="stage-dot"
                    aria-selected={i === cur}
                    aria-controls={viewId}
                    aria-label={`${fmt(t.scene, i + 1, n)}: ${s.caption[lang]}`}
                    tabIndex={i === cur ? 0 : -1}
                    onClick={() => select(i)}
                  />
                ))}
              </div>
              {canPlay && (
                <button
                  type="button"
                  className="stage-play"
                  data-stage-play=""
                  data-state={held ? "held" : undefined}
                  aria-label={playLabel}
                  title={playLabel}
                  onClick={togglePlay}
                >
                  {done ? <ReplayGlyph /> : running ? <PauseGlyph /> : <PlayGlyph />}
                </button>
              )}
            </div>
          )}
          {showCaption && (
            <>
              <p className="stage-caption stage-capstack" aria-hidden={enhanced ? true : undefined}>
                {enhanced ? (
                  scenes.map((s, i) => (
                    <span key={i} className="stage-capline" data-on={i === view ? "" : undefined}>
                      {s.caption[lang]}
                    </span>
                  ))
                ) : (
                  <span>{scene?.caption[lang]}</span>
                )}
              </p>
              {enhanced && (
                <p className="visually-hidden" aria-live={running ? "off" : "polite"}>
                  {scene?.caption[lang]}
                </p>
              )}
            </>
          )}
        </figcaption>
      )}

      {/* JavaScript が動かないときの説明の一覧（動いたら CSS で隠す） */}
      {n > 1 && (
        <ol className="stage-captions" aria-label={t.captions}>
          {scenes.map((s, i) => (
            <li key={i}>{s.caption[lang]}</li>
          ))}
        </ol>
      )}

      {enlarge && (
        <dialog
          ref={dialogRef}
          className="stage-dialog theme-dark"
          aria-label={stage.alt[lang]}
          onClose={() => setDialogOpen(false)}
          onClick={(e) => {
            if (e.target === e.currentTarget) dialogRef.current?.close();
          }}
        >
          <form method="dialog" className="stage-dialog-bar">
            {showCaption && scene && <p className="stage-dialog-caption">{scene.caption[lang]}</p>}
            <button type="submit" className="stage-dialog-close" autoFocus>
              <CloseGlyph />
              {t.close}
            </button>
          </form>
          {dialogOpen && (
            <img
              src={fullSrc}
              alt={sceneSrc(stage, scene) === stage.src ? stage.alt[lang] : scene?.caption[lang] ?? stage.alt[lang]}
              width={stage.width}
              height={stage.height}
              decoding="async"
            />
          )}
        </dialog>
      )}
    </figure>
  );
}

const glyph = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false } as const;
const PlayGlyph = () => (
  <svg {...glyph}>
    <path d="M7 5v14l11-7z" fill="currentColor" />
  </svg>
);
const PauseGlyph = () => (
  <svg {...glyph}>
    <path d="M8 5v14M16 5v14" strokeWidth={3} />
  </svg>
);
const ReplayGlyph = () => (
  <svg {...glyph}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" />
  </svg>
);
const ExpandGlyph = () => (
  <svg {...glyph} width={16} height={16}>
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
  </svg>
);
const CloseGlyph = () => (
  <svg {...glyph} width={18} height={18}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
