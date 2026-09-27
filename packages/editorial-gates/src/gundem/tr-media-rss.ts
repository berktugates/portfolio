/** @deprecated Skor sinyali — tam ingest için feed-ingest.ts kullanın. */
import {
  fetchTrMediaFeedItems,
  parseRssFeedItems,
  type TrMediaFeedConfig,
  type TrMediaRssFeed,
} from "./feed-ingest";

export type { TrMediaRssFeed };

export type TrMediaHeadline = {
  title: string;
  feedId: string;
  pubDate?: string;
};

export async function fetchTrMediaHeadlines(
  feeds: readonly TrMediaRssFeed[],
): Promise<TrMediaHeadline[]> {
  const items = await fetchTrMediaFeedItems(feeds);
  return items.map((i) => ({ title: i.title, feedId: i.feedId, pubDate: i.pubDate }));
}

export function parseSimpleRssTitles(xml: string, feedId: string): TrMediaHeadline[] {
  return parseRssFeedItems(xml, { id: feedId, url: "" }).map((i) => ({
    title: i.title,
    feedId: i.feedId,
    pubDate: i.pubDate,
  }));
}

function normalizeToken(text: string): string {
  return text.toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

export function mediaHeadlineBoost(query: string, headlines: readonly TrMediaHeadline[]): number {
  const q = normalizeToken(query);
  if (!q) return 0;
  const qTokens = q.split(" ").filter((t) => t.length >= 3);
  if (qTokens.length === 0) return 0;

  let boost = 0;
  for (const h of headlines) {
    const t = normalizeToken(h.title);
    if (!t) continue;
    if (t.includes(q) || q.includes(t.slice(0, Math.min(24, t.length)))) {
      boost += 80;
      continue;
    }
    const hits = qTokens.filter((tok) => t.includes(tok)).length;
    if (hits >= Math.min(2, qTokens.length)) boost += 40;
  }
  return boost;
}

export function loadFeedConfigDefaults(): TrMediaFeedConfig {
  return {
    policyVersion: 1,
    allowHtmlArticleScrape: false,
    minDistinctFeedsForAutoPublish: 2,
    minIndependentPublisherGroups: 2,
    evidenceWindowHours: 36,
    feeds: [
      {
        id: "aa-guncel",
        url: "https://www.aa.com.tr/tr/rss/default?cat=guncel",
        label: "Anadolu Ajansı",
        tier: "rss-headline-only",
        publisherGroupId: "anadolu-ajansi",
        sourceType: "media",
        allowedFields: ["title", "link", "pubDate", "description"],
        termsUrl: "https://www.aa.com.tr/tr/p/kullanim-kosullari",
        rightsReviewedAt: "2026-09-28",
        trustTier: 2,
        pollIntervalMinutes: 15,
        enabled: true,
      },
      {
        id: "trt-gundem",
      url: "https://www.trthaber.com/gundem_articles.rss",
        label: "TRT Haber",
        tier: "rss-headline-only",
        publisherGroupId: "trt",
        sourceType: "media",
        allowedFields: ["title", "link", "pubDate", "description"],
        termsUrl: "https://www.trthaber.com/",
        rightsReviewedAt: "2026-09-28",
        trustTier: 2,
        pollIntervalMinutes: 15,
        enabled: true,
      },
    ],
  };
}
