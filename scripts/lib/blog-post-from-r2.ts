import type { BlogPost, BlogSection } from "../../app/data/blogs";
import { contentPublicBaseUrl } from "./content-public-base";

type R2BlogJson = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  publishedAt: string;
  dateModified?: string;
  readingMinutes: number;
  keywords: readonly string[];
  sections?: readonly BlogSection[];
  contentHtml?: string;
  source?: string;
};

export async function fetchBlogPostFromR2(slug: string): Promise<BlogPost | null> {
  const base = contentPublicBaseUrl();
  if (!base) return null;

  const url = `${base}/blogs/${encodeURIComponent(slug)}.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const raw = (await res.json()) as R2BlogJson;
  if (!raw.slug || !raw.title) return null;

  let sections = raw.sections ?? [];
  if (sections.length === 0 && raw.contentHtml) {
    sections = [{ heading: raw.title, paragraphs: [raw.excerpt || raw.description] }];
  }

  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt,
    description: raw.description,
    publishedAt: raw.publishedAt,
    dateModified: raw.dateModified,
    readingMinutes: raw.readingMinutes,
    keywords: raw.keywords ?? [],
    sections,
    contentHtml: raw.contentHtml,
    source: raw.source as BlogPost["source"],
  };
}
