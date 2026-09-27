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

function navLinkClass(active: boolean): string {
  return `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
    active
      ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
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

  const brand = (
    <Link
      href={home}
      onClick={() => setMenuOpen(false)}
      className="flex shrink-0 items-center gap-2.5"
      aria-label={`${HABERLER_BRAND} ana sayfa`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-[11px] font-bold tracking-tight text-white dark:bg-zinc-100 dark:text-zinc-950">
        BBA
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-zinc-950 dark:text-zinc-50">{HABERLER_BRAND}</span>
        <span className="block text-[11px] text-zinc-500">Türkiye gündemi</span>
      </span>
    </Link>
  );

  const categoryLinks = (
    <>
      <li>
        <Link
          href={home}
          data-haberler-nav-link={allActive ? "active" : "all"}
          className={navLinkClass(allActive)}
          onClick={() => setMenuOpen(false)}
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
              className={navLinkClass(active)}
              onClick={() => setMenuOpen(false)}
            >
              {formatGundemCategory(category)}
            </Link>
          </li>
        );
      })}
    </>
  );

  return (
    <header
      data-haberler-nav
      className="sticky top-0 z-50 border-b border-zinc-200/90 bg-white/95 backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-950/95"
    >
      <div className={`${HABERLER_CONTAINER_CLASS} py-3`}>
        <div className="hidden md:flex md:flex-wrap md:items-center md:justify-center md:gap-x-5 md:gap-y-2">
          {brand}
          <nav aria-label="Haber kategorileri">
            <ul className="flex flex-wrap items-center justify-center gap-1">{categoryLinks}</ul>
          </nav>
        </div>

        <div className="flex items-center justify-between gap-3 md:hidden">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="haberler-mobile-menu"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
          <div className="flex min-w-0 flex-1 justify-center">{brand}</div>
          <span className="h-10 w-10 shrink-0" aria-hidden />
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-[2px] md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div
            id="haberler-mobile-menu"
            className="fixed inset-x-0 top-[calc(3.75rem+1px)] z-50 mx-auto max-h-[min(70vh,28rem)] w-full max-w-6xl overflow-y-auto px-4 pb-6 md:hidden"
          >
            <nav
              aria-label="Haber kategorileri"
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40"
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Kategoriler</p>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">{categoryLinks}</ul>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
