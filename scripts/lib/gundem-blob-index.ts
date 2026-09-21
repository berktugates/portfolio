import type { GundemBriefing } from "../../app/lib/gundem/types";
import { HABERLER_ORIGIN } from "../../app/lib/gundem/hosts";

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

/** Blob env yoksa prod sitemap’ten slug listesi (yerel refresh çift kuyruk önlemi). */
export async function fetchPublishedSlugsFromProdSitemap(): Promise<string[]> {
  try {
    const res = await fetch(`${HABERLER_ORIGIN}/sitemap-gundem.xml`, { cache: "no-store" });
    if (!res.ok) return [];
    const xml = await res.text();
    const host = new URL(HABERLER_ORIGIN).host;
    return [...xml.matchAll(new RegExp(`https://${host.replace(/\./g, "\\.")}/([a-z0-9-]+)`, "g"))]
      .map((m) => m[1])
      .filter((slug) => slug && slug !== "gundem");
  } catch {
    return [];
  }
}

export async function resolveGundemPublishedIndex(): Promise<GundemBriefing[]> {
  const fromBlob = await fetchGundemBlobIndex();
  if (fromBlob.length > 0) return fromBlob;
  const slugs = await fetchPublishedSlugsFromProdSitemap();
  return slugs.map((slug) => ({ slug, trendQuery: "", title: "", lang: "tr" } as GundemBriefing));
}

export function indexHasTrendQuery(posts: GundemBriefing[], trendQuery: string): boolean {
  const n = trendQuery.toLocaleLowerCase("tr").trim();
  return posts.some((p) => p.trendQuery?.toLocaleLowerCase("tr").trim() === n);
}

export function indexHasSlug(posts: GundemBriefing[], slug: string): boolean {
  return posts.some((p) => p.slug === slug);
}
