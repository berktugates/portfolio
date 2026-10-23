import assert from "node:assert/strict";
import test from "node:test";
import { countExternalHttpsLinks, runGrowthDailyGates } from "./growthdaily-gates";

// 10 words x 90 = 900 words; MIN_READING_MINUTES * WORDS_PER_MINUTE = 800, so the body clears the
// gate even after the link paragraphs are stripped (premium-band test).
const LONG_HTML = `<h2>Intro</h2><p>${"Backend API reliability matters for staff engineers building production systems. ".repeat(90)}</p>
<p><a href="https://developers.cloudflare.com/workers/">Cloudflare Workers</a></p>
<p><a href="https://nextjs.org/docs">Next.js docs</a></p>
<p><a href="https://owasp.org/www-project-top-ten/">OWASP</a></p>`;

test("growthdaily gates reject review band", () => {
  const result = runGrowthDailyGates({
    title: "API reliability patterns for backend teams",
    excerpt: "How staff engineers design resilient APIs with observability and safe deploys.",
    contentHtml: LONG_HTML,
    qualityBand: "review",
    keywords: ["api", "backend", "reliability"],
    locale: "en",
    slug: "api-reliability-patterns",
    slugTaken: false,
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, "quality-band-review");
});

test("growthdaily gates reject short reading time", () => {
  const result = runGrowthDailyGates({
    title: "React Native architecture for mobile teams",
    excerpt: "Short post should fail the ten minute gate for software engineering readers.",
    contentHtml: "<h2>Hi</h2><p>Too short.</p>",
    qualityBand: "standard",
    keywords: ["react", "mobile"],
    locale: "en",
    slug: "too-short",
    slugTaken: false,
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, "reading-too-short");
});

test("growthdaily gates trust GDS source traceability for premium band", () => {
  const result = runGrowthDailyGates({
    title: "Scalable software architecture for platform teams",
    excerpt: "Engineering trade-offs for horizontal scaling, sharding, and observability in production.",
    contentHtml: LONG_HTML.replace(/<p><a href="https:[^"]+">[^<]+<\/a><\/p>/g, ""),
    qualityBand: "premium",
    keywords: ["architecture", "scaling", "observability"],
    locale: "en",
    slug: "scalable-architecture",
    slugTaken: false,
  });
  assert.equal(result.ok, true);
});

test("countExternalHttpsLinks ignores self domain", () => {
  assert.equal(
    countExternalHttpsLinks(
      '<a href="https://berktugberke.com/x">x</a><a href="https://github.com/a/b">g</a>',
    ),
    1,
  );
});
