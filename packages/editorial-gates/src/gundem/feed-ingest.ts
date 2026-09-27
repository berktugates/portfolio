import type { GundemCategory } from "./categories";
import type { NewsSourceType } from "./types";

export type FeedTier = "official" | "rss-headline-only";

export type TrMediaRssFeed = {
  id: string;
  url: string;
  label?: string;
  tier?: FeedTier;
  publisherGroupId?: string;
  sourceType?: NewsSourceType;
  allowedFields?: readonly ("title" | "link" | "pubDate" | "description")[];
  category?: GundemCategory;
  termsUrl?: string;
  rightsReviewedAt?: string;
  trustTier?: 1 | 2 | 3;
  pollIntervalMinutes?: number;
  enabled?: boolean;
};

export type TrMediaFeedConfig = {
  policyVersion?: number;
  allowHtmlArticleScrape?: boolean;
  minDistinctFeedsForAutoPublish?: number;
  minIndependentPublisherGroups?: number;
  evidenceWindowHours?: number;
  feeds: TrMediaRssFeed[];
};

export type TrMediaFeedItem = {
  dedupKey: string;
  feedId: string;
  publisherGroupId: string;
  sourceType: NewsSourceType;
  feedLabel: string;
  title: string;
  link?: string;
  pubDate?: string;
  descriptionSnippet?: string;
};

export type FeedCursor = {
  etag?: string;
  lastModified?: string;
  consecutiveFailures?: number;
  circuitOpenUntil?: string;
};

export type FeedFetchResult = {
  feedId: string;
  status: "ok" | "not-modified" | "skipped" | "failed";
  items: TrMediaFeedItem[];
  etag?: string;
  lastModified?: string;
  error?: string;
};

const FEED_MAX_BYTES = 512 * 1024;
const FETCH_TIMEOUT_MS = 8_000;
const SNIPPET_MAX = 220;
const XML_CONTENT_TYPE_RE = /(?:application|text)\/(?:rss\+xml|atom\+xml|xml)|application\/octet-stream/i;

