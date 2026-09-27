import type { GundemCategory } from "./editorial";

/** Navbar sırası — haberler yüzeyinde yatay menü. */
export const HABERLER_NAV_CATEGORIES: readonly GundemCategory[] = [
  "ekonomi",
  "siyaset",
  "toplum",
  "saglik",
  "spor",
  "kultur",
  "bilim",
  "bilisim",
  "dunya",
] as const;

export function haberlerCategoryPath(category: GundemCategory): string {
  return `/kategori/${category}`;
}
