"use client";

import { useEffect } from "react";

/**
 * トップページの動き（1 か所で付ける）。
 * - [data-reveal] は画面に入ったら .is-in を付けて浮かび上がらせる。--i で少しずつずらす。
 * - img[data-fade] は読み込みが終わったらふわっと出す。
 * 動きを減らす設定や IntersectionObserver が無いときは何もしない。CSS は html.lp-motion のときだけ隠すので、
 * JavaScript が動かなくても中身は見える。ヒーローはここでは扱わない（LCP を隠さない）。
 */
export function Motion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    root.classList.add("lp-motion");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    const imgs = document.querySelectorAll<HTMLImageElement>("img[data-fade]");
    const done = (img: HTMLImageElement) => img.classList.add("is-loaded");
    imgs.forEach((img) => {
      if (img.complete && img.naturalWidth) done(img);
      else {
        img.addEventListener("load", () => done(img), { once: true });
        img.addEventListener("error", () => done(img), { once: true });
      }
    });

    return () => {
      io.disconnect();
      root.classList.remove("lp-motion");
    };
  }, []);

  return null;
}
