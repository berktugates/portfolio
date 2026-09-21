import { test } from "node:test";
import assert from "node:assert/strict";
import { assessContentSafety } from "../../app/lib/content-safety";
import { composeBriefingFromTrend, scoreTrendItem, shouldSkipTrendQuery } from "./gundem-compose";
import { parseApproxTraffic, parseTrendsRss } from "./gundem-trends";

const SAMPLE = `<?xml version="1.0"?>
<rss xmlns:ht="https://trends.google.com/trending/rss" version="2.0">
<channel>
<item>
<title>gram altın ne kadar</title>
<ht:approx_traffic>200+</ht:approx_traffic>
<pubDate>Mon, 21 Sep 2026 13:50:00 -0700</pubDate>
</item>
<item>
<title>sayısal loto</title>
<ht:approx_traffic>1000+</ht:approx_traffic>
</item>
</channel>
</rss>`;

test("parseApproxTraffic", () => {
  assert.equal(parseApproxTraffic("1000+"), 1000);
  assert.equal(parseApproxTraffic("200+"), 200);
});

test("parseTrendsRss extracts queries", () => {
  const items = parseTrendsRss(SAMPLE);
  assert.equal(items.length, 2);
  assert.equal(items[0].query, "gram altın ne kadar");
});

test("skip lottery trends", () => {
  assert.equal(shouldSkipTrendQuery("sayısal loto"), true);
  assert.equal(shouldSkipTrendQuery("gram altın"), false);
});

test("compose briefing passes safety length gate", () => {
  const trend = parseTrendsRss(SAMPLE)[0];
  const draft = composeBriefingFromTrend(trend, "2026-09-21");
  const safety = assessContentSafety({
    title: draft.title,
    body: draft.bodyMarkdown,
    excerpt: draft.excerpt,
    sources: draft.sources,
    alt: draft.image.alt,
  });
  assert.equal(safety.ok, true);
});

test("compose briefing meets 350 words for short trending titles", () => {
  const draft = composeBriefingFromTrend(
    { query: "uzak şehir", approxTraffic: 500, headlines: [] },
    "2026-09-22",
  );
  const safety = assessContentSafety({
    title: draft.title,
    body: draft.bodyMarkdown,
    excerpt: draft.excerpt,
    sources: draft.sources,
    alt: draft.image.alt,
  });
  assert.equal(safety.ok, true);
});

test("demand signals boost score", () => {
  const trend = parseTrendsRss(SAMPLE)[0];
  const base = scoreTrendItem(trend, []);
  const boosted = scoreTrendItem(trend, [{ query: "gram altın", weight: 10 }]);
  assert.ok(boosted > base);
});
