import type { Locale } from "../i18n/config";
import { getDictionary } from "../i18n";
import { absoluteUrl } from "../seo";
import { blogPostPath, blogsIndexPath } from "./paths";
import { getLocaleContent, getLocalizedBlogPosts } from "./get-content";

function rssPubDate(value: string) {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  return new Date(dateOnly ? `${value}T00:00:00Z` : value).toUTCString();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function blogRssResponse(locale: Locale) {
  const [posts, dict, content] = await Promise.all([
    getLocalizedBlogPosts(locale).then((items) => items.slice(0, 40)),
    getDictionary(locale),
    getLocaleContent(locale),
  ]);
  const items = posts
    .map((post) => {
      const link = absoluteUrl(blogPostPath(locale, post.slug));
      return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  <pubDate>${rssPubDate(post.publishedAt)}</pubDate>
  <description>${escapeXml(post.description)}</description>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(dict.headerName)} — Blog</title>
    <link>${absoluteUrl(blogsIndexPath(locale))}</link>
    <description>${escapeXml(content.ui.blogsMetaDescription)}</description>
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
