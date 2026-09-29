"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { bbaWordmarkFont } from "../lib/bba-wordmark-font";
import { formatGundemCategory, type GundemCategory } from "../lib/gundem/editorial";
import { HABERLER_NAV_CATEGORIES, haberlerCategoryPath } from "../lib/gundem/nav-categories";
import { haberlerUrl } from "../lib/gundem/hosts";
import { HABERLER_CONTAINER_CLASS } from "../lib/gundem/haberler-container";

type HaberlerNavProps = {
  activeCategory?: GundemCategory | null;
};

function desktopPillClass(active: boolean): string {
  return `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
    active
      ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
  }`;
}

function mobileSheetRowClass(active: boolean): string {
  return `flex w-full items-center rounded-2xl px-4 py-3.5 text-[15px] font-medium transition-colors active:scale-[0.99] ${
    active
      ? "bg-zinc-950 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-950"
      : "bg-zinc-50 text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-800"
  }`;
}

function HaberlerMobileCategorySheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      data-haberler-mobile-sheet
      data-state={open ? "open" : "closed"}
      aria-hidden={!open}
      className={`fixed inset-0 z-[80] flex items-end justify-center md:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        role="presentation"
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 z-0 bg-zinc-950/50 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        id="haberler-mobile-menu"
        role="dialog"
        aria-modal={open}
        aria-label="Haber kategorileri"
        className={`relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-t-[1.75rem] border border-b-0 border-zinc-200/80 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/50 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "min(88dvh, 36rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 justify-center pt-3 pb-2">
          <span className="h-1 w-11 rounded-full bg-zinc-300 dark:bg-zinc-600" aria-hidden />
        </div>
        <div className="relative z-20 flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 pb-3 dark:border-zinc-800">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Kategoriler</p>
            <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">Gündem alanı seçin</p>
          </div>
          <button
            type="button"
            aria-label="Kapat"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="relative z-20 flex h-10 w-10 touch-manipulation items-center justify-center rounded-full bg-zinc-100 text-zinc-700 active:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:active:bg-zinc-700"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <nav
          aria-label="Haber kategorileri"
          data-haberler-mobile-sheet-scroll
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch]"
        >
          {children}
        </nav>
      </div>
    </div>,
    document.body,
  );
}

export function HaberlerNav({ activeCategory = null }: HaberlerNavProps) {
  const home = haberlerUrl("/");
  const allActive = activeCategory == null;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  const desktopCategoryLinks = (
    <>
      <li>
        <Link
          href={home}
          data-haberler-nav-link={allActive ? "active" : "all"}
          className={desktopPillClass(allActive)}
        >
          Tümü
        </Link>
      </li>
      {HABERLER_NAV_CATEGORIES.map((category) => {
        const active = activeCategory === category;
        return (
          <li key={category}>
            <Link
              href={haberlerUrl(haberlerCategoryPath(category))}
              data-haberler-nav-link={active ? "active" : category}
              className={desktopPillClass(active)}
            >
              {formatGundemCategory(category)}
            </Link>
          </li>
        );
      })}
    </>
  );

  const mobileCategoryLinks = (
    <ul className="flex flex-col gap-2 pb-2">
      <li>
        <Link
          href={home}
          data-haberler-nav-link={allActive ? "active" : "all"}
          className={mobileSheetRowClass(allActive)}
          onClick={closeMenu}
        >
          Tümü
        </Link>
      </li>
      {HABERLER_NAV_CATEGORIES.map((category) => {
        const active = activeCategory === category;
        return (
          <li key={category}>
            <Link
              href={haberlerUrl(haberlerCategoryPath(category))}
              data-haberler-nav-link={active ? "active" : category}
              className={mobileSheetRowClass(active)}
              onClick={closeMenu}
            >
              {formatGundemCategory(category)}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <header
      data-haberler-nav
      className="sticky top-0 z-50 border-b border-zinc-200/90 bg-white/95 backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-950/95"
    >
      <div className={`${HABERLER_CONTAINER_CLASS} py-3`}>
        <div className="flex items-center gap-3 md:justify-center md:gap-5">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="haberler-mobile-menu"
            aria-label={menuOpen ? "Kategorileri kapat" : "Kategorileri aç"}
            onClick={toggleMenu}
            className="relative z-[51] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-sm md:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center md:flex-none md:justify-start">
            <Link
              href={home}
              onClick={closeMenu}
              aria-label="BBA ana sayfa"
              className={`${bbaWordmarkFont.className} shrink-0 text-[2rem] leading-none tracking-tight text-zinc-950 transition-opacity hover:opacity-80 dark:text-zinc-50`}
            >
              BBA
            </Link>
          </div>

          <nav aria-label="Haber kategorileri" className="hidden min-w-0 md:block">
            <ul className="flex flex-wrap items-center justify-center gap-1">{desktopCategoryLinks}</ul>
          </nav>

          <span className="h-10 w-10 shrink-0 md:hidden" aria-hidden />
        </div>
      </div>

      <HaberlerMobileCategorySheet open={menuOpen} onClose={closeMenu}>
        {mobileCategoryLinks}
      </HaberlerMobileCategorySheet>
    </header>
  );
}
