/**
 * Prod haberler yüzeyi smoke (Faz 4 DoD) — secrets gerekmez.
 */
import { HABERLER_ORIGIN } from "../app/lib/gundem/hosts";

const MIN_SITEMAP_ARTICLES = 3;

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
  await check(`${HABERLER_ORIGIN}/`, ["Gündem", "Türkiye"]);
  await check(`${HABERLER_ORIGIN}/turkiye-yazilim-ekipleri-icin-bulut-maliyetleri`, [
    "NewsArticle",
    "Stok görsel",
  ]);
  await check(`${HABERLER_ORIGIN}/turkiye-ucak-bileti-brifing`, ["NewsArticle"]);
  await check(`${HABERLER_ORIGIN}/gundem/rss.xml`, ["<rss", "<channel>"]);

  const sitemapRes = await fetch(`${HABERLER_ORIGIN}/sitemap-gundem.xml`, { cache: "no-store" });
  if (!sitemapRes.ok) throw new Error(`sitemap HTTP ${sitemapRes.status}`);
  const sitemap = await sitemapRes.text();
  const host = new URL(HABERLER_ORIGIN).host;
  const articleUrls = [
    ...sitemap.matchAll(new RegExp(`https://${host.replace(/\./g, "\\.")}/[a-z0-9-]+`, "g")),
  ].filter((m) => !m[0].endsWith("/"));
  if (articleUrls.length < MIN_SITEMAP_ARTICLES) {
    throw new Error(`Expected ≥${MIN_SITEMAP_ARTICLES} article URLs in sitemap, got ${articleUrls.length}`);
  }

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

  console.log(`Gundem prod smoke OK (${articleUrls.length} sitemap articles).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
