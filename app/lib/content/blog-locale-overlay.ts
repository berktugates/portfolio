import { BLOGS_PER_PAGE, blogPosts } from "../../data/blogs";
import { LOCALES, type Locale } from "../i18n/config";
import blogsDe from "../../content/blogs-de";
import blogsFr from "../../content/blogs-fr";
import blogsIt from "../../content/blogs-it";
import blogsJa from "../../content/blogs-ja";
import blogsTr from "../../content/blogs-tr";
import blogsZh from "../../content/blogs-zh";
import { getCatalogBlogPosts } from "./blog-catalog";
import { r2BlogHasLocale, r2HreflangLocalesForSlug } from "./blog-locale-r2";
import { getBlobBlogPost } from "./load-blob";

const OVERLAY_MAP: Partial<Record<Locale, Record<string, unknown>>> = {
  tr: blogsTr,
  de: blogsDe,
  fr: blogsFr,
  it: blogsIt,
  zh: blogsZh,
  ja: blogsJa,
};

/** Git-only overlay check (sync, for parity tests). */
export function hasBlogLocaleOverlay(locale: Locale, slug: string): boolean {
  if (locale === "en") return true;
  const map = OVERLAY_MAP[locale];
  return Boolean(map && Object.prototype.hasOwnProperty.call(map, slug));
}

export function blogHreflangLocalesForSlugGit(slug: string): Locale[] {
  const locales: Locale[] = ["en"];
  for (const locale of Object.keys(OVERLAY_MAP) as Locale[]) {
    if (hasBlogLocaleOverlay(locale, slug)) locales.push(locale);
  }
  return locales;
}

export async function hasBlogLocale(locale: Locale, slug: string): Promise<boolean> {
  if (locale === "en") {
    if (blogPosts.some((post) => post.slug === slug)) return true;
    return r2BlogHasLocale(slug, "en");
  }
  if (hasBlogLocaleOverlay(locale, slug)) return true;
  return r2BlogHasLocale(slug, locale);
}

/** Git queue: EN+TR parity. GDS: always on home + /blogs (any locale, any language depth). */
export async function shouldListOnBlogIndex(locale: Locale, slug: string): Promise<boolean> {
  const r2En = await getBlobBlogPost(slug);
  if (r2En?.source === "growthdaily") {
    return true;
  }

  if (!(await hasBlogLocale(locale, slug))) return false;
  const hreflang = await blogHreflangLocalesForSlug(slug);
  if (!hreflang.includes("en")) return false;

  const isGitCatalog = blogPosts.some((post) => post.slug === slug);
  if (isGitCatalog) {
    return hreflang.includes("tr");
  }

  if (r2En?.source === "queue") {
    if (locale === "en") return true;
    return hreflang.includes(locale);
  }

  return hreflang.includes("tr");
}

export async function blogHreflangLocalesForSlug(slug: string): Promise<Locale[]> {
  const r2 = await r2HreflangLocalesForSlug(slug);
  if (r2.length > 0) {
    const merged = new Set<Locale>(["en", ...r2]);
    for (const locale of Object.keys(OVERLAY_MAP) as Locale[]) {
      if (hasBlogLocaleOverlay(locale, slug)) merged.add(locale);
    }
    return [...merged];
  }
  return blogHreflangLocalesForSlugGit(slug);
}

async function postsForLocale(locale: Locale) {
  const posts = await getCatalogBlogPosts();
  const filtered = [];
  for (const post of posts) {
    if (await shouldListOnBlogIndex(locale, post.slug)) filtered.push(post);
  }
  return filtered;
}

export async function postsForBlogIndex(locale: Locale) {
  return postsForLocale(locale);
}

export async function blogIndexPageCount(locale: Locale) {
  const list = await postsForLocale(locale);
  return Math.max(1, Math.ceil(list.length / BLOGS_PER_PAGE));
}

export async function blogIndexPageSlugs(locale: Locale, page: number) {
  const list = await postsForLocale(locale);
  const start = (page - 1) * BLOGS_PER_PAGE;
  return list.slice(start, start + BLOGS_PER_PAGE).map((post) => post.slug);
}

/** Locales whose index page lists the same posts, in the same order. */
export async function blogIndexHreflangLocales(locale: Locale, page: number): Promise<Locale[]> {
  const mine = (await blogIndexPageSlugs(locale, page)).join("\n");
  const out: Locale[] = [];
  for (const other of LOCALES) {
    if ((await blogIndexPageCount(other)) >= page && (await blogIndexPageSlugs(other, page)).join("\n") === mine) {
      out.push(other);
    }
  }
  return out;
}
