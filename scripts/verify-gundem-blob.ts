/**
 * Faz 4 DoD: prod Blob index, seed brifingleriyle hizalı (ulusal gündem — docs/gundem-editorial.md).
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
  const base = process.env.BLOB_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!base) {
    console.error("BLOB_PUBLIC_BASE_URL is required.");
    process.exit(1);
  }

  const root = resolve(import.meta.dirname, "..");
  const seedRaw = await readFile(resolve(root, "content/gundem-seed.json"), "utf8");
  const expectedSlugs = ((JSON.parse(seedRaw) as { posts: { slug: string }[] }).posts ?? []).map(
    (p) => p.slug,
  );
  if (!expectedSlugs.length) {
    console.error("gundem-seed.json has no posts to verify.");
    process.exit(1);
  }

  const indexUrl = `${base}/gundem/index.json`;
  const res = await fetch(indexUrl, { cache: "no-store" });
  if (!res.ok) {
    console.error(`Blob index fetch failed: ${res.status} ${indexUrl}`);
    process.exit(1);
  }
  const data = (await res.json()) as { posts: { slug: string }[] };
  const indexSlugs = new Set(data.posts?.map((p) => p.slug) ?? []);
  const missing = expectedSlugs.filter((slug) => !indexSlugs.has(slug));
  if (missing.length > 0) {
    console.error(
      `Blob index missing seed slugs: ${missing.join(", ")}; index has: ${[...indexSlugs].join(", ") || "none"}`,
    );
    process.exit(1);
  }
  console.log(`Blob index OK (${expectedSlugs.length} seed slugs): ${expectedSlugs.join(", ")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
