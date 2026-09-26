import { BLOGS_PER_PAGE, sortedBlogPosts } from "../../data/blogs";
import { LOCALES, type Locale } from "../i18n/config";
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

function postsForLocale(locale: Locale) {
  return sortedBlogPosts.filter((post) => locale === "en" || hasBlogLocaleOverlay(locale, post.slug));
}

export function blogIndexPageCount(locale: Locale) {
  return Math.max(1, Math.ceil(postsForLocale(locale).length / BLOGS_PER_PAGE));
}

export function blogIndexPageSlugs(locale: Locale, page: number) {
  const start = (page - 1) * BLOGS_PER_PAGE;
  return postsForLocale(locale).slice(start, start + BLOGS_PER_PAGE).map((post) => post.slug);
}

/** Locales whose index page lists the same posts, in the same order. */
export function blogIndexHreflangLocales(locale: Locale, page: number): Locale[] {
  const mine = blogIndexPageSlugs(locale, page).join("\n");
  return LOCALES.filter(
    (other) => blogIndexPageCount(other) >= page && blogIndexPageSlugs(other, page).join("\n") === mine,
  );
}
