import type { GundemCategory } from "../../app/lib/gundem/editorial";
import { GUNDEM_DEFAULT_ANGLE_PROMPT } from "../../app/lib/gundem/editorial";
import type { GundemBriefing } from "../../app/lib/gundem/types";
import type { LicensedImage } from "../../app/lib/image-license";
import type { TrendItem } from "./gundem-trends";

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
  if (/uçak|havayolu|tatil|otel|turizm/.test(q)) return "ekonomi";
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
  const q = query.slice(0, 40);
  if (/altın/.test(query.toLocaleLowerCase("tr"))) {
    return {
      src: "https://images.pexels.com/photos/106152/pexels-photo-106152.jpeg",
      alt: "Altın külçe ve madeni paralar, stok görsel, olay fotoğrafı değil",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "gold bars coins",
    };
  }
  if (/uçak|havayolu/.test(query.toLocaleLowerCase("tr"))) {
    return {
      src: "https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg",
      alt: "Gökyüzünde uçak kanadı, stok görsel, olay fotoğrafı değil",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "airplane wing sky",
    };
  }
  if (category === "spor") {
    return {
      src: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
      alt: "Futbol topu ve saha, stok görsel, olay fotoğrafı değil",
      creditName: "Pexels",
      creditUrl: "https://www.pexels.com",
      license: "pexels",
      query: "football stadium",
    };
  }
  return {
    src: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg",
    alt: "Türkiye gündemi brifing görseli, stok şehir silüeti, olay fotoğrafı değil",
    creditName: "Pexels",
    creditUrl: "https://www.pexels.com",
    license: "pexels",
    query: q || "city skyline",
  };
}

function countWords(text: string): number {
  return text.split(/\s+/u).filter(Boolean).length;
}

const EDITORIAL_PAD =
  "Sonuç olarak, Türkiye genelinde bu başlığı takip eden okurlar için en güvenilir yaklaşım kamu verisini kişisel bütçe notlarıyla birleştirmek, spekülatif iddiaları doğrulamadan paylaşmamak ve gündemi haftalık küçük özetlerle izlemektir.";

