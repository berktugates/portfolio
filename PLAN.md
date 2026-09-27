# haberler.berktugberke.com — Çok Kaynaklı ve Hukuken Kontrollü Haber Sistemi

Durum: shadow-mode uygulaması tamamlandı; production otomatik yayın hukuki künye ve 7 günlük gözlem kapısında bekliyor. Bu dosya mimari karar kaydı ve teslim kontrol listesidir.

## Sabit kararlar

- [x] Makale HTML'i scrape edilmez; RSS/Atom metadata, resmî açıklama ve açıkça lisanslı içerik dışına çıkılmaz.
- [x] Aynı yayın grubundaki kaynaklar bağımsız doğrulama sayılmaz.
- [x] Haber taraması `7,22,37,52 * * * *`; günlük üst sınır 6 yeni hikâye ve 12 güncellemedir.
- [x] Haber URL'si güncellemelerde değişmez; yayın, güncelleme, düzeltme ve geri çekme sürümleri saklanır.
- [x] Kişisel/reklamsız Vercel Hobby kullanımı esas alınır; ticari özellikler deploy kapısıdır.
- [x] İki kaynak doğruluk eşiğidir, telif izni veya hassas içerik için hukuki izin değildir.

## Uygulama kontrol listesi

- [x] Kaynak registry, güvenli/koşullu feed ingest ve 36 saatlik kanıt penceresi
- [x] Yayıncı grubu, entity/olay/sayı kontrollü cluster ve claim ledger
- [x] Risk sınıflandırması, özgünlük ve haber kalitesi kapıları
- [x] D1 story/revision/evidence/outbox/review şeması ve R2 immutable arşiv
- [x] Kill switch, günlük kota ve idempotent publish saga (başarısız outbox işi audit kaydıyla kalır)
- [x] Cloudflare Access editör API/paneli ve Turnstile korumalı düzeltme talebi akışı
- [x] Künye, editöryal politika, yazar, düzeltme ve görünür revision geçmişi
- [x] Haber subdomain'ine özel robots.txt, generic/news sitemap, JSON-LD ve llms.txt
- [x] Unit, entegrasyon, SEO, typecheck ve production build kontrolleri
- [ ] Canlı Access/Turnstile/e-posta ve prod smoke doğrulaması
- [ ] Shadow mode; hukuki/operasyonel doğrulama; kontrollü production rollout

## Yayın ilkeleri

Başlık olay ve sonucu söyler; lead ilk iki cümlede neyin ne zaman değiştiğini somutlar. Excerpt iki gerçek gelişme taşır. Gövdenin en az yüzde 80'i yeni bilgi olmalı, arka plan tek kısa kapanış paragrafını aşmamalıdır. Her isim, kurum, tarih, skor, oran ve tutar claim ledger ile eşleşir. Resmî açıklama yoksa medya iddiası kesin dille yazılmaz. Kaynak snippet'iyle 10 kelimelik kesintisiz eşleşme ve yüzde 15 üzeri 8-gram örtüşmesi reddedilir. Loto, bahis yönlendirmesi, burç, sızıntı/dedikodu ve kaynaksız trend gürültüsü yayımlanmaz.

Suç isnadı, çocuk/mağdur kimliği, sağlık tavsiyesi, intihar/cinsel suç, can kaybı, seçim güvenliği, özel hayat ve piyasa etkili doğrulanmamış iddialar otomatik yayımlanmaz. Künye ve düzeltme/cevap akışı kayıtlı bilgilerle tamamlanmadan `NEWS_AUTO_PUBLISH` açılamaz.

## Ücretsiz plan bütçesi

Worker işi invocation başına küçük tutulur; JS CPU p95 hedefi 8 ms'dir. Haber AI bütçesi 8.000 neuron/gün, blog rezervi 2.000 neuron/gündür. D1 yalnız metadata ve denetim izi, R2 ise immutable yayın gövdeleri için kullanılır. GitHub Actions haber taraması yapmaz; yalnız CI/deploy çalıştırır.

## Kabul ölçütleri

- Desteksiz maddi claim, yanıltıcı kaynak URL'si ve lisanssız gövde/görsel: `0`.
- Geç gelen ikinci kaynak kaybolmaz; aynı medya grubu iki kaynak sayılmaz.
- Yanlış cluster oranı gözden geçirilen örneklerde `%1` altındadır.
- Düzeltme talebi anında audit kaydı ve editör bildirimi oluşturur.
- Tüm unit/integration/security/SEO testleri, typecheck, lint ve production build geçer.
- Otomatik yayın önce en az 7 gün shadow mode, ardından düşük riskli pilot ile açılır.

## Hukuki not

Teknik kontroller hukuki görüş değildir. 5187 kapsamındaki künye, sorumlu müdür, e-tebligat, saklama ve düzeltme/cevap uygulaması production açılışından önce Türk basın hukuku uzmanına doğrulatılmalıdır.
