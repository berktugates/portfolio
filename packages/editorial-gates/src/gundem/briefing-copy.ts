import type { GundemCategory } from "./categories";
import {
  buildGundemLede,
  headlineToNewsSentence,
  rankHeadlinesByFact,
} from "./headline-facts";
import { lightParaphraseTurkish, type ParaphraseStrength } from "./paraphrase-tr";
import type { TrendNewsHeadline } from "./trends";

export type GundemBriefingCopy = {
  title: string;
  excerpt: string;
  paragraphs: readonly string[];
  category: GundemCategory;
  editorialSource?: "curated" | "headlines";
};

/** Pexels CDN — kısa path 404 veriyor; sıkıştırma parametresi zorunlu. */
export const GUNDEM_PEXELS = {
  gold: "https://images.pexels.com/photos/164474/pexels-photo-164474.jpeg?auto=compress&cs=tinysrgb&w=1200",
  plane: "https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=1200",
} as const;

const GRAM_ALTIN: GundemBriefingCopy = {
  editorialSource: "curated",
  category: "ekonomi",
  title: "Gram altın fiyatı: kuyumcu vitrini ile külçe tarafı neden ayrışıyor?",
  excerpt:
    "Gram altın yeniden konuşulurken çoğu kişi aynı gün içinde farklı rakamlar görüyor. Kuyumcu, banka ve borsa fiyatı aynı şey değil; işçilik ve spread farkı bozulmadan kapanmıyor.",
  paragraphs: [
    "Son günlerde gram altın tarafında dikkat çeken şey, tek bir “resmi fiyat” olmaması. Kuyumcu vitrinindeki gram, çeyrek ve cumhuriyet altını aynı kur tablosundan türemiyor; işçilik, stok maliyeti ve anlık talep vitrin rakamını yukarı iter. Banka veya külçe kanallarında spread daha dar olabilir; bu yüzden sosyal medyada yan yana görülen iki ekran görüntüsü çoğu zaman farklı ürünleri karşılaştırıyor.",
    "Döviz kuru hareket ettiğinde gram altın genelde aynı yönde fiyatlanır; ancak gecikme ve gün içi dalgalanma kuyumcuda daha geç yansıyabilir. Bozdurma tarafında da aynı ayrışma var: alış fiyatı satış fiyatından belirgin aşağıda kalır; “dün aldım, bugün zarardayım” hissi çoğu zaman spread ve işçilikten gelir, piyasanın tek bir haberle çökmesinden değil.",
    "Birikim yapan okur için pratik ayrım şudur: kısa vadeli al-sat mı, uzun vadeli saklama mı? Saklama tarafında gram veya külçe tercihinde saklama maliyeti, sigorta ve bozdurma kolaylığı devreye girer. Düğün veya hediye amaçlı çeyrek alımda ise işçilik geri dönmeyebilir; bu ürünler aynı yatırım aracı değildir.",
    "Merkez Bankası ve TÜİK verileri enflasyon ve kur resmini verir; altın fiyatı bu tablonun tamamını tek başına özetlemez. Yatırım kararı için tek bir WhatsApp zinciri veya kısa video yeterli değildir; fiyatı sorduğunuz yerde hangi ürün, hangi saat ve hangi işlem (alış/satış) olduğunu netleştirmek gerekir. Resmi veri ile vitrin fiyatını aynı gün karşılaştırmak en azından yön hatasını azaltır.",
  ],
};

const UCAK_BILETI: GundemBriefingCopy = {
  editorialSource: "curated",
  category: "ekonomi",
  title: "Uçak bileti: promosyon dönemi bittiğinde bilet neden birden pahalılaşıyor?",
  excerpt:
    "İç hat uçuşlarında kampanya dönemleri ile normal tarife arasında yüzde elli ve üzeri fark görülebiliyor. Vergi, yakıt ve doluluk aynı ekranda tek satır olarak çıkmıyor.",
  paragraphs: [
    "Yaz sonrası iç hat biletlerinde tablo hızlı değişiyor: bir hafta önce görülen kampanya fiyatı aynı rotada bir sonraki hafta bulunmayabiliyor. Havayolları doluluk ve kalan koltuk sayısına göre tarife sınıflarını kapatıyor; erken alan yolcu ile son hafta alan yolcu aynı uçakta farklı kalemler ödüyor. Hafta içi sabah seferleri ile cuma akşamı seferleri aynı mesafe olsa bile farklı talep eğrisine oturur.",
    "Bilet fiyatının içinde yakıt ve döviz bileşeni olduğu için kur şoku doğrudan tarifeye yansır; ancak yolcunun gördüğü “anlık zamlı” fiyat çoğu zaman promosyonun bitmesi ve doluluk eşiğinin aşılmasıyla da oluşur. Aynı gün içinde fiyatın birkaç kez değişmesi teknik olarak mümkündür; sepette beklerken tutarın güncellenmesi bu yüzden sık görülür.",
    "Ek ücret tarafı ayrı bir sürpriz kaynağı: kabin bagajı, koltuk seçimi ve esnek iptal paketleri bazen temel biletten daha hızlı büyür. Aile seyahatinde tek kişilik en ucuz fiyat, dört kişilik toplam maliyeti temsil etmez; bagaj ve çocuk ücreti son adımda ortaya çıkabilir.",
    "Bayram ve okul tatili pencerelerinde talep sıkışır; alternatif havalimanı veya bir gün kaydırma bazen binlerce lira fark yaratır. Resmi tüketici enflasyonu veya turizm istatistikleri uçuş fiyatını birebir vermez; karar verirken tarih esnekliği, iptal şartı ve toplam sepet tutarını birlikte okumak gerekir. Aynı rotada gece uçuşu ile sabah uçuşu farklı tarife sınıflarına düşebilir.",
  ],
};

