"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";

/**
 * 狭い画面でだけ、ナビゲーションを「メニュー」ボタンの中にしまう。
 * 広い画面では CSS でいつも開いた形に見せるので、中身はサーバー側で描いたものをそのまま入れる。
 */
export function MobileMenu({ label, closeLabel, children }: { label: string; closeLabel: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  // ページを移ったら閉じる
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="menu-button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span>{open ? closeLabel : label}</span>
      </button>
      <div id={panelId} className="header-menu" data-open={open}>
        {children}
      </div>
    </>
  );
}
