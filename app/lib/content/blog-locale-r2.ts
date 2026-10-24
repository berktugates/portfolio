import type { BlogPost } from "../../data/blogs";
import { LOCALES, type Locale } from "../i18n/config";
import { getBlobBlogLocalePost, getBlobBlogPost } from "./load-blob";

function localeFromTag(tag: string): Locale | null {
  return (LOCALES as readonly string[]).includes(tag) ? (tag as Locale) : null;
}

export async function r2BlogHasLocale(slug: string, locale: Locale): Promise<boolean> {
  if (locale === "en") {
    const post = await getBlobBlogPost(slug);
    return Boolean(post?.contentHtml || post?.locales?.includes("en"));
  }
  const post = await getBlobBlogLocalePost(slug, locale);
  return post !== null;
}

export async function loadR2BlogLocalePost(slug: string, locale: Locale): Promise<BlogPost | null> {
  if (locale === "en") return getBlobBlogPost(slug);
  return getBlobBlogLocalePost(slug, locale);
}

export async function r2HreflangLocalesForSlug(slug: string): Promise<Locale[]> {
  const en = await getBlobBlogPost(slug);
  if (!en?.contentHtml && !en?.locales?.length) return [];

  const out = new Set<Locale>(["en"]);
  for (const tag of en?.locales ?? []) {
    const loc = localeFromTag(tag);
    if (loc) out.add(loc);
  }
  await Promise.all(
    LOCALES.filter((locale) => locale !== "en").map(async (locale) => {
      const post = await getBlobBlogLocalePost(slug, locale);
      if (post) out.add(locale);
    }),
  );
  return [...out];
}
