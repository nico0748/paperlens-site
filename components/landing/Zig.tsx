import Link from "next/link";
import { ArrowRightIcon } from "../icons";

type Props = {
  id: string;
  /** 地の色: 白・淡い藍 */
  tone: "light" | "tint";
  /** 画面写真を置く側。文はその反対側 */
  media: "left" | "right";
  icons: React.ReactNode[];
  /** 使う場面（「輪講で」など）。機能名の前に置く */
  scene?: string;
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
  cta: { href: string; label: string };
  /** 文より写真を小さくしたいとき（MCP の行） */
  className?: string;
  children: React.ReactNode;
};

/**
 * 機能を 1 つずつ紹介する行。文と画面写真を左右に置き、行ごとに左右を入れ替える。
 * 小見出しは「場面｜機能」。文と写真はそれぞれ自分の側から滑り込む（data-reveal="x"、--dx は CSS で側ごとに決める）。
 * JavaScript が動かないとき・動きを減らす設定のときは、最初から見えている。
 */
export function Zig({ id, tone, media, icons, scene, kicker, title, body, bullets, cta, className, children }: Props) {
  const tint = tone === "tint" ? " lp-tint" : "";
  return (
    <section
      id={id}
      className={`lp-section lp-zig theme-light${tint}${className ? ` ${className}` : ""}`}
      data-media={media}
      aria-labelledby={`${id}-title`}
    >
      <div className="container">
        <div className="lp-zig-grid">
          <div className="lp-zig-text" data-reveal="x">
            <p className="lp-kicker lp-kicker-icon">
              <span className="lp-kicker-tiles" aria-hidden="true">
                {icons.map((icon, i) => (
                  <span key={i} className="lp-icon-tile lp-icon-tile-sm">
                    {icon}
                  </span>
                ))}
              </span>
              {scene && (
                <>
                  <span className="lp-kicker-scene">{scene}</span>
                  <span className="lp-kicker-sep" aria-hidden="true" />
                </>
              )}
              <span>{kicker}</span>
            </p>
            <h2 id={`${id}-title`} className="lp-h2 lp-zig-title">
              {title}
            </h2>
            <p className="lp-zig-body">{body}</p>
            {bullets.length > 0 && (
              <ul className="lp-points">
                {bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            <div className="lp-zig-cta">
              <Link href={cta.href} className="btn btn-secondary">
                {cta.label}
                <ArrowRightIcon size={18} />
              </Link>
            </div>
          </div>
          <div className="lp-zig-media" data-reveal="x" style={{ "--i": 1 } as React.CSSProperties}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
