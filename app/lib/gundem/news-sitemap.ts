import { getAllGundemBriefings } from "./catalog";
import { haberlerArticlePath, haberlerUrl } from "./hosts";
import { NEWS_PUBLICATION_NAME } from "./publication";

function xml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function renderNewsSitemap(now = new Date()): Promise<string> {
  const posts = await getAllGundemBriefings();
  const cutoff = now.getTime() - 48 * 60 * 60 * 1000;
  const recent = posts.filter((post) => {
    const timestamp = Date.parse(post.publishedAt);
    return Number.isFinite(timestamp) && timestamp >= cutoff && post.status !== "RETRACTED";
  }).slice(0, 1000);
  const urls = recent.map((post) => `<url>
  <loc>${xml(haberlerUrl(haberlerArticlePath(post.slug)))}</loc>
  <news:news>
    <news:publication><news:name>${xml(NEWS_PUBLICATION_NAME)}</news:name><news:language>tr</news:language></news:publication>
    <news:publication_date>${xml(post.publishedAt)}</news:publication_date>
    <news:title>${xml(post.title)}</news:title>
  </news:news>
</url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join("\n")}
</urlset>`;
}

export function xmlResponse(body: string): Response {
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } });
}
