import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRssFeedItems } from "./feed-ingest";

const feed = {
  id: "source-a",
  label: "Source A",
  url: "https://example.com/rss.xml",
  publisherGroupId: "group-a",
  sourceType: "media" as const,
  allowedFields: ["title", "link", "pubDate", "description"] as const,
};

test("RSS parser keeps only permitted metadata", () => {
  const items = parseRssFeedItems(`<rss><channel><item><title>Merkez Bankası faiz kararını açıkladı</title><link>https://example.com/a</link><pubDate>2026-09-28T10:00:00Z</pubDate><description><![CDATA[Karar bugün açıklandı ve oran sabit kaldı.]]></description></item></channel></rss>`, feed);
  assert.equal(items.length, 1);
  assert.equal(items[0].publisherGroupId, "group-a");
  assert.equal(items[0].link, "https://example.com/a");
  assert.ok(!("body" in items[0]));
});

test("parser rejects document types and entity declarations", () => {
  const xml = `<!DOCTYPE rss [<!ENTITY x SYSTEM "file:///etc/passwd">]><rss><channel><item><title>&x; haber başlığı</title></item></channel></rss>`;
  assert.deepEqual(parseRssFeedItems(xml, feed), []);
});

test("Atom parser resolves alternate links", () => {
  const items = parseRssFeedItems(`<feed><entry><title>Takım final maçını üç golle kazandı</title><link rel="alternate" href="https://example.com/match"/><updated>2026-09-28T18:00:00Z</updated></entry></feed>`, feed);
  assert.equal(items[0]?.link, "https://example.com/match");
});
