import type { GundemCategory } from "./categories";

export type GundemBriefingCopy = {
  title: string;
  excerpt: string;
  paragraphs: readonly string[];
  category: GundemCategory;
};

/** Pexels CDN — kısa path 404 veriyor; sıkıştırma parametresi zorunlu. */
export const GUNDEM_PEXELS = {
  gold: "https://images.pexels.com/photos/164474/pexels-photo-164474.jpeg?auto=compress&cs=tinysrgb&w=1200",
  plane: "https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=1200",
} as const;

const GRAM_ALTIN: GundemBriefingCopy = {
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

export function curatedGundemCopy(query: string): GundemBriefingCopy | null {
  const q = normalizeQuery(query);
  if (/altın|altin/.test(q)) return GRAM_ALTIN;
  if (/uçak|ucak|bilet|havayolu/.test(q)) return UCAK_BILETI;
  return null;
}

/** Trends başlıkları varsa şablonsuz kısa brifing; yoksa null (yayınlanmaz). */
export function briefingCopyFromHeadlines(
  query: string,
  headlines: readonly string[],
  category: GundemCategory,
): GundemBriefingCopy | null {
  const cleaned = headlines.map((h) => h.trim()).filter((h) => h.length >= 12);
  if (cleaned.length < 2) return null;

  const title =
    cleaned[0].length <= 90
      ? cleaned[0]
      : `${query.charAt(0).toLocaleUpperCase("tr") + query.slice(1)}: günün başlıkları`;

  const excerpt = `${cleaned[0]} ve benzeri başlıklar gündemde. Aşağıda konunun okura doğrudan yansıyan maddeleri var.`;

  const paragraphs: string[] = [];
  for (const headline of cleaned.slice(0, 4)) {
    paragraphs.push(
      `${headline} — Bu başlık medyada geniş yer buldu. Okur tarafında soru genelde “bana ne oluyor?”: fiyat, erişim, tarih veya hizmet kalitesi değişiyor mu? Tek kaynaktan gelen kesilmiş görüntü yerine resmi duyuru ve birden fazla haber başlığını yan yana okumak daha güvenilir. Konu gelişirse resmi kurum veya yapım duyurusunu beklemek spekülasyonu azaltır.`,
    );
  }
  paragraphs.push(
    category === "ekonomi"
      ? "Ekonomi başlıklarında enflasyon, kur ve ücret verisi TÜİK ve TCMB takviminde yayımlanır; günlük tartışma ile resmi veri aynı gün örtüşmeyebilir."
      : "Kamu kurumlarının duyuruları ile yorum programları aynı ağırlıkta değildir; önce duyuru metni, sonra yorum.",
  );

  return { title, excerpt, paragraphs, category };
}
