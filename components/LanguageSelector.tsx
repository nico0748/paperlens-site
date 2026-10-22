"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { locales, localeNames, switchLocalePath, type Locale } from "@/lib/i18n/config";
import { CheckIcon, ChevronDownIcon, GlobeIcon } from "./icons";

/**
 * 言語の切り替え（DADS の言語セレクター）。
 * ボタンは地球のアイコンと「Language」で、どの言語の人にも見つけやすくする。
 * 一覧の言語名はその言語自身の表記にし、lang と hreflang を付ける。
 */
export function LanguageSelector({ lang, label, listLabel }: { lang: Locale; label: string; listLabel: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      className="lang-selector"
      ref={rootRef}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="lang-button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <GlobeIcon />
        <span>{label}</span>
        <ChevronDownIcon size={16} className="lang-chevron" />
      </button>
      <ul id={listId} className="lang-menu" aria-label={listLabel} hidden={!open}>
        {locales.map((l) => (
          <li key={l}>
            <a
              href={switchLocalePath(pathname, l)}
              lang={l}
              hrefLang={l}
              aria-current={l === lang ? "true" : undefined}
              className="lang-option"
            >
              <span className="lang-check">{l === lang && <CheckIcon size={18} />}</span>
              {localeNames[l]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
