import assert from "node:assert/strict";
import test from "node:test";

test("GDS R2 post lists on EN index without TR sibling", async () => {
  process.env.CONTENT_PUBLIC_BASE_URL = "https://example.test";
  const slug = "gds-en-only-fixture";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.endsWith("/blogs/index.json")) {
      return new Response(
        JSON.stringify({
          posts: [
            {
              slug,
              title: "GDS",
              excerpt: "x",
              description: "x",
              publishedAt: "2026-10-20T12:00:00.000Z",
              readingMinutes: 5,
              keywords: [],
              sections: [],
              source: "growthdaily",
              locales: ["en"],
              contentHtml: "<p>Hello world from growth daily seo article body.</p>",
            },
          ],
        }),
        { status: 200 },
      );
    }
    if (url.endsWith(`/blogs/${slug}.json`)) {
      return new Response(
        JSON.stringify({
          slug,
          title: "GDS",
          excerpt: "x",
          description: "x",
          publishedAt: "2026-10-20T12:00:00.000Z",
          readingMinutes: 5,
          keywords: [],
          sections: [],
          source: "growthdaily",
          locales: ["en"],
          contentHtml: "<p>Hello world from growth daily seo article body.</p>",
        }),
        { status: 200 },
      );
    }
    return new Response(null, { status: 404 });
  };

  try {
    const { shouldListOnBlogIndex, postsForBlogIndex } = await import("./blog-locale-overlay");
    assert.equal(await shouldListOnBlogIndex("en", slug), true);
    assert.equal(await shouldListOnBlogIndex("tr", slug), false);
    const enIndex = await postsForBlogIndex("en");
    assert.ok(enIndex.some((p) => p.slug === slug));
    const trIndex = await postsForBlogIndex("tr");
    assert.equal(
      trIndex.some((p) => p.slug === slug),
      false,
    );
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.CONTENT_PUBLIC_BASE_URL;
  }
});
