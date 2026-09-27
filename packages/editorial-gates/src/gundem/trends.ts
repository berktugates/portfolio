/** Google Trends TR daily RSS — talep sinyali (GTM/GA4 content_group=gundem ile ölçüm). */

export type TrendNewsHeadline = {
  title: string;
  source: string;
};

export type TrendItem = {
  query: string;
  approxTraffic: number;
  pubDate: string;
  headlines: TrendNewsHeadline[];
};

const TRENDS_RSS_URL = "https://trends.google.com/trending/rss?geo=TR";

export function parseApproxTraffic(raw: string | undefined): number {
  if (!raw) return 0;
  const m = raw.replace(/,/g, "").match(/(\d+)\s*\+?/);
  return m ? Number(m[1]) : 0;
}

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function parseTrendsRss(xml: string): TrendItem[] {
  const items: TrendItem[] = [];
  const itemBlocks = xml.split(/<item>/).slice(1);
  for (const block of itemBlocks) {
    const titleMatch = block.match(/<title>([^<]*)<\/title>/);
    const trafficMatch = block.match(/<ht:approx_traffic>([^<]*)<\/ht:approx_traffic>/);
    const pubMatch = block.match(/<pubDate>([^<]*)<\/pubDate>/);
    const query = decodeXml(titleMatch?.[1]?.trim() ?? "");
    if (!query) continue;

    const headlines: TrendNewsHeadline[] = [];
    const newsBlocks = block.split(/<ht:news_item>/).slice(1);
    for (const nb of newsBlocks) {
      const t = nb.match(/<ht:news_item_title>([^<]*)<\/ht:news_item_title>/);
      const s = nb.match(/<ht:news_item_source>([^<]*)<\/ht:news_item_source>/);
      if (t?.[1]) {
        headlines.push({
          title: decodeXml(t[1].trim()),
          source: decodeXml(s?.[1]?.trim() ?? ""),
        });
      }
    }

    items.push({
      query,
      approxTraffic: parseApproxTraffic(trafficMatch?.[1]),
      pubDate: pubMatch?.[1]?.trim() ?? "",
      headlines,
    });
  }
  return items;
}

export async function fetchTurkeyTrends(): Promise<TrendItem[]> {
  const res = await fetch(TRENDS_RSS_URL, {
    headers: { "User-Agent": "berktug-haberler-editorial/1.0" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Trends RSS fetch failed: ${res.status}`);
  }
  const xml = await res.text();
  return parseTrendsRss(xml);
}
