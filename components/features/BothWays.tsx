import type { FeatureSignature } from "@/lib/i18n/features-ja";
import { cropStage } from "./data";
import { StageStill } from "./StageStill";

/**
 * スライドと論文のページの図: 「スライド → 論文」と「論文 → スライド」。
 * 同じ画面写真から、スライドのグループと、論文側の色の印のあたりを切り抜いて左右に並べ、間を両向きの矢印でつなぐ。
 */
export function BothWays({ t, lang }: { t: FeatureSignature; lang: "ja" | "en" }) {
  const [a, b] = t.items;
  const slide = cropStage("slides-link", { shot: "slides-linked", rect: { x: 5.6, y: 42, w: 17, h: 38 } }, { ja: a.label, en: a.label });
  const paper = cropStage("slides-link", { shot: "slides-linked", rect: { x: 69.5, y: 35.5, w: 19, h: 38 } }, { ja: b.label, en: b.label });
  return (
    <div className="fp-both">
      <figure className="fp-both-fig" data-fp-reveal>
        <StageStill stage={slide} lang={lang} scene={0} aspect="4/5" narrow={false} alt={a.body} />
        <figcaption>
          <strong>{a.label}</strong>
          {a.body}
        </figcaption>
      </figure>
      <div className="fp-both-arrows" aria-hidden="true">
        <svg viewBox="0 0 64 56" width="64" height="56" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18h50M46 8l10 10-10 10" />
          <path d="M58 38H8M18 28 8 38l10 10" />
        </svg>
      </div>
      <figure className="fp-both-fig" data-fp-reveal style={{ "--i": 1 } as React.CSSProperties}>
        <StageStill stage={paper} lang={lang} scene={0} aspect="4/5" narrow={false} alt={b.body} />
        <figcaption>
          <strong>{b.label}</strong>
          {b.body}
        </figcaption>
      </figure>
    </div>
  );
}
