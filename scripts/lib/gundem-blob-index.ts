import type { GundemBriefing } from "../../app/lib/gundem/types";

export async function fetchGundemBlobIndex(): Promise<GundemBriefing[]> {
  const base = process.env.BLOB_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!base) return [];
  try {
    const res = await fetch(`${base}/gundem/index.json`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { posts: GundemBriefing[] };
    return data.posts ?? [];
  } catch {
    return [];
  }
}

export function indexHasTrendQuery(posts: GundemBriefing[], trendQuery: string): boolean {
  const n = trendQuery.toLocaleLowerCase("tr").trim();
  return posts.some((p) => p.trendQuery?.toLocaleLowerCase("tr").trim() === n);
}

export function indexHasSlug(posts: GundemBriefing[], slug: string): boolean {
  return posts.some((p) => p.slug === slug);
}
