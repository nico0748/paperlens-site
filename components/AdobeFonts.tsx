"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Typekit = { load: (config: { kitId: string; async: boolean }) => void };
declare global {
  interface Window {
    Typekit?: Typekit;
  }
}

/**
 * Adobe Fonts のキットを読む（筑紫明朝）。
 * 和文フォントは使う文字だけを配る「ダイナミックサブセット」なので、CSS ではなく JavaScript の埋め込みが要る。
 * ページを移ると本文の文字が変わるので、そのたびに読み直して足りない文字を取り寄せる。
 */
export function AdobeFonts({ kitId }: { kitId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    window.Typekit?.load({ kitId, async: true });
  }, [kitId, pathname]);

  return (
    <Script
      src={`https://use.typekit.net/${kitId}.js`}
      strategy="afterInteractive"
      onReady={() => window.Typekit?.load({ kitId, async: true })}
    />
  );
}