function decodeXml(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

function stripHtml(html: string): string {
  return decodeXml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function hashText(text: string): string {
  let h = 0;
  const normalized = text.toLocaleLowerCase("tr");
  for (let i = 0; i < normalized.length; i++) h = (h * 31 + normalized.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function safeHttpsFeed(feed: TrMediaRssFeed): URL | null {
  try {
    const url = new URL(feed.url);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    if (
      host === "localhost" || host.endsWith(".localhost") || host === "::1" ||
      /^(?:127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host) ||
      /^172\.(?:1[6-9]|2\d|3[01])\./.test(host)
    ) return null;
    return url;
  } catch {
    return null;
  }
}

function elementText(block: string, tag: string): string {
  const escaped = tag.replace(":", "\\:");
  const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return decodeXml(match?.[1]?.trim() ?? "");
}

function atomLink(block: string): string {
  const alternate = block.match(/<link\b[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i)?.[1];
  const any = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i)?.[1];
  return decodeXml(alternate ?? any ?? "");
}

export function parseRssFeedItems(xml: string, feed: TrMediaRssFeed): TrMediaFeedItem[] {
  if (xml.length > FEED_MAX_BYTES || /<!DOCTYPE|<!ENTITY/i.test(xml)) return [];
  const label = feed.label ?? feed.id;
  const publisherGroupId = feed.publisherGroupId ?? feed.id;
  const sourceType = feed.sourceType ?? (feed.tier === "official" ? "official" : "media");
  const allowed = new Set(feed.allowedFields ?? ["title", "link", "pubDate"]);
  const rssBlocks = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);
  const atomBlocks = [...xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi)].map((m) => m[1]);
  const blocks = rssBlocks.length ? rssBlocks : atomBlocks;
  const atom = rssBlocks.length === 0;
  const items: TrMediaFeedItem[] = [];

  for (const block of blocks) {
    const title = stripHtml(elementText(block, "title")).slice(0, 240);
    if (title.length < 8) continue;
    const link = allowed.has("link") ? (atom ? atomLink(block) : elementText(block, "link")) : "";
    const guid = elementText(block, atom ? "id" : "guid") || link || hashText(title);
    const pubDate = allowed.has("pubDate")
      ? elementText(block, atom ? "updated" : "pubDate") || elementText(block, "published")
      : "";
    const descRaw = allowed.has("description")
      ? elementText(block, atom ? "summary" : "description") || elementText(block, "content:encoded")
      : "";
    const plain = descRaw ? stripHtml(descRaw).slice(0, SNIPPET_MAX) : "";
    items.push({
      dedupKey: `${feed.id}:${hashText(guid)}`,
      feedId: feed.id,
      publisherGroupId,
      sourceType,
      feedLabel: label,
      title,
      link: link || undefined,
      pubDate: pubDate || undefined,
      descriptionSnippet: plain.length >= 20 ? plain : undefined,
    });
    if (items.length >= 50) break;
  }
  return items;
}

export async function fetchFeedWithPolicy(
  feed: TrMediaRssFeed,
  cursor: FeedCursor = {},
  redirected = false,
): Promise<FeedFetchResult> {
  if (feed.enabled === false) return { feedId: feed.id, status: "skipped", items: [] };
  const initial = safeHttpsFeed(feed);
  if (!initial) return { feedId: feed.id, status: "failed", items: [], error: "unsafe-feed-url" };
  if (cursor.circuitOpenUntil && cursor.circuitOpenUntil > new Date().toISOString()) {
    return { feedId: feed.id, status: "skipped", items: [], error: "circuit-open" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const headers = new Headers({
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9",
      "User-Agent": "berktug-haberler-editorial/2.0 (+rss-metadata-only)",
    });
    if (cursor.etag) headers.set("If-None-Match", cursor.etag);
    if (cursor.lastModified) headers.set("If-Modified-Since", cursor.lastModified);
    const res = await fetch(initial, { headers, cache: "no-store", redirect: "manual", signal: controller.signal });
    if (res.status === 304) return { feedId: feed.id, status: "not-modified", items: [] };
    if (res.status >= 300 && res.status < 400) {
      if (redirected) throw new Error("too-many-redirects");
      const location = res.headers.get("location");
      if (!location) throw new Error("redirect-without-location");
      const redirectUrl = new URL(location, initial);
      if (redirectUrl.protocol !== "https:" || redirectUrl.hostname !== initial.hostname) throw new Error("cross-host-redirect");
      const redirectedResult = await fetchFeedWithPolicy({ ...feed, url: redirectUrl.toString() }, cursor, true);
      return redirectedResult;
    }
    if (!res.ok) throw new Error(`http-${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!XML_CONTENT_TYPE_RE.test(contentType)) throw new Error("invalid-content-type");
    const declaredSize = Number(res.headers.get("content-length") ?? "0");
    if (declaredSize > FEED_MAX_BYTES) throw new Error("feed-too-large");
    const xml = await res.text();
    if (new TextEncoder().encode(xml).byteLength > FEED_MAX_BYTES) throw new Error("feed-too-large");
    return {
      feedId: feed.id,
      status: "ok",
      items: parseRssFeedItems(xml, feed),
      etag: res.headers.get("etag") ?? undefined,
      lastModified: res.headers.get("last-modified") ?? undefined,
    };
  } catch (error) {
    return { feedId: feed.id, status: "failed", items: [], error: error instanceof Error ? error.message : "feed-fetch-failed" };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchTrMediaFeedItems(feeds: readonly TrMediaRssFeed[]): Promise<TrMediaFeedItem[]> {
  const results = await Promise.all(feeds.filter((feed) => feed.enabled !== false).map((feed) => fetchFeedWithPolicy(feed)));
  return results.flatMap((result) => result.items);
}

export function filterUnseenFeedItems(items: readonly TrMediaFeedItem[], seenKeys: ReadonlySet<string>): TrMediaFeedItem[] {
  return items.filter((item) => !seenKeys.has(item.dedupKey));
}

/** @deprecated D1 source_items is the durable ingest ledger. */
export type FeedIngestState = { seenDedupKeys: string[]; updatedAt: string };

/** @deprecated Only a bounded migration cache; never dispose evidence based on this list. */
export function mergeSeenKeys(state: FeedIngestState, newKeys: readonly string[]): FeedIngestState {
  const set = new Set(state.seenDedupKeys);
  for (const key of newKeys) set.add(key);
  return { seenDedupKeys: [...set].slice(-8000), updatedAt: new Date().toISOString() };
}
