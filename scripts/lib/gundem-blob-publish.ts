import { resolve } from "node:path";
import { put } from "@vercel/blob";
import { haberlerArticlePath, HABERLER_ORIGIN } from "../../app/lib/gundem/hosts";
import type { GundemBriefing } from "../../app/lib/gundem/types";

function requireBlobToken(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required for gundem Blob publish.");
  }
}

export async function putGundemBriefingJson(draft: GundemBriefing): Promise<void> {
  requireBlobToken();
  await put(`gundem/${draft.slug}.json`, JSON.stringify(draft), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function mergeGundemIndexEntry(draft: GundemBriefing): Promise<void> {
  const indexUrl = process.env.BLOB_PUBLIC_BASE_URL
    ? `${process.env.BLOB_PUBLIC_BASE_URL.replace(/\/$/, "")}/gundem/index.json`
    : null;
  let index: { posts: GundemBriefing[] } = { posts: [] };
  if (indexUrl) {
    try {
      const res = await fetch(indexUrl, { cache: "no-store" });
      if (res.ok) index = (await res.json()) as { posts: GundemBriefing[] };
    } catch {
      /* start fresh */
    }
  }
  const merged = [draft, ...index.posts.filter((item) => item.slug !== draft.slug)].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  await put("gundem/index.json", JSON.stringify({ posts: merged }), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function replaceGundemBlobIndex(posts: readonly GundemBriefing[]): Promise<void> {
  requireBlobToken();
  const merged = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  await put("gundem/index.json", JSON.stringify({ posts: merged }), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function revalidateGundemPaths(slugs: string[]): Promise<void> {
  const revalidateUrl = process.env.REVALIDATE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!revalidateUrl || !secret) return;
  const paths = ["/gundem", "/sitemap-gundem.xml", "/gundem/rss.xml", ...slugs.map((slug) => `/gundem/${slug}`)];
  const res = await fetch(revalidateUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paths, tags: ["gundem"] }),
  });
  console.log(`Revalidate status: ${res.status}`);
}

async function submitGundemIndexNow(rootDir: string, slugs: string[]): Promise<void> {
  if (!process.env.INDEXNOW_KEY) return;
  const indexHost = process.env.HABERLER_HOST ?? new URL(HABERLER_ORIGIN).host;
  const { execFileSync } = await import("node:child_process");
  const urls = [`https://${indexHost}/`, ...slugs.map((slug) => `https://${indexHost}${haberlerArticlePath(slug)}`)];
  execFileSync("node", [resolve(rootDir, "scripts/indexnow-submit.mjs"), ...urls], {
    stdio: "inherit",
    cwd: rootDir,
  });
}

/** Seed: tüm indeks seed dosyasıyla değişir (eski slug’lar düşer). */
export async function seedGundemBriefingsToBlob(
  posts: readonly GundemBriefing[],
  rootDir: string,
): Promise<void> {
  for (const draft of posts) {
    await putGundemBriefingJson(draft);
    console.log(`Seeded gundem briefing ${draft.slug} to Blob.`);
  }
  await replaceGundemBlobIndex(posts);
  const slugs = posts.map((p) => p.slug);
  await revalidateGundemPaths(slugs);
  await submitGundemIndexNow(rootDir, slugs);
  console.log(`Blob index replaced with ${posts.length} seed post(s).`);
}

export async function publishGundemBriefingToBlob(
  draft: GundemBriefing,
  rootDir: string,
): Promise<void> {
  await putGundemBriefingJson(draft);
  await mergeGundemIndexEntry(draft);
  await revalidateGundemPaths([draft.slug]);
  await submitGundemIndexNow(rootDir, [draft.slug]);
  console.log(`Published gundem briefing ${draft.slug} to Blob.`);
}
