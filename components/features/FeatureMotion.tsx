"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 機能のページの動き。トップページ（components/landing/Motion.tsx）と同じ考え方で、
 * [data-fp-reveal] が画面に入ったら .is-in を付けて浮かび上がらせる（"left" / "right" は横から）。
 * CSS は html.fp-motion のときだけ隠すので、JavaScript が動かなくても、動きを減らす設定でも中身は見える。
 */
export function FeatureMotion() {
  // レイアウトに置くので、ページを移るたびに見直す
  const pathname = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const els = document.querySelectorAll<HTMLElement>("[data-fp-reveal]");
    // 最初から見えているものは隠さない（ちらつかせない）
    const vh = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("is-in");
    });
    root.classList.add("fp-motion");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    els.forEach((el) => !el.classList.contains("is-in") && io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove("fp-motion");
    };
  }, [pathname]);
  return null;
}
