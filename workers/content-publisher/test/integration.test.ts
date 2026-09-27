import assert from "node:assert/strict";
import test from "node:test";
import { parseTrendsRss } from "@berktug/editorial-gates/gundem/trends";
import { composeBriefingFromTrend } from "@berktug/editorial-gates/gundem/compose";
import { validateBlogPostDraft } from "@berktug/editorial-gates/blog/schema";

test("W1-like: empty trends RSS yields no items", () => {
  const items = parseTrendsRss("<rss></rss>");
  assert.equal(items.length, 0);
});

test("W2-like: compose from minimal trend item can be null without headlines copy", () => {
  const draft = composeBriefingFromTrend(
    { query: "xyz-unknown-topic-12345", approxTraffic: 100, pubDate: "", headlines: [] },
    "2026-09-27",
  );
  assert.equal(draft, null);
});

test("U8: blog schema rejects thin LLM-shaped payload", () => {
  assert.equal(
    validateBlogPostDraft({
      slug: "ok-slug",
      title: "Short",
      excerpt: "x".repeat(40),
      description: "x".repeat(40),
      keywords: ["a", "b", "c"],
      sections: [{ heading: "H", paragraphs: ["short"] }],
    }),
    false,
  );
});
