import type { Locale } from "../i18n/config";
import blogsDe from "../../content/blogs-de";
import blogsFr from "../../content/blogs-fr";
import blogsIt from "../../content/blogs-it";
import blogsJa from "../../content/blogs-ja";
import blogsTr from "../../content/blogs-tr";
import blogsZh from "../../content/blogs-zh";

const OVERLAY_MAP: Partial<Record<Locale, Record<string, unknown>>> = {
  tr: blogsTr,
  de: blogsDe,
  fr: blogsFr,
  it: blogsIt,
  zh: blogsZh,
  ja: blogsJa,
};

export function hasBlogLocaleOverlay(locale: Locale, slug: string): boolean {
  if (locale === "en") return true;
  const map = OVERLAY_MAP[locale];
  return Boolean(map && Object.prototype.hasOwnProperty.call(map, slug));
}

export function blogHreflangLocalesForSlug(slug: string): Locale[] {
  const locales: Locale[] = ["en"];
  for (const locale of Object.keys(OVERLAY_MAP) as Locale[]) {
    if (hasBlogLocaleOverlay(locale, slug)) locales.push(locale);
  }
  return locales;
}
