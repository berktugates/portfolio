import type { GundemBriefing } from "@berktug/editorial-gates/gundem/types";
import type { BlogPostDraft } from "@berktug/editorial-gates/blog/schema";

export type BlogPostRecord = BlogPostDraft & {
  publishedAt: string;
  dateModified?: string;
  readingMinutes: number;
};

async function getJson<T>(bucket: R2Bucket, key: string): Promise<T | null> {
  const obj = await bucket.get(key);
  if (!obj) return null;
  return (await obj.json()) as T;
}

export async function putJson(bucket: R2Bucket, key: string, value: unknown): Promise<void> {
  await bucket.put(key, JSON.stringify(value), {
    httpMetadata: { contentType: "application/json" },
  });
}

export async function mergeGundemIndex(bucket: R2Bucket, draft: GundemBriefing): Promise<void> {
  const existing = (await getJson<{ posts: GundemBriefing[] }>(bucket, "gundem/index.json")) ?? {
    posts: [],
  };
  const merged = [draft, ...existing.posts.filter((p) => p.slug !== draft.slug)].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  await putJson(bucket, "gundem/index.json", { posts: merged });
}

export async function replaceGundemIndex(bucket: R2Bucket, posts: readonly GundemBriefing[]): Promise<void> {
  const merged = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  await putJson(bucket, "gundem/index.json", { posts: merged });
}

export async function mergeBlogIndex(bucket: R2Bucket, post: BlogPostRecord): Promise<void> {
  const existing = (await getJson<{ posts: BlogPostRecord[] }>(bucket, "blogs/index.json")) ?? {
    posts: [],
  };
  const merged = [post, ...existing.posts.filter((p) => p.slug !== post.slug)].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  await putJson(bucket, "blogs/index.json", { posts: merged });
}
