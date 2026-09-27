import type { GundemBriefing } from "../../app/lib/gundem/types";
import type { BlogPost } from "../../app/data/blogs";
import { haberlerArticlePath, HABERLER_ORIGIN } from "../../app/lib/gundem/hosts";
import { contentPublicBaseUrl } from "./content-public-base";
import { createR2Client, putR2Json } from "./r2-s3-client";

function bucketName(): string {
  const b = process.env.R2_BUCKET_NAME ?? "portfolio-content";
  return b;
}

async function fetchJsonIndex<T>(path: string): Promise<T | null> {
  const base = contentPublicBaseUrl();
  if (!base) return null;
  try {
    const res = await fetch(`${base}/${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function revalidatePaths(paths: string[], tags: string[]): Promise<void> {
  const revalidateUrl = process.env.REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!revalidateUrl || !secret) return;
  const res = await fetch(revalidateUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paths, tags }),
  });
  console.log(`Revalidate status: ${res.status}`);
}

export async function putGundemBriefingR2(draft: GundemBriefing): Promise<void> {
  const client = createR2Client();
  const bucket = bucketName();
  await putR2Json(client, bucket, `gundem/${draft.slug}.json`, draft);
}

export async function replaceGundemIndexR2(posts: readonly GundemBriefing[]): Promise<void> {
  const client = createR2Client();
  const bucket = bucketName();
  const merged = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  await putR2Json(client, bucket, "gundem/index.json", { posts: merged });
}

export async function mergeGundemIndexEntryR2(draft: GundemBriefing): Promise<void> {
  const existing = (await fetchJsonIndex<{ posts: GundemBriefing[] }>("gundem/index.json")) ?? {
    posts: [],
  };
  const merged = [draft, ...existing.posts.filter((p) => p.slug !== draft.slug)].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const client = createR2Client();
  await putR2Json(client, bucketName(), "gundem/index.json", { posts: merged });
}

export async function seedGundemBriefingsToR2(posts: readonly GundemBriefing[]): Promise<void> {
  for (const draft of posts) {
    await putGundemBriefingR2(draft);
    console.log(`Seeded gundem briefing ${draft.slug} to R2.`);
  }
  await replaceGundemIndexR2(posts);
  const slugs = posts.map((p) => p.slug);
  await revalidatePaths(
    ["/gundem", "/sitemap-gundem.xml", "/gundem/rss.xml", ...slugs.map((s) => `/gundem/${s}`)],
    ["gundem"],
  );
  console.log(`R2 index replaced with ${posts.length} gundem post(s).`);
}

export async function publishGundemBriefingToR2(draft: GundemBriefing): Promise<void> {
  await putGundemBriefingR2(draft);
  await mergeGundemIndexEntryR2(draft);
  await revalidatePaths(
    ["/gundem", "/sitemap-gundem.xml", "/gundem/rss.xml", `/gundem/${draft.slug}`],
    ["gundem"],
  );
  console.log(`Published gundem briefing ${draft.slug} to R2.`);
}

export async function putBlogPostR2(post: BlogPost): Promise<void> {
  const client = createR2Client();
  await putR2Json(client, bucketName(), `blogs/${post.slug}.json`, post);
}

export async function mergeBlogIndexEntryR2(post: BlogPost): Promise<void> {
  const existing = (await fetchJsonIndex<{ posts: BlogPost[] }>("blogs/index.json")) ?? { posts: [] };
  const merged = [post, ...existing.posts.filter((p) => p.slug !== post.slug)].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const client = createR2Client();
  await putR2Json(client, bucketName(), "blogs/index.json", { posts: merged });
}

export async function publishBlogPostToR2(post: BlogPost): Promise<void> {
  await putBlogPostR2(post);
  await mergeBlogIndexEntryR2(post);
  await revalidatePaths(
    ["/blogs", "/tr/blogs", `/blogs/${post.slug}`, `/tr/blogs/${post.slug}`, "/blogs/rss.xml", "/tr/blogs/rss.xml"],
    ["blogs"],
  );
  console.log(`Published blog ${post.slug} to R2.`);
}

export async function submitIndexNow(urls: string[]): Promise<void> {
  if (!process.env.INDEXNOW_KEY || urls.length === 0) return;
  const host = process.env.HABERLER_HOST ?? new URL(HABERLER_ORIGIN).host;
  const body = {
    host,
    key: process.env.INDEXNOW_KEY,
    urlList: urls,
  };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow status: ${res.status}`);
}
