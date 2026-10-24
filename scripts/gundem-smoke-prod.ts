/**
 * Prod haberler yüzeyi smoke (Faz 4 DoD) — secrets gerekmez.
 */
import { resolve } from "node:path";
import { HABERLER_ORIGIN } from "../app/lib/gundem/hosts";
import { loadOpsEnv } from "./lib/load-ops-env";

loadOpsEnv(resolve(import.meta.dirname, ".."));
import { probeGundemSitemapIndex } from "./lib/gundem-sitemap-probe";

async function check(url: string, contains?: string[]): Promise<void> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`${url} → HTTP ${res.status}`);
  }
  if (contains?.length) {
    const body = await res.text();
    for (const needle of contains) {
      if (!body.includes(needle)) {
        throw new Error(`${url} missing expected fragment: ${needle}`);
      }
    }
  }
}

async function main() {
  await check(`${HABERLER_ORIGIN}/`, ["Haberler", "gram altın"]);
  await check(`${HABERLER_ORIGIN}/turkiye-gram-altin-brifing`, [
    "NewsArticle",
    "https://berktugberke.com",
    "Kaynaklar",
  ]);
  await check(`${HABERLER_ORIGIN}/turkiye-ucak-bileti-brifing`, ["NewsArticle"]);
  await check(`${HABERLER_ORIGIN}/gundem/rss.xml`, ["<rss", "<channel>"]);

  const sitemapIndex = await probeGundemSitemapIndex();
  if (!sitemapIndex.ok) {
    throw new Error(`Gundem sitemap index failed: ${sitemapIndex.detail}`);
  }
  console.log(`OK gundem-sitemap-index: ${sitemapIndex.detail}`);

  const redirectRes = await fetch("https://berktugberke.com/gundem", {
    redirect: "manual",
    cache: "no-store",
  });
  if (![301, 308].includes(redirectRes.status)) {
    throw new Error(`/gundem redirect expected 301/308, got ${redirectRes.status}`);
  }
  const loc = redirectRes.headers.get("location") ?? "";
  if (!loc.startsWith(HABERLER_ORIGIN)) {
    throw new Error(`/gundem location must target haberler host, got ${loc}`);
  }

  const indexBase = process.env.CONTENT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!indexBase) {
    console.log("OK gundem-r2-images: skipped (CONTENT_PUBLIC_BASE_URL unset)");
  }
  if (indexBase) {
    const indexRes = await fetch(`${indexBase}/gundem/index.json`, { cache: "no-store" });
    if (!indexRes.ok) throw new Error(`R2 gundem index HTTP ${indexRes.status}`);
    const index = (await indexRes.json()) as { posts: { slug: string; image?: { src?: string } }[] };
    for (const post of index.posts ?? []) {
      const src = post.image?.src;
      if (!src) continue;
      if (/hurriyet|milliyet|haberturk|cnn/i.test(src)) {
        throw new Error(`P5: forbidden host in image for ${post.slug}: ${src}`);
      }
      const imgRes = await fetch(src, { method: "HEAD", cache: "no-store" });
      if (!imgRes.ok) throw new Error(`P1: image HTTP ${imgRes.status} for ${post.slug}`);
    }
  }

  console.log(`Gundem prod smoke OK (${sitemapIndex.detail}).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
