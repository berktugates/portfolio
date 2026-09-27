/** Kamu / ajans RSS — yalnızca kuyruk skoru sinyali; metin kopyalanmaz. */

export type TrMediaRssFeed = {
  id: string;
  url: string;
  label?: string;
};

export type TrMediaHeadline = {
  title: string;
  feedId: string;
  pubDate?: string;
};

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function parseSimpleRssTitles(xml: string, feedId: string): TrMediaHeadline[] {
  const items: TrMediaHeadline[] = [];
  const blocks = xml.split(/<item>/i).slice(1);
  for (const block of blocks) {
    const titleMatch = block.match(/<title>([^<]*)<\/title>/i);
    const pubMatch = block.match(/<pubDate>([^<]*)<\/pubDate>/i);
    const title = decodeXml(titleMatch?.[1]?.trim() ?? "");
    if (title.length < 8) continue;
    items.push({ title, feedId, pubDate: pubMatch?.[1]?.trim() });
    if (items.length >= 40) break;
  }
  return items;
}

export async function fetchTrMediaHeadlines(
  feeds: readonly TrMediaRssFeed[],
): Promise<TrMediaHeadline[]> {
  const all: TrMediaHeadline[] = [];
  await Promise.all(
    feeds.map(async (feed) => {
      try {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "berktug-haberler-editorial/1.0" },
          cache: "no-store",
        });
        if (!res.ok) return;
        const xml = await res.text();
        all.push(...parseSimpleRssTitles(xml, feed.id));
      } catch {
        /* feed opsiyonel */
      }
    }),
  );
  return all;
}

function normalizeToken(text: string): string {
  return text.toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

/** Trends sorgusu ile RSS başlığı örtüşürse ek skor. */
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
