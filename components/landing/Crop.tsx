/**
 * 1 枚の画面写真の一部だけを、縦横比を保って見せる（サーバーで描ける・JavaScript 不要）。
 * rect は画像に対する割合（0〜100）。枠の縦横比は rect の実寸から決まるので、読み込み中も高さがずれない（CLS 0）。
 * sizes は「画像全体」が描かれる幅（枠の幅 × 100 / rect.w）で渡す。
 */
export type CropRect = { x: number; y: number; w: number; h: number };

type Props = {
  src: string;
  srcSet?: string;
  sizes?: string;
  width: number;
  height: number;
  rect: CropRect;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function Crop({ src, srcSet, sizes, width, height, rect, alt, priority, className }: Props) {
  const aspect = (rect.w * width) / (rect.h * height);
  return (
    <div className={["lp-crop", className].filter(Boolean).join(" ")} style={{ aspectRatio: aspect.toFixed(4) }}>
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        style={{
          width: `${(10000 / rect.w).toFixed(3)}%`,
          left: `${((-rect.x / rect.w) * 100).toFixed(3)}%`,
          top: `${((-rect.y / rect.h) * 100).toFixed(3)}%`,
        }}
      />
    </div>
  );
}

/** stages の画面写真（2400×1502、-800 版あり） */
export const shot = (name: string) => ({
  src: `/screenshots/stages/${name}.webp`,
  srcSet: `/screenshots/stages/${name}-800.webp 800w, /screenshots/stages/${name}.webp 2400w`,
  width: 2400,
  height: 1502,
});
