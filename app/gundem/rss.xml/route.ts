import { getAllGundemBriefings } from "../../lib/gundem/catalog";
import { haberlerArticlePath, haberlerUrl } from "../../lib/gundem/hosts";
import { SITE_NAME } from "../../lib/seo";

export const revalidate = 1800;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = await getAllGundemBriefings();
  const items = posts
    .map(
      (post) => `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${haberlerUrl(haberlerArticlePath(post.slug))}</link>
  <guid isPermaLink="true">${haberlerUrl(haberlerArticlePath(post.slug))}</guid>
  <pubDate>${new Date(`${post.publishedAt}T09:00:00Z`).toUTCString()}</pubDate>
  <description>${escapeXml(post.excerpt)}</description>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Gündem</title>
    <link>${haberlerUrl("/")}</link>
    <description>Türkiye teknoloji brifingleri</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
}
