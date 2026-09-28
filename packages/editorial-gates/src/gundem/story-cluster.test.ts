import { test } from "node:test";
import assert from "node:assert/strict";
import { clusterFeedItems, clusterMeetsSyndicationRules } from "./story-cluster";
import type { TrMediaFeedItem } from "./feed-ingest";

function item(feedId: string, title: string): TrMediaFeedItem {
  return {
    dedupKey: `${feedId}:1`,
    feedId,
    feedLabel: feedId,
    publisherGroupId: feedId,
    sourceType: "media",
    title,
  };
}

test("cluster merges similar cross-outlet headlines", () => {
  const clusters = clusterFeedItems([
    item("aa", "Dolar kuru 49 TL seviyesini gördü"),
    item("ntv", "Dolar 49 lirayı aştı: piyasada günün tablosu"),
  ]);
  assert.equal(clusters.length, 1);
  assert.equal(clusters[0].distinctFeedIds.length, 2);
  assert.equal(clusterMeetsSyndicationRules(clusters[0], 2), true);
});

test("single outlet cluster fails min feed rule", () => {
  const clusters = clusterFeedItems([item("aa", "Beşiktaş transferi duyurdu")]);
  assert.equal(clusterMeetsSyndicationRules(clusters[0], 2), false);
});

test("two feeds in one publisher group are not independent", () => {
  const a = item("site-a", "Dolar kuru 49 TL seviyesini gördü");
  const b = { ...item("site-b", "Dolar 49 TL seviyesini gördü"), publisherGroupId: "site-a" };
  const cluster = clusterFeedItems([a, b])[0];
  assert.equal(cluster.independentPublisherGroupIds.length, 1);
  assert.equal(clusterMeetsSyndicationRules(cluster, 2), false);
});

test("conflicting material numbers do not become publishable evidence", () => {
  const clusters = clusterFeedItems([
    item("site-a", "Takım finali 3-0 kazandı"),
    item("site-b", "Takım finali 2-0 kazandı"),
  ]);
  assert.ok(clusters.every((cluster) => !clusterMeetsSyndicationRules(cluster, 2)));
});

test("a shared number cannot merge unrelated events", () => {
  const clusters = clusterFeedItems([
    item("site-a", "Gaziantep'te kazada 7 kişi hayatını kaybetti"),
    item("site-b", "7 Ekim saldırılarının yıl dönümünde açıklama yapıldı"),
  ]);
  assert.equal(clusters.length, 2);
  assert.ok(clusters.every((cluster) => cluster.items.length === 1));
});