function buildBodyParagraphs(query: string, category: GundemCategory, trend: TrendItem): string[] {
  const q = query;
  const mediaContext =
    trend.headlines.length > 0
      ? `Medya gündeminde bu konu geniş yer buluyor; okur tarafında ise fiş, bütçe ve günlük planlama öne çıkıyor.`
      : `Arama hacmi yükseldiğinde okurlar çoğu zaman tek cümlelik cevap yerine etki ve bağlam arar.`;

  const shared = [
    `Türkiye'de «${q}» araması yükseldiğinde bu genelde yalnızca merak değil; hane bütçesi, iş planı veya seyahat kararıyla bağlantılı bir sorudur. ${mediaContext} Bu brifing, ajans metni kopyalamadan konuyu geniş okur kitlesi için sade bir analizle toparlar.`,
    `Kamuoyu tartışması hızlı akar: bir grafik, bir söylem veya bir beklenti anketı gündemi şekillendirir. Okur açısından daha yavaş ama daha güvenilir olan, resmi veri takvimini ve kendi yaşam maliyetini yan yana koymaktır. Özellikle ${category === "ekonomi" ? "kur, faiz ve fiyat" : "kamu duyuruları ve yerel koşullar"} birbirine bağlıdır; tek başlık rakamı veya tek haber spotu bütün resmi vermez.`,
    `Analiz çerçevesi: ${GUNDEM_DEFAULT_ANGLE_PROMPT} Bugünkü arama dalgasında üç pratik soru işe yarar: Bu konu benim gelir-gider tabloma nasıl yansır, hangi resmi kaynak tarihini referans almalıyım, spekülatif paylaşımları nasıl ayıklarım? Sosyal medyada dolaşan ekran görüntüleri ve kesilmiş videolar çoğu zaman bağlamı düşürür. Resmi kurum duyuruları ile yorum programları aynı ağırlıkta olmamalı; önce veri, sonra yorum sırası okur için daha güvenlidir.`,
    `Türkiye'nin farklı bölgelerinde aynı başlık farklı hissedilir. Büyükşehirde ulaşım ve kira kalemleri öne çıkarken, turizm ve tarım bölgelerinde sezonluk gelir dalgalanması belirleyici olabilir. Ulusal bir gündem maddesini okurken kendi il ve ilçe koşullarınızı not etmek, medya ortalamasından kopmamanızı sağlar. Komşu iller arasında bile fiyat ve hizmet farkı görülebilir; bu yüzden ulusal başlığı yerel veriyle test etmek önemlidir.`,
    `Editöryal not: Bu sayfa bir tel servisi veya canlı yayın akışı değildir. Kamu kurumları ve istatistik portalları birincil referans olarak kullanılır; yatırım, hukuk, sağlık veya seyahat kararı için tek başına yeterli değildir. GTM ve GA4 üzerinde haberler yüzeyi gundem içerik grubu olarak izlenir; Search Console haberler sitemap ile keşfi destekler.`,
    `Geniş kitle için kapanış önerisi: gündemi takip ederken kaynak çeşitliliğini koruyun, duygusal paylaşımları veri ile dengeleyin ve bütçe planınızı haftalık küçük notlarla güncelleyin. «${q}» araması sakinleştiğinde bile altta yatan yapısal konu (fiyat, erişim, güvenlik veya hizmet kalitesi) çoğu zaman sürer; bu yüzden tek günlük spike yerine birkaç haftalık iz daha dürüst bir tablo verir.`,
  ];

  if (/altın/.test(q.toLocaleLowerCase("tr"))) {
    shared.splice(
      1,
      0,
      `Altın aramaları Türkiye'de hem birikimci hem de günlük tüketici davranışını yansıtır. Gram ve çeyrek fiyatı konuşulduğunda çoğu kişi aslında alım gücü ve güven arayışını tartışır. Merkez Bankası ve piyasa verileri ile kuyumcu vitrin fiyatı arasında zaman gecikmesi olabilir; bu gecikme sosyal medyada panik veya aşırı iyimserlik üretebilir.`,
    );
  }
  if (/uçak|bilet/.test(q.toLocaleLowerCase("tr"))) {
    shared.splice(
      1,
      0,
      `Uçak bileti aramaları tatil planı, iş seyahati ve aile ziyaretini aynı potada toplar. Yakıt maliyeti, kapasite ve döviz bileşenleri tarifeye yansır; kampanya dönemleri ile normal sezon fiyatları aynı rotada çok farklı görünebilir. Erken rezervasyon ile son dakika fırsatı her zaman aynı ekonomik mantığa uymaz.`,
    );
  }

  let body = shared.join("\n\n");
  while (countWords(body) < 352 && shared.length < 12) {
    shared.push(EDITORIAL_PAD);
    body = shared.join("\n\n");
  }

  return shared;
}

function buildProfile(trend: TrendItem): TopicProfile {
  const query = trend.query;
  const category = classifyQuery(query);
  const lower = query.toLocaleLowerCase("tr");

  let title = `Türkiye gündemi: ${query} — okur için etki ve bağlam`;
  if (/altın/.test(lower)) {
    title = "Gram altın aramaları yükseldi: birikimci ve hane halkı için ne değişiyor?";
  } else if (/uçak|bilet/.test(lower)) {
    title = "Uçak bileti fiyatları gündemde: seyahat bütçesi ve beklentiler";
  } else if (category === "ekonomi") {
    title = `${query.charAt(0).toLocaleUpperCase("tr") + query.slice(1)}: ekonomi gündeminde okur perspektifi`;
  }

  const excerpt = `Google Trends Türkiye ve medya gündeminde öne çıkan «${query}» başlığı için kısa brifing ve analiz. Ajans kopyası değildir; geniş okur kitlesine yöneliktir.`;

  return {
    category,
    title,
    excerpt,
    angle: GUNDEM_DEFAULT_ANGLE_PROMPT,
    sources: defaultSources(category),
    image: stockImage(category, query),
    bodyParagraphs: buildBodyParagraphs(query, category, trend),
  };
}

export function shouldSkipTrendQuery(query: string): boolean {
  return SKIP_QUERY_RE.test(query);
}

export function composeBriefingFromTrend(trend: TrendItem, today: string): GundemBriefing {
  const profile = buildProfile(trend);
  return {
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
  };
}

export type DemandSignal = { query: string; weight: number; category?: GundemCategory };

export function scoreTrendItem(
  trend: TrendItem,
  demandSignals: DemandSignal[],
): number {
  if (shouldSkipTrendQuery(trend.query)) return -1;
  let score = trend.approxTraffic;
  const q = trend.query.toLocaleLowerCase("tr");
  for (const signal of demandSignals) {
    const s = signal.query.toLocaleLowerCase("tr");
    if (q.includes(s) || s.includes(q)) {
      score += signal.weight * 10;
    }
  }
  return score;
}
