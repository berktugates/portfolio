/**
 * Haberler (haberler.berktugberke.com) — editöryal çerçeve.
 * Tek kaynak: ülke geneli, herkesin okuyabileceği gündem + kısa analiz; yalnızca yazılım/bilişim değil.
 */

export const GUNDEM_EDITORIAL_MISSION =
  "Türkiye'deki herkesin okuyabileceği, ülkeyi ilgilendiren gündem başlıklarına kısa, kaynaklı analiz.";

export const GUNDEM_META_DESCRIPTION =
  "Türkiye gündemi: ekonomi, siyaset, toplum, sağlık, spor, kültür, bilim ve bilişim — okur odaklı brifing ve analiz. Ajans kopyası değildir.";

export const GUNDEM_INDEX_LEDE =
  "Ülke genelini ilgilendiren konularda kısa brifing ve analiz. Teknoloji yalnızca bir başlık; hedef kitle tüm Türkiye. Stok görseller olay fotoğrafı değildir.";

export const GUNDEM_DETAIL_ANALYSIS_NOTE =
  "Bu metin bir haber ajansı servisi değildir; birincil kaynaklara dayanan özet ve editöryal analizdir. Yatırım, hukuk veya sağlık kararı için tek başına yeterli değildir.";

export const GUNDEM_HEADER_ROLE = "Türkiye gündemi ve analiz";

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