function normalizeQuery(query: string): string {
  return query.toLocaleLowerCase("tr").replace(/\s+/g, " ").trim();
}

/** Yalnızca Trends başlığı yokken dev fallback; otomatik yayında compose önceliği headlines. */
export function curatedGundemCopy(query: string): GundemBriefingCopy | null {
  const q = normalizeQuery(query);
  if (/altın|altin/.test(q)) return GRAM_ALTIN;
  if (/uçak|ucak|bilet|havayolu/.test(q)) return UCAK_BILETI;
  return null;
}

function normalizeHeadlines(
  headlines: readonly TrendNewsHeadline[] | readonly string[],
): TrendNewsHeadline[] {
  const out: TrendNewsHeadline[] = [];
  for (const h of headlines) {
    if (typeof h === "string") {
      const t = h.trim();
      if (t.length >= 12) out.push({ title: t, source: "" });
    } else if (h.title?.trim().length >= 12) {
      out.push({ title: h.title.trim(), source: h.source?.trim() ?? "" });
    }
  }
  return out;
}

function shortImpactLine(category: GundemCategory): string {
  switch (category) {
    case "ekonomi":
      return "Bu gelişmeler doğrudan cebi etkileyebilir; kesin rakam ve tarih için TCMB ve TÜİK duyuruları esas alınmalıdır.";
    case "spor":
      return "Transfer ve kadro haberleri resmi kulüp veya lig duyurusu gelene kadar spekülasyon içerebilir.";
    case "siyaset":
      return "Meclis gündemi ve Resmi Gazete metni, medya yorumundan önce okunmalıdır.";
    default:
      return "Resmi kurum duyurusu gelmeden kesin sonuç sanılmamalıdır.";
  }
}

/**
 * Trends başlıkları → güncel olay özeti (tanım/usul değil).
 * Her paragraf medyada konuşulan bir gelişmeyi cümle halinde taşır.
 */
export function briefingCopyFromHeadlines(
  query: string,
  headlines: readonly TrendNewsHeadline[] | readonly string[],
  category: GundemCategory,
  options?: { paraphraseStrength?: ParaphraseStrength; todayIso?: string },
): GundemBriefingCopy | null {
  const strength = options?.paraphraseStrength ?? "light";
  const todayIso = options?.todayIso ?? new Date().toISOString().slice(0, 10);
  const cleaned = normalizeHeadlines(headlines);
  if (cleaned.length < 2) return null;

  const ranked = rankHeadlinesByFact(cleaned);
  const top = ranked[0];
  const rest = ranked.slice(1, 5);

  const titleCandidate = lightParaphraseTurkish(top.title, strength);
  const title =
    titleCandidate.length <= 92
      ? titleCandidate
      : `${query.charAt(0).toLocaleUpperCase("tr") + query.slice(1)}: günün gelişmeleri`;

  const second = rest[0] ?? top;
  const excerptLead = lightParaphraseTurkish(top.title, strength).replace(/[.!?…]$/, "");
  const excerptSecond = lightParaphraseTurkish(second.title, strength).replace(/[.!?…]$/, "");
  const excerpt = `${excerptLead}. ${excerptSecond}.`;

  const paragraphs: string[] = [];
  paragraphs.push(buildGundemLede(query, top, todayIso, strength));
  paragraphs.push("Bugün öne çıkan gelişmeler:");
  paragraphs.push(headlineToNewsSentence(top, strength));
  for (const h of rest) {
    paragraphs.push(headlineToNewsSentence(h, strength));
  }
  paragraphs.push(
    `Ne değişti? ${shortImpactLine(category)} Medyada aynı konu farklı rakam veya tarihle geçebilir; çelişki varsa resmi kaynak beklenmelidir.`,
  );
  paragraphs.push(
    `${query.charAt(0).toLocaleUpperCase("tr") + query.slice(1)} gündeminde son saatlerde tablo hızlı değişebilir; en az iki bağımsız başlıkta geçen ortak noktayı (isim, tarih, skor, oran) eşleştirmek spekülasyonu azaltır. Resmi açıklama gelene kadar yalnızca medyada konuşulan gelişme düzeyinde okunmalıdır.`,
  );
  paragraphs.push(
    "Doğrulama: Ajans tel metni veya tek ekran görüntüsü nihai kaynak değildir. Kamu kurumu, kulüp veya düzenleyici duyurusu yayımlandığında tablo netleşir; bu sayfa o ana kadar medya başlıklarının editöryal özetidir. Gelişmeler gün içinde güncellenebilir.",
  );

  return {
    title,
    excerpt,
    paragraphs,
    category,
    editorialSource: "headlines",
  };
}
