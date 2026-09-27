"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  HABERLER_BRAND,
  formatGundemCategory,
  type GundemCategory,
} from "../lib/gundem/editorial";
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
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

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
    <ul className="flex flex-col gap-2">
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
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-sm md:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-2.5 md:flex-none md:justify-start">
            <Link
              href={home}
              onClick={closeMenu}
              aria-label="BBA ana sayfa"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-[11px] font-bold tracking-tight text-white transition-opacity hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-950"
            >
              BBA
            </Link>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-semibold text-zinc-950 dark:text-zinc-50">{HABERLER_BRAND}</span>
              <span className="block text-[11px] text-zinc-500">Türkiye gündemi</span>
            </span>
          </div>

          <nav aria-label="Haber kategorileri" className="hidden min-w-0 md:block">
            <ul className="flex flex-wrap items-center justify-center gap-1">{desktopCategoryLinks}</ul>
          </nav>

          <span className="h-10 w-10 shrink-0 md:hidden" aria-hidden />
        </div>
      </div>

      <div className="md:hidden" data-haberler-mobile-sheet>
        <button
          type="button"
          aria-label="Kategorileri kapat"
          aria-hidden={!menuOpen}
          tabIndex={menuOpen ? 0 : -1}
          onClick={closeMenu}
          className={`fixed inset-0 z-[60] bg-zinc-950/50 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none ${
            menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
        <div
          id="haberler-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Haber kategorileri"
          aria-hidden={!menuOpen}
          className={`fixed inset-x-0 bottom-0 z-[70] flex max-h-[min(88dvh,36rem)] flex-col rounded-t-[1.75rem] border border-zinc-200/80 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/50 ${
            menuOpen ? "translate-y-0" : "pointer-events-none translate-y-full"
          }`}
        >
          <div className="flex shrink-0 justify-center pt-3 pb-2">
            <span className="h-1 w-11 rounded-full bg-zinc-300 dark:bg-zinc-600" aria-hidden />
          </div>
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 pb-3 dark:border-zinc-800">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Kategoriler</p>
              <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">Gündem alanı seçin</p>
            </div>
            <button
              type="button"
              aria-label="Kapat"
              onClick={closeMenu}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <nav
            aria-label="Haber kategorileri"
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          >
            {mobileCategoryLinks}
          </nav>
        </div>
      </div>
    </header>
  );
}
