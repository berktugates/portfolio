# Gündem syndication (hukuk + teknik)

## Yapılmaz

- Habertürk / CNN Türk / benzeri sitelerden **HTML makale scrape** (gövde metni çekme).
- Ajans metnini **birebir veya %80 benzer** yeniden yayınlama.
- RSS’te verilmeyen foto/video **hotlink** veya kopyalama.

Bu yaklaşım telif ve site kullanım şartları riski taşır; kodda `allowHtmlArticleScrape: false` sabittir.

## Yapılır (bütçe dostu, savunulabilir)

1. **Yalnızca RSS/Atom** — yayınlanması için site tarafından sunulan `title`, `pubDate`, `guid`, isteğe bağlı kısa `description` (iç işlem; gövdeye yapıştırılmaz).
2. **Çok kaynaklı küme** — aynı olay en az **2 bağımsız feed** başlığında görünmeden otomatik yayın yok (tek kaynak = spekülasyon).
3. **Olay sentezi** — mevcut `headline-facts` + `briefingCopyFromHeadlines`: başlıklardan paraphrase **gelişme cümlesi**; sonuç (rakam/karar/transfer) korunur, cümle yapısı değişir.
4. **Resmi kaynak satırı** — gövdede TCMB/TÜİK/TBMM vb. allowlist linkleri; medya URL’leri `sources` allowlist’ine eklenmez.
5. **Dedup** — RSS `guid` + küme kimliği; aynı olay tekrar yayınlanmaz.
6. **Şeffaflık** — JSON’da `syndication.outlets[]` (hangi feed başlığı tetikledi).

## Operasyon

- Feed listesi: `data/tr-media-rss-feeds.json` → R2 `meta/tr-media-rss-feeds.json` (`pnpm gundem:sync-meta-r2`).
- Worker cron: yeni RSS maddeleri → kümele → compose → gate → R2.
- Feed ToS değişirse ilgili satırı config’den kaldırın.

## Üst lig farkı

AA aboneliği / muhabir ağı olmadan Habertürk hızına çıkılmaz; bu model **gecikmeli agregasyon + editöryal özet** hedefler.
