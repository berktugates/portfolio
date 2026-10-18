import assert from "node:assert/strict";
import { test } from "node:test";

test("git blog posts win over R2 for the same slug", async () => {
  process.env.CONTENT_PUBLIC_BASE_URL = "https://example.test";
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.endsWith("/blogs/index.json")) {
      return new Response(
        JSON.stringify({
          posts: [
            {
              slug: "observability-for-streaming-llm-responses",
              title: "Stale R2",
              excerpt: "stale",
              description: "stale",
              publishedAt: "2026-10-11",
              readingMinutes: 4,
              keywords: [],
              sections: [],
            },
          ],
        }),
        { status: 200 },
      );
    }
    return new Response(null, { status: 404 });
  };

  try {
    const { getCatalogBlogPost } = await import("./blog-catalog");
    const post = await getCatalogBlogPost("observability-for-streaming-llm-responses");
    assert.ok(post);
    assert.equal(post.publishedAt, "2026-10-18");
    assert.equal(post.readingMinutes, 7);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.CONTENT_PUBLIC_BASE_URL;
  }
});
