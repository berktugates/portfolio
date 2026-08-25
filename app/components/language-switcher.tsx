"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  LOCALES,
  PREFERRED_LOCALE_KEY,
  type Locale,
  localeMeta,
  localePath,
} from "../lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        className="text-xs text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
        onClick={() => setOpen((value) => !value)}
      >
        {localeMeta[locale].nativeName}
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 bottom-full z-20 mb-2 min-w-36 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-950"
        >
          {LOCALES.map((item) => (
            <li key={item} role="option" aria-selected={item === locale}>
              <Link
                href={localePath(item)}
                hrefLang={localeMeta[item].hreflang}
                className={`block px-3 py-1.5 text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 ${
                  item === locale
                    ? "font-medium text-zinc-950 dark:text-zinc-50"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
                onClick={() => {
                  try {
                    localStorage.setItem(PREFERRED_LOCALE_KEY, item);
                  } catch {
                    // ignore
                  }
                  setOpen(false);
                }}
              >
                {localeMeta[item].nativeName}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
