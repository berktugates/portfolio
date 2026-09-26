import assert from "node:assert/strict";
import test from "node:test";
import { blogPosts } from "../../data/blogs";
import { blogIndexHreflangLocales, blogIndexPageSlugs, hasBlogLocaleOverlay } from "./blog-locale-overlay";

test("a locale index page links only locales with the same posts", () => {
  const slugs = blogIndexPageSlugs("tr", 1);
  assert.deepEqual(blogIndexPageSlugs("en", 1), slugs);
  assert.equal(blogIndexHreflangLocales("tr", 1).includes("en"), true);
  assert.equal(
    blogPosts.every((post) => hasBlogLocaleOverlay("tr", post.slug)),
    true,
  );
});
