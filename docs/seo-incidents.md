# SEO olay kaydı

Şablon: tarih, belirti, kanıt, etki, karar, geri alma. “Sıra düştü” ancak iki Search Console çekimi aynı filtreyle karşılaştırıldıysa yazılır.

## 2026-09-26 — RFC-0 denetim

- Belirti: `sc-domain:berktugberke.com`, 28 gün, 7 tıklama, 329 gösterim, ortalama sıra 44,2. Dışa aktarımda sayfa ve sorgu sırası yok.
- Kanıt: `docs/gsc-performance-baseline.snapshot.json` (2026-09-22). “medula” dizgesi ürün ve blog kaynağında yok.
- Etki: domain ortalaması portföy ile `haberler.berktugberke.com` ayrımını gizler.
- Karar: sayfa filtreli kova, servis hesabı olmadan doldurulmaz.
- Geri alma: yok. Ölçüm kaydıdır.

## 2026-09-26 — www kopyası

- Belirti: `https://www.berktugberke.com/` HTTP 200. ETag, apex ile aynı (`33c5638b823dc75907af4246b666c1ed`). 308 yok.
- Kanıt: `curl -I` aynı gün. Ayrıntı `docs/seo-measurement-rfc1.md`.
- Etki: aynı HTML iki hostta duruyor.
- Karar: middleware `www.berktugberke.com` → apex, 308. Kütük: `docs/seo-redirects.md`.
- Geri alma: `middleware.ts` içindeki www dalını kaldıran commit.

## 2026-09-27 — uydurma değişiklik tarihi

- Belirti: `SITE_LAST_MODIFIED` elle yazılmış bir damgaydı. Günlük yayın betiği onu bugünün tarihiyle eziyordu. Sitemap’te proje ve hukuk URL’lerinde, JSON-LD’de ana sayfa ve hire sayfalarında değişiklik zamanı diye duruyordu.
- Karar: damga silindi. Blog yazısı kendi `publishedAt` / `dateModified` değerini taşır. `/api/revalidate` GET 405 döner, HTML belge değildir.
- Geri alma: sabit bir ISO damgayı sitemap ve şemaya geri koymak.

## 2026-09-26 — görünmeyen teklif

- Belirti: kök şema her URL’de 16 hizmetin OfferCatalog kaydını basıyordu. Blog sayfasında bu hizmetler görünmüyor.
- Karar: katalog kökten çıktı. Hizmet listesi yalnızca hire sayfasının görünen ItemList’inde. Tek hizmet sayfası yalnızca kendi Offer kaydını taşır.
- Geri alma: `serviceOfferCatalogJsonLd()` kök grafa geri konur.

## 2026-09-26 — Türkçe paylaşım görseli

- Belirti: her yerel `/opengraph-image` kullanıyordu. Kart metni `Berktug Berke Ates / Software Engineer`.
- Karar: yalnızca `/tr` altı `/tr/opengraph-image` kullanır. Kart: `Berktuğ Berke Ateş` ve `Yazılım Mühendisi`. İkamet, Next.js ve staff yazılmaz. Diğer diller İngilizce kartta kalır.
- Geri alma: `shareImagePath` her yerel için `/opengraph-image` döndürsün.

## 2026-09-26 — belge dili

- Belirti: `/` ve `/tr` kaynak HTML’i `lang="en"`. Dil, head betiğiyle sonradan yazılıyordu.
- Karar: `html lang` prerender sırasında route şablonundan yazılır (`app/lib/document-lang.ts`). `headers()` kullanılmaz; o çağrı her rotayı dinamik render’a alır ve prod’daki `x-nextjs-prerender: 1` davranışını düşürür. İstemci dil yaması kalktı. `/` için `LOCALE_REDIRECT_SCRIPT` duruyor. Türkçe paylaşım URL’si `/tr`.
- Geri alma: `documentLang()` çağrısını kaldırıp `lang="en"` sabitlemek.
