import type { BlogPost } from "../../data/blogs";
import type { Locale } from "../i18n/config";
import { getBlobBlogLocalePost, getBlobBlogPost } from "./load-blob";

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
  if (!en?.locales?.length) return en?.contentHtml ? (["en"] as Locale[]) : [];
  return en.locales.filter((l): l is Locale =>
    ["en", "tr", "de", "fr", "it", "zh", "ja"].includes(l),
  ) as Locale[];
}
