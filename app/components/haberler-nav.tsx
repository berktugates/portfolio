import Link from "next/link";
import {
  HABERLER_BRAND,
  formatGundemCategory,
  type GundemCategory,
} from "../lib/gundem/editorial";
import { HABERLER_NAV_CATEGORIES, haberlerCategoryPath } from "../lib/gundem/nav-categories";
import { haberlerUrl } from "../lib/gundem/hosts";

type HaberlerNavProps = {
  activeCategory?: GundemCategory | null;
};

export function HaberlerNav({ activeCategory = null }: HaberlerNavProps) {
  const home = haberlerUrl("/");
  const allActive = activeCategory == null;

  return (
    <header
      data-haberler-nav
      className="sticky top-0 z-50 border-b border-zinc-200/90 bg-white/95 backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-950/95"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href={home} className="flex shrink-0 items-center gap-2.5" aria-label={`${HABERLER_BRAND} ana sayfa`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-950 text-[11px] font-bold tracking-tight text-white dark:bg-zinc-100 dark:text-zinc-950">
            BBA
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold text-zinc-950 dark:text-zinc-50">{HABERLER_BRAND}</span>
            <span className="block text-[11px] text-zinc-500">Türkiye gündemi</span>
          </span>
        </Link>
        <nav
          aria-label="Haber kategorileri"
          className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex w-max items-center gap-1 pb-0.5">
            <li>
              <Link
                href={home}
                data-haberler-nav-link={allActive ? "active" : "all"}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  allActive
                    ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                }`}
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
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                    }`}
                  >
                    {formatGundemCategory(category)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
