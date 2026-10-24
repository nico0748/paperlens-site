"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { FeatureSlug } from "@/lib/site";
import { ArrowRightIcon, BotIcon, ChevronDownIcon, FilesIcon, ListChecksIcon, PanelRightIcon, PresentationIcon } from "./icons";

const ICONS: Record<FeatureSlug, typeof FilesIcon> = {
  "slides-link": PresentationIcon,
  supplement: PanelRightIcon,
  "wordbook-graph": ListChecksIcon,
  mcp: BotIcon,
  "library-search": FilesIcon,
};

type Props = {
  /** 「機能」のリンク先（トップページの #features）。JavaScript が無くても辿れる */
  href: string;
  label: string;
  toggleLabel: string;
  index: { href: string; label: string };
  items: { slug: FeatureSlug; href: string; label: string; sub: string }[];
};

/**
 * ヘッダーの「機能」。文字はトップページの #features へのリンク、横の山形のボタンで詳細ページの一覧を開く。
 * - 広い画面: ポインターを載せると開き、離すと閉じる。ボタンを押しても開け閉めできる。Escape で閉じてボタンへ戻る。
 * - 狭い画面（メニューの中）: 一覧をその場に常に出す（CSS）。ボタンは隠す。
 * 今いるページの項目には aria-current="page" を付ける。
 */
export function FeaturesMenu({ href, label, toggleLabel, index, items }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const hoverable = (e: React.PointerEvent) => e.pointerType === "mouse" && matchMedia("(min-width: 1121px)").matches;

  return (
    <div
      ref={rootRef}
      className="nav-features"
      data-open={open}
      onPointerEnter={(e) => {
        if (!hoverable(e)) return;
        window.clearTimeout(timer.current);
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (!hoverable(e)) return;
        timer.current = window.setTimeout(() => setOpen(false), 160);
      }}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <div className="nav-features-trigger">
        <Link href={href}>{label}</Link>
        <button
          ref={buttonRef}
          type="button"
          className="nav-features-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={toggleLabel}
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronDownIcon size={16} />
        </button>
      </div>
      <div id={panelId} className="nav-features-panel">
        <ul role="list">
          {items.map((it) => {
            const Icon = ICONS[it.slug];
            const current = pathname === it.href;
            return (
              <li key={it.slug}>
                <Link href={it.href} className="nav-feature" aria-current={current ? "page" : undefined}>
                  <span className="nav-feature-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <span className="nav-feature-text">
                    <span className="nav-feature-label">{it.label}</span>
                    <span className="nav-feature-sub">{it.sub}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href={index.href} className="nav-features-index" aria-current={pathname === index.href ? "page" : undefined}>
          {index.label}
          <ArrowRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
