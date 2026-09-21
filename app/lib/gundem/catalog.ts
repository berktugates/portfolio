import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { GundemBriefing } from "./types";
import { getGundemBriefing, listGundemBriefings } from "../content/load-blob";

let seedCache: GundemBriefing[] | null = null;

async function loadSeedBriefings(): Promise<readonly GundemBriefing[]> {
  if (seedCache) return seedCache;
  try {
    const file = resolve(process.cwd(), "content/gundem-seed.json");
    const raw = await readFile(file, "utf8");
    const parsed = JSON.parse(raw) as { posts: GundemBriefing[] };
    seedCache = parsed.posts ?? [];
    return seedCache;
  } catch {
    return [];
  }
}

export async function getAllGundemBriefings(): Promise<readonly GundemBriefing[]> {
  const blob = await listGundemBriefings();
  const seed = await loadSeedBriefings();
  const bySlug = new Map<string, GundemBriefing>();
  for (const item of seed) bySlug.set(item.slug, item);
  for (const item of blob) bySlug.set(item.slug, item);
  return [...bySlug.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getGundemBySlug(slug: string): Promise<GundemBriefing | undefined> {
  const blob = await getGundemBriefing(slug);
  if (blob) return blob;
  const all = await loadSeedBriefings();
  return all.find((item) => item.slug === slug);
}

export async function getGundemSlugs(): Promise<string[]> {
  const posts = await getAllGundemBriefings();
  return posts.map((post) => post.slug);
}
