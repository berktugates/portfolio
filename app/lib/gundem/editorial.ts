/**
 * Haberler (haberler.berktugberke.com) — editöryal çerçeve.
 * Tek kaynak: ülke geneli, herkesin okuyabileceği gündem + kısa analiz; yalnızca yazılım/bilişim değil.
 */

export const GUNDEM_EDITORIAL_MISSION =
  "Türkiye'deki herkesin okuyabileceği, ülkeyi ilgilendiren gündem başlıklarına kısa, kaynaklı analiz.";

export const HABERLER_BRAND = "BBA Gündem";

export const GUNDEM_META_DESCRIPTION =
  "Türkiye'de bugün konuşulan başlıklar: ekonomi, siyaset, toplum, sağlık, spor ve daha fazlası — kaynaklı gündem brifingleri.";

export const GUNDEM_INDEX_LEDE =
  "Arama ve sosyal gündemde öne çıkan ulusal konuları, birincil kaynaklara dayanan kısa brifinglerle okuyun.";

export const HABERLER_PAGE_TITLE = "Türkiye Gündemi";

export const GUNDEM_HEADER_ROLE = "Türkiye gündemi";

export const GUNDEM_RSS_DESCRIPTION =
  "Türkiye gündemi — ekonomi, toplum, siyaset ve daha fazlası için kısa analiz brifingleri.";

/** Kuyruk / Trends → brifing: okur etkisi ve kamuoyu merkezli analiz sorusu. */
export const GUNDEM_DEFAULT_ANGLE_PROMPT =
  "Türkiye'de bu gündem maddesi hane halkını, iş dünyasını ve kamuoyunu nasıl etkiler? Okur için ne anlama gelir?";

/**
 * İçerik planı: tüm alanlar eşit öncelikli; bilişim kotası yok.
 * Editörler Trends/KWP ile tıklama potansiyeli yüksek ulusal konuları seçer.
 */
export const GUNDEM_TOPIC_LANES = [
  "ekonomi ve yaşam maliyeti",
  "siyaset ve kamu",
  "toplum ve güvenlik",
  "sağlık",
  "spor",
  "kültür ve medya",
  "bilim ve çevre",
  "bilişim ve dijital hayat",
  "dünya ve Türkiye bağlantısı",
] as const;

export type GundemCategory =
  | "ekonomi"
  | "siyaset"
  | "toplum"
  | "saglik"
  | "spor"
  | "kultur"
  | "bilim"
  | "bilisim"
  | "dunya"
  | "diger";

export const GUNDEM_CATEGORY_LABELS: Record<GundemCategory, string> = {
  ekonomi: "Ekonomi",
  siyaset: "Siyaset",
  toplum: "Toplum",
  saglik: "Sağlık",
  spor: "Spor",
  kultur: "Kültür",
  bilim: "Bilim",
  bilisim: "Bilişim",
  dunya: "Dünya",
  diger: "Gündem",
};

export function formatGundemCategory(category: GundemCategory | undefined): string {
  return category ? GUNDEM_CATEGORY_LABELS[category] : GUNDEM_CATEGORY_LABELS.diger;
}

const GUNDEM_CATEGORY_SET = new Set<string>(Object.keys(GUNDEM_CATEGORY_LABELS));

export function isGundemCategory(value: string): value is GundemCategory {
  return GUNDEM_CATEGORY_SET.has(value);
}

const GUNDEM_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
] as const;

export function formatGundemDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const month = GUNDEM_MONTHS[Number(match[2]) - 1];
  if (!month) return iso;
  return `${Number(match[3])} ${month} ${match[1]}`;
}
