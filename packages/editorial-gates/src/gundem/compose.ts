import { gundemImageMatchesStory } from "./cover";
import { GUNDEM_PEXELS, briefingCopyFromHeadlines, curatedGundemCopy } from "./briefing-copy";
import type { GundemCategory } from "./categories";
import { polishHeadlinesBriefing } from "./polish";
import type { ParaphraseStrength } from "./paraphrase-tr";
import type { GundemBriefing } from "./types";
import type { LicensedImage } from "../image-license";
import type { TrendItem } from "./trends";

const SKIP_QUERY_RE =
  /\b(loto|sayısal|şans oyun|milli piyango|iddaa|mpİ|super loto|süper loto|on numara|porn|porno)\b/iu;

type TopicProfile = {
  category: GundemCategory;
  title: string;
  excerpt: string;
  angle: string;
  sources: { url: string; title: string }[];
  image: LicensedImage;
  bodyParagraphs: string[];
  editorialSource: "curated" | "headlines";
};

function slugify(query: string): string {
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
    .slice(0, 48);
  return `turkiye-${base || "gundem"}-brifing`;
}

function classifyQuery(query: string): GundemCategory {
  const q = query.toLocaleLowerCase("tr");
  if (/altın|dolar|euro|enflasyon|faiz|borsa|kira|maaş|ücret|zam|vergi|market|benzin/.test(q)) {
    return "ekonomi";
  }
  if (/seçim|meclis|bakan|cumhur|milletvekili|parti|tbmm/.test(q)) return "siyaset";
  if (/deprem|yangın|trafik|güvenlik|polis|afet/.test(q)) return "toplum";
  if (/hastane|sağlık|grip|virüs|aşı|ilaç/.test(q)) return "saglik";
  if (/maç|futbol|basket|şampiyon|transfer|süper lig/.test(q)) return "spor";
  if (/film|dizi|konser|festival/.test(q)) return "kultur";
  if (/uçak|havayolu|tatil|otel|turizm|bilet/.test(q)) return "ekonomi";
  if (/yazılım|iphone|android|siber|internet|btk/.test(q)) return "bilisim";
  return "diger";
}

function defaultSources(category: GundemCategory): { url: string; title: string }[] {
  switch (category) {
    case "ekonomi":
      return [
        { url: "https://www.tcmb.gov.tr/", title: "Türkiye Cumhuriyet Merkez Bankası" },
        { url: "https://data.tuik.gov.tr/", title: "TÜİK veri portalı" },
      ];
    case "siyaset":
      return [
        { url: "https://www.tbmm.gov.tr/", title: "TBMM" },
        { url: "https://data.tuik.gov.tr/", title: "TÜİK veri portalı" },
      ];
    case "saglik":
      return [
        { url: "https://www.saglik.gov.tr/", title: "T.C. Sağlık Bakanlığı" },
        { url: "https://data.tuik.gov.tr/", title: "TÜİK veri portalı" },
      ];
    case "bilisim":
      return [
        { url: "https://www.btk.gov.tr/", title: "BTK" },
        { url: "https://developers.google.com/search/docs", title: "Google Search Central" },
      ];
    default:
      return [
        { url: "https://data.tuik.gov.tr/", title: "TÜİK veri portalı" },
        { url: "https://www.tcmb.gov.tr/", title: "Türkiye Cumhuriyet Merkez Bankası" },
      ];
  }
}

function stockImage(category: GundemCategory, query: string): LicensedImage {
  const lower = query.toLocaleLowerCase("tr");
  if (/altın|altin/.test(lower)) {
    return {
      src: GUNDEM_PEXELS.gold,
      alt: "Altın külçe ve madeni paralar, gram altın ve birikim bağlamında",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "gram altın külçe",
    };
  }
  if (/uçak|ucak|bilet|havayolu/.test(lower)) {
    return {
      src: GUNDEM_PEXELS.plane,
      alt: "Uçak kanadı ve gökyüzü, uçak bileti ve seyahat maliyeti bağlamında",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "uçak bileti seyahat",
    };
  }
  if (category === "spor") {
    return {
      src: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1200",
      alt: "Futbol topu ve stadyum sahası, maç ve spor gündemi bağlamında",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "futbol maç stadyum",
    };
  }
  return {
    src: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Şehir silüeti, genel haber arka planı",
    creditName: "Pexels",
    creditUrl: "https://www.pexels.com",
    license: "pexels",
    query: "city skyline editorial",
  };
}

function resolveParaphraseStrength(): ParaphraseStrength {
  const raw = process.env.GUNDEM_PARAPHRASE_STRENGTH?.toLowerCase();
  return raw === "medium" ? "medium" : "light";
}

function resolveCopy(trend: TrendItem, todayIso: string): TopicProfile | null {
  const category = classifyQuery(trend.query);
  const strength = resolveParaphraseStrength();
  const fromHeadlines = briefingCopyFromHeadlines(trend.query, trend.headlines, category, {
    paraphraseStrength: strength,
    todayIso,
  });
  const copy = fromHeadlines ?? curatedGundemCopy(trend.query);
  if (!copy) return null;

  const image = stockImage(copy.category, trend.query);
  return {
    category: copy.category,
    title: copy.title,
    excerpt: copy.excerpt,
    angle: copy.title,
    sources: defaultSources(copy.category),
    image,
    bodyParagraphs: [...copy.paragraphs],
    editorialSource: copy.editorialSource ?? (fromHeadlines ? "headlines" : "curated"),
  };
}

export function shouldSkipTrendQuery(query: string): boolean {
  return SKIP_QUERY_RE.test(query);
}

export function composeBriefingFromTrend(trend: TrendItem, today: string): GundemBriefing | null {
  const profile = resolveCopy(trend, today);
  if (!profile) return null;

  let briefing: GundemBriefing = {
    slug: slugify(trend.query),
    title: profile.title,
    excerpt: profile.excerpt,
    bodyMarkdown: profile.bodyParagraphs.join("\n\n"),
    publishedAt: today,
    dateModified: today,
    category: profile.category,
    sources: profile.sources,
    image: profile.image,
    trendQuery: trend.query,
    angle: profile.angle,
    lang: "tr",
    editorialSource: profile.editorialSource,
    cover: gundemImageMatchesStory({
      title: profile.title,
      excerpt: profile.excerpt,
      trendQuery: trend.query,
      image: profile.image,
    })
      ? "photo"
      : "type",
  };

  if (profile.editorialSource === "headlines") {
    briefing = polishHeadlinesBriefing(briefing, {
      paraphraseStrength: resolveParaphraseStrength(),
      referenceHeadlines: trend.headlines,
    });
  }

  return briefing;
}

export type DemandSignal = { query: string; weight: number; category?: GundemCategory };

export function scoreTrendItem(
  trend: TrendItem,
  demandSignals: DemandSignal[],
  extraBoost = 0,
): number {
  if (shouldSkipTrendQuery(trend.query)) return -1;
  let score = trend.approxTraffic + extraBoost;
  const q = trend.query.toLocaleLowerCase("tr");
  for (const signal of demandSignals) {
    const s = signal.query.toLocaleLowerCase("tr");
    if (q.includes(s) || s.includes(q)) {
      score += signal.weight * 10;
    }
  }
  return score;
}
