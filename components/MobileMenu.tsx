"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";

/**
 * 狭い画面でだけ、ナビゲーションを「メニュー」ボタンの中にしまう。
 * 広い画面では CSS でいつも開いた形に見せるので、中身はサーバー側で描いたものをそのまま入れる。
 * 閉じるとき: ページを移った・ページ内リンクを押した・外を押した・Escape（ボタンへフォーカスを戻す）。
 */
export function MobileMenu({ label, closeLabel, children }: { label: string; closeLabel: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // ページを移ったら閉じる
  useEffect(() => setOpen(false), [pathname]);

  // ページ内リンク（#features など）で移ったときも閉じる
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span>{open ? closeLabel : label}</span>
      </button>
      <div
        id={panelId}
        ref={panelRef}
        className="header-menu"
        data-open={open}
        onClick={(e) => {
          // メニューの中のリンクを押したら閉じる（言語の一覧を開くボタンなどは閉じない）
          if ((e.target as Element).closest("a")) setOpen(false);
        }}
      >
        {children}
      </div>
    </>
  );
}
