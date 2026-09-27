import { getAllGundemBriefings } from "../../lib/gundem/catalog";

export const revalidate = 1800;

export async function GET() {
  const posts = (await getAllGundemBriefings()).filter((post) => post.status !== "RETRACTED").slice(0, 50);
  const links = posts.map((post) => `- [${post.title}](https://haberler.berktugberke.com/${post.slug}): ${post.excerpt}`).join("\n");
  const body = `# Berktuğ Berke Ateş — Gündem

> Türkiye gündemini kanıt kontrollü, çok kaynaklı ve özgün kısa haberlerle aktaran kişisel, reklamsız yayın.

Canonical publication: https://haberler.berktugberke.com/

## Editorial method

- Article bodies from third-party publishers are not scraped or rewritten.
- Articles are synthesized from permitted RSS/Atom metadata, exact official releases, and licensed material.
- Two feeds under one publisher group do not count as independent confirmation.
- Media-only claims remain attributed and uncertain; sensitive stories require human review.
- Published corrections and update history remain visible on the canonical article URL.

## Policies

- [Künye](https://haberler.berktugberke.com/kunye)
- [Editöryal politika](https://haberler.berktugberke.com/editorial-policy)
- [Düzeltme ve cevap](https://haberler.berktugberke.com/duzeltme-talebi)
- [Yazar / editör](https://haberler.berktugberke.com/yazar/berktug-berke-ates)
- [News sitemap](https://haberler.berktugberke.com/sitemap-news.xml)
- [RSS](https://haberler.berktugberke.com/rss.xml)

## Recent articles

${links}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } });
}
