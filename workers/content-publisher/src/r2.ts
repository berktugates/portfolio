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

export async function sha256Hex(value: unknown): Promise<string> {
  const input = typeof value === "string" ? value : JSON.stringify(value);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function putJson(bucket: R2Bucket, key: string, value: unknown): Promise<void> {
  await bucket.put(key, JSON.stringify(value), {
    httpMetadata: { contentType: "application/json" },
  });
}

export async function putImmutableJson(bucket: R2Bucket, key: string, value: unknown): Promise<void> {
  const existing = await bucket.head(key);
  if (existing) throw new Error(`immutable-object-exists:${key}`);
  await putJson(bucket, key, value);
}

export async function archiveGundemRevision(
  bucket: R2Bucket,
  briefing: GundemBriefing,
  revisionId: string,
): Promise<{ objectKey: string; contentHash: string }> {
  const storyId = briefing.storyId ?? briefing.slug;
  const contentHash = await sha256Hex(briefing);
  const objectKey = `archive/${storyId}/${revisionId}.json`;
  if (!(await bucket.head(objectKey))) {
    await putImmutableJson(bucket, objectKey, {
      ...briefing,
      archive: { storyId, revisionId, contentHash, retainedUntil: new Date(Date.now() + 2 * 365 * 86400_000).toISOString() },
    });
  }
  await putJson(bucket, `public/${storyId}/current.json`, { storyId, revisionId, objectKey, contentHash });
  return { objectKey, contentHash };
}

export async function putReviewDraft(bucket: R2Bucket, briefing: GundemBriefing): Promise<void> {
  await putJson(bucket, `review/${briefing.storyId ?? briefing.slug}.json`, briefing);
}

export async function getReviewDraft(bucket: R2Bucket, storyId: string): Promise<GundemBriefing | null> {
  return getJson<GundemBriefing>(bucket, `review/${storyId}.json`);
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
