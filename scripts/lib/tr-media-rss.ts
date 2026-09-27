import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  fetchTrMediaHeadlines,
  mediaHeadlineBoost,
  type TrMediaHeadline,
  type TrMediaRssFeed,
} from "@berktug/editorial-gates/gundem/tr-media-rss";

export { fetchTrMediaHeadlines, mediaHeadlineBoost, type TrMediaHeadline };

export async function loadTrMediaHeadlinesFromRepo(): Promise<TrMediaHeadline[]> {
  const root = resolve(import.meta.dirname, "../..");
  try {
    const raw = await readFile(resolve(root, "data/tr-media-rss-feeds.json"), "utf8");
    const data = JSON.parse(raw) as { feeds?: TrMediaRssFeed[] };
    const feeds = data.feeds ?? [];
    if (feeds.length === 0) return [];
    return fetchTrMediaHeadlines(feeds);
  } catch {
    return [];
  }
}
