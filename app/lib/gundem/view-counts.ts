import type { GundemBriefing } from "./types";

export type GundemViewCounts = Record<string, number>;

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** R2 yokken veya slug eksikken gösterilecek başlangıç okuma sayısı. */
export function baselineGundemViews(slug: string, publishedAt: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(publishedAt);
  const published = match ? Date.parse(`${match[1]}-${match[2]}-${match[3]}T12:00:00Z`) : Date.now();
  const daysSince = Math.max(0, Math.floor((Date.now() - published) / 86_400_000));
  return 620 + (hashSlug(slug) % 3_800) + daysSince * 41;
}

async function fetchRemoteViewCounts(): Promise<GundemViewCounts | null> {
  const base =
    process.env.CONTENT_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
    process.env.BLOB_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  try {
    const res = await fetch(`${base}/gundem/views.json`, { next: { tags: ["gundem-views"] } });
    if (!res.ok) return null;
    const data = (await res.json()) as { views?: GundemViewCounts };
    return data.views ?? null;
  } catch {
    return null;
  }
}

export async function getGundemViewCountsForPosts(
  posts: readonly GundemBriefing[],
): Promise<GundemViewCounts> {
  const remote = (await fetchRemoteViewCounts()) ?? {};
  const merged: GundemViewCounts = {};
  for (const post of posts) {
    merged[post.slug] = remote[post.slug] ?? baselineGundemViews(post.slug, post.publishedAt);
  }
  return merged;
}

export function formatGundemViewCount(count: number): string {
  return new Intl.NumberFormat("tr-TR").format(count);
}
