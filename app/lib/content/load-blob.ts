import type { BlogPost } from "../../data/blogs";
import type { GundemBriefing } from "../gundem/types";

const BLOG_PREFIX = "blogs/";
const GUNDEM_PREFIX = "gundem/";

async function fetchJson<T>(url: string, tag: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { tags: [tag] } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function blobBaseUrl(): string | null {
  const base = process.env.BLOB_PUBLIC_BASE_URL?.replace(/\/$/, "");
  return base || null;
}

export async function listBlobBlogPosts(): Promise<readonly BlogPost[]> {
  const base = blobBaseUrl();
  if (!base) return [];
  const index = await fetchJson<{ posts: BlogPost[] }>(`${base}/${BLOG_PREFIX}index.json`, "blogs");
  return index?.posts ?? [];
}

export async function getBlobBlogPost(slug: string): Promise<BlogPost | null> {
  const base = blobBaseUrl();
  if (!base) return null;
  return fetchJson<BlogPost>(`${base}/${BLOG_PREFIX}${slug}.json`, "blogs");
}

export async function listGundemBriefings(): Promise<readonly GundemBriefing[]> {
  const base = blobBaseUrl();
  if (!base) return [];
  const index = await fetchJson<{ posts: GundemBriefing[] }>(
    `${base}/${GUNDEM_PREFIX}index.json`,
    "gundem",
  );
  return index?.posts ?? [];
}

export async function getGundemBriefing(slug: string): Promise<GundemBriefing | null> {
  const base = blobBaseUrl();
  if (!base) return null;
  return fetchJson<GundemBriefing>(`${base}/${GUNDEM_PREFIX}${slug}.json`, "gundem");
}
