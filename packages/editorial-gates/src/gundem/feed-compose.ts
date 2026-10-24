import { briefingCopyFromHeadlines } from "./briefing-copy";
import type { GundemCategory } from "./categories";
import type { FeedStoryCluster } from "./story-cluster";
import type { GundemBriefing } from "./types";
import type { TrendItem } from "./trends";
import { coverModeForStory, pickStoryCoverImage } from "./story-cover";
import type { ParaphraseStrength } from "./paraphrase-tr";
import { polishHeadlinesBriefing } from "./polish";
import type { TrMediaFeedItem } from "./feed-ingest";
import { claimsFromFeedItems } from "./news-quality";

export function slugifyNewsQuery(query: string): string {
  const tr = query.toLocaleLowerCase("tr");
  const ascii = tr
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
  const base = ascii
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 44);
  return `turkiye-${base || "gundem"}-brifing`;
}

export function classifyNewsQuery(query: string): GundemCategory {
  const q = query.toLocaleLowerCase("tr");
  if (/altın|dolar|euro|enflasyon|faiz|borsa|kira|maaş|ücret|zam|vergi|market|benzin|tcmb|bütçe|ihracat|ithalat|emekli|asgari|konut|kredi|enflasyon|petrol|enerji fiyat/.test(q)) {
    return "ekonomi";
  }
  if (/maç|futbol|basket|şampiyon|transfer|süper lig|beşiktaş|besiktas|fenerbah|galatasaray|trabzon|basketbol|voleybol|milli takım|uefa|fifa/.test(q)) {
    return "spor";
  }
  if (/hastane|sağlık|grip|virüs|aşı|ilaç|salgin|epidemi|doktor|hemşire|sgk|tıp|kanser|ameliyat/.test(q)) {
    return "saglik";
  }
  if (/film|dizi|konser|festival|tiyatro|müze|kitap|sanat|netflix|sinema|oscar|festivali/.test(q)) {
    return "kultur";
  }
  if (/yazılım|iphone|android|siber|internet|btk|yapay zeka|ai |chatgpt|apple|google|microsoft|samsung|5g|veri ihlali|siber saldır|teknoloji|chip|yarı iletken/.test(q)) {
    return "bilisim";
  }
  if (/uzay|nasa|bilim|iklim|deprem bilim|araştırma|üniversite|nobel|keşif/.test(q)) return "bilim";
  if (/seçim|meclis|bakan|cumhur|milletvekili|parti|tbmm|hükümet|kabine|anayasa|yargı|diplomasi|nato|bm |abd başkan|ukrayna|israil|filistin|suriye|irak|iran/.test(q)) {
    return "siyaset";
  }
  if (/deprem|yangın|trafik|güvenlik|polis|afet|sel|heyelan|kaza|göç|göçmen/.test(q)) return "toplum";
  if (/uçak|havayolu|tatil|otel|turizm|bilet/.test(q)) return "ekonomi";
  if (/dünya|yurtdış|avrupa|abd |rusya|çin |japonya|almanya|fransa|ingiltere/.test(q)) return "dunya";
  return "diger";
}

export function licensedIllustrativeImage(category: GundemCategory): GundemBriefing["image"] {
  if (category === "spor") {
    return {
      src: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Futbol sahası, spor gündemi bağlamında",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "futbol stadyum",
    };
  }
  return {
    src: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Şehir silüeti, gündem arka planı",
    creditName: "Pexels",
    creditUrl: "https://www.pexels.com",
    license: "pexels",
    query: "city skyline editorial",
  };
}

export function feedClusterToTrend(cluster: FeedStoryCluster): TrendItem {
  const headlines = cluster.items.map((i) => ({
    title: i.title,
    source: i.feedLabel,
  }));
  return {
    query: cluster.queryHint,
    approxTraffic: 400 + cluster.distinctFeedIds.length * 150 + cluster.items.length * 30,
    pubDate: cluster.latestPubDate ?? "",
    headlines,
  };
}

export function composeBriefingFromFeedCluster(
  cluster: FeedStoryCluster,
  todayIso: string,
  options?: { paraphraseStrength?: ParaphraseStrength },
): GundemBriefing | null {
  const strength = options?.paraphraseStrength ?? "light";
  const trend = feedClusterToTrend(cluster);
  const category = classifyNewsQuery(trend.query);
  const copy = briefingCopyFromHeadlines(trend.query, trend.headlines, category, {
    paraphraseStrength: strength,
    todayIso,
  });
  if (!copy) return null;

  const image = pickStoryCoverImage({
    category,
    title: copy.title,
    excerpt: copy.excerpt,
    seed: cluster.clusterId,
  });
  let briefing: GundemBriefing = {
    storyId: cluster.clusterId,
    slug: slugifyNewsQuery(`${trend.query}-${cluster.clusterId}`),
    title: copy.title,
    excerpt: copy.excerpt,
    bodyMarkdown: copy.paragraphs.join("\n\n"),
    publishedAt: todayIso,
    dateModified: todayIso,
    category: copy.category,
    sources: cluster.items
      .filter((item) => item.link)
      .filter((item, index, all) => all.findIndex((candidate) => candidate.link === item.link) === index)
      .map((item) => ({
        url: item.link!,
        title: item.feedLabel,
        sourceId: item.feedId,
        publisherGroupId: item.publisherGroupId,
        sourceType: item.sourceType,
        publishedAt: item.pubDate,
      })),
    image,
    trendQuery: trend.query.slice(0, 80).trim(),
    angle: copy.title,
    lang: "tr",
    editorialSource: "headlines",
    status: "DRAFTED",
    claims: claimsFromFeedItems(cluster.items),
    illustrativeImage: true,
    syndication: {
      mode: "rss-headline-synthesis",
      clusterId: cluster.clusterId,
      outlets: cluster.items.map((i: TrMediaFeedItem) => ({
        feedId: i.feedId,
        itemId: i.dedupKey,
        publisherGroupId: i.publisherGroupId,
        sourceType: i.sourceType,
        label: i.feedLabel,
        title: i.title,
        url: i.link,
        pubDate: i.pubDate,
      })),
    },
    cover: coverModeForStory(),
  };

  briefing = polishHeadlinesBriefing(briefing, {
    paraphraseStrength: strength,
    referenceHeadlines: trend.headlines,
  });

  return briefing;
}

/** Gate: RSS snippet gövdeye yapıştırılmış mı? */
export function findSnippetCopyHits(body: string, items: readonly TrMediaFeedItem[]): string[] {
  const hits: string[] = [];
  const normBody = body.toLocaleLowerCase("tr");
  for (const item of items) {
    const snip = item.descriptionSnippet?.trim();
    if (!snip || snip.length < 40) continue;
    const chunk = snip.slice(0, 60).toLocaleLowerCase("tr");
    if (chunk.length >= 40 && normBody.includes(chunk)) hits.push(item.feedId);
  }
  return hits;
}
