import assert from "node:assert/strict";
import test from "node:test";
import { blogPosts } from "../../data/blogs";
import { LOCALES, type Locale } from "../i18n/config";
import { getLocalizedBlogPost } from "./get-content";
import { hasBlogLocaleOverlay, blogHreflangLocalesForSlugGit } from "./blog-locale-overlay";

/** Queue posts published with full multi-locale depth (EN_EXTRA + LOCALE_EXTRA). */
function strictParagraphParity(slug: string): boolean {
  return slug === "reducing-flaky-e2e-tests-in-expo-apps";
}

test("every published blog has seven hreflang locales with matching section structure", async () => {
  for (const en of blogPosts) {
    assert.equal(
      blogHreflangLocalesForSlugGit(en.slug).length,
      7,
      `${en.slug}: expected 7 locales in hreflang`,
    );
    for (const locale of LOCALES) {
      if (locale !== "en") {
        assert.equal(
          hasBlogLocaleOverlay(locale, en.slug),
          true,
          `${en.slug}: missing overlay for ${locale}`,
        );
      }
      const post = await getLocalizedBlogPost(locale, en.slug);
      assert.ok(post, `${en.slug}: no localized post for ${locale}`);
      if (strictParagraphParity(en.slug)) {
        assert.equal(
          post.sections.length,
          en.sections.length,
          `${en.slug}/${locale}: section count`,
        );
        for (let i = 0; i < en.sections.length; i++) {
          const locSec = post.sections[i]!;
          const enSec = en.sections[i]!;
          assert.equal(!!locSec.points, !!enSec.points, `${en.slug}/${locale} sec ${i} points`);
          assert.equal(!!locSec.links, !!enSec.links, `${en.slug}/${locale} sec ${i} links`);
          assert.equal(
            locSec.paragraphs.length,
            enSec.paragraphs.length,
            `${en.slug}/${locale} sec ${i} paragraph count`,
          );
          for (const p of locSec.paragraphs) {
            assert.equal(typeof p, "string");
            assert.ok(p.trim().length > 10, `${en.slug}/${locale} sec ${i}: empty paragraph`);
          }
        }
      }
      if (locale !== "en") {
        assert.notEqual(post.title, en.title, `${en.slug}/${locale}: title mirrors EN`);
      }
    }
  }
});

test("reducing-flaky post is long-form versus legacy short queue baseline", async () => {
  const slug = "reducing-flaky-e2e-tests-in-expo-apps";
  const en = blogPosts.find((p) => p.slug === slug);
  assert.ok(en);
  const words = en.sections
    .flatMap((s) => [s.heading, ...s.paragraphs, ...(s.points ?? [])])
    .join(" ")
    .split(/\s+/).length;
  assert.ok(words >= 350, `expected ≥350 EN words, got ${words}`);
  assert.equal(en.sections.length, 5);
  for (const locale of LOCALES as readonly Locale[]) {
    const post = await getLocalizedBlogPost(locale, slug);
    assert.ok(post);
    assert.equal(post.sections.length, 5);
    assert.ok(post.readingMinutes >= 4 && post.readingMinutes <= 15);
  }
});
