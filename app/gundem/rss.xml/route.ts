import { getAllGundemBriefings } from "../../lib/gundem/catalog";
import { GUNDEM_RSS_DESCRIPTION } from "../../lib/gundem/editorial";
import { haberlerArticlePath, haberlerUrl } from "../../lib/gundem/hosts";
import { getDictionary } from "../../lib/i18n";

export const revalidate = 1800;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const [posts, dict] = await Promise.all([getAllGundemBriefings(), getDictionary("tr")]);
  const items = posts
    .map(
      (post) => `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${haberlerUrl(haberlerArticlePath(post.slug))}</link>
  <guid isPermaLink="true">${haberlerUrl(haberlerArticlePath(post.slug))}</guid>
  <pubDate>${new Date(/^\d{4}-\d{2}-\d{2}$/.test(post.publishedAt) ? `${post.publishedAt}T00:00:00Z` : post.publishedAt).toUTCString()}</pubDate>
  <description>${escapeXml(post.excerpt)}</description>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(dict.headerName)} — Gündem</title>
    <link>${haberlerUrl("/")}</link>
    <description>${escapeXml(GUNDEM_RSS_DESCRIPTION)}</description>
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
