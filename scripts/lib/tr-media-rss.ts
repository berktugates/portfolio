import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { TrMediaFeedConfig } from "@berktug/editorial-gates/gundem/feed-ingest";
import {
  fetchTrMediaHeadlines,
  mediaHeadlineBoost,
  type TrMediaHeadline,
  type TrMediaRssFeed,
} from "@berktug/editorial-gates/gundem/tr-media-rss";

export { fetchTrMediaHeadlines, mediaHeadlineBoost, type TrMediaHeadline };

export async function loadTrMediaFeedConfigFromRepo(): Promise<TrMediaFeedConfig | null> {
  const root = resolve(import.meta.dirname, "../..");
  try {
    const raw = await readFile(resolve(root, "data/tr-media-rss-feeds.json"), "utf8");
    return JSON.parse(raw) as TrMediaFeedConfig;
  } catch {
    return null;
  }
}

export async function loadTrMediaHeadlinesFromRepo(): Promise<TrMediaHeadline[]> {
  const config = await loadTrMediaFeedConfigFromRepo();
  const feeds = config?.feeds ?? [];
  if (feeds.length === 0) return [];
  return fetchTrMediaHeadlines(feeds);
}
