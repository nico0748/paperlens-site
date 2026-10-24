"use client";

import { useEffect } from "react";

/**
 * トップページの動き（1 か所で付ける）。
 * - [data-reveal] は画面に入ったら .is-in を付けて浮かび上がらせる。--i で少しずつずらす。
 * - [data-reveal="x"]（機能の行の文と写真）は、もう少し入ってから（20%）自分の側から滑り込ませる。
 * - [data-reveal="draw"]（つながりの線）は、線を引くように伸ばす。
 * 動きを減らす設定や IntersectionObserver が無いときは何もしない。CSS は html.lp-motion のときだけ隠すので、
 * JavaScript が動かなくても中身は見える。ヒーローはここでは扱わない（LCP を隠さない）。
 */
export function Motion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    root.classList.add("lp-motion");

    const show = (io: IntersectionObserver) => (entries: IntersectionObserverEntry[]) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    };
    let up: IntersectionObserver;
    let side: IntersectionObserver;
    up = new IntersectionObserver((entries) => show(up)(entries), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    side = new IntersectionObserver((entries) => show(side)(entries), { rootMargin: "0px 0px -12% 0px", threshold: 0.2 });

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      // 画面より上にあるもの（#download へ直接来たときなど）は、最初から見せる
      if (el.getBoundingClientRect().bottom < 0) el.classList.add("is-in");
      else (el.getAttribute("data-reveal") === "x" ? side : up).observe(el);
    });

    return () => {
      up.disconnect();
      side.disconnect();
      root.classList.remove("lp-motion");
    };
  }, []);

  return null;
}
