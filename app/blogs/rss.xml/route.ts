import { getCatalogBlogPosts } from "../../lib/content/blog-catalog";
import { absoluteUrl, SITE_NAME } from "../../lib/seo";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const posts = await getCatalogBlogPosts();
  const items = posts
    .slice(0, 40)
    .map(
      (post) => `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${absoluteUrl(`/blogs/${post.slug}`)}</link>
  <guid isPermaLink="true">${absoluteUrl(`/blogs/${post.slug}`)}</guid>
  <pubDate>${new Date(`${post.publishedAt}T09:00:00Z`).toUTCString()}</pubDate>
  <description>${escapeXml(post.description)}</description>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Blog</title>
    <link>${absoluteUrl("/blogs")}</link>
    <description>Technical blog posts by ${escapeXml(SITE_NAME)}</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
