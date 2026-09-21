# Haberler editöryal çerçeve (staff)

**Yüzey:** [haberler.berktugberke.com](https://haberler.berktugberke.com/) — portföy ana grafiğinde link yok; kanonik gündem host’u.

## Amaç

- **Kitle:** Türkiye’deki herkes; yalnızca yazılım veya bilişim profesyonelleri değil.
- **İçerik:** Ülkeyi ilgilendiren gündem (ekonomi, siyaset, toplum, sağlık, spor, kültür, bilim, bilişim, dünya bağlantıları).
- **Biçim:** Kısa brifing + **editöryal analiz** (neden önemli, okura etkisi); ajans tel kopyası yok.
- **SEO/GEO:** Trends ve KWP ile **yüksek arama/tıklama potansiyeli** olan ulusal konular kuyruğa alınır; analiz dürüst ve kaynaklı kalır.

Kodda tek kaynak: `app/lib/gundem/editorial.ts`.

## Pipeline

| Adım | Dosya / araç |
|------|----------------|
| Örnek / dev fallback | `content/gundem-seed.json` |
| Kuyruk | `content/gundem-queue/*.json` |
| Güvenlik | `scripts/check-queue-safety.ts`, `app/lib/content-safety.ts` |
| Trends TR RSS + talep sinyalleri | `scripts/refresh-gundem-queue.ts`, `data/gundem-demand-signals.json` |
| Manuel CSV (KWP export) | `scripts/gundem-from-csv.mjs` |
| Yayın | `pnpm gundem:publish` → `publish-gundem.ts`, cron `.github/workflows/publish-gundem.yml` |
| Ölçüm | GTM `content_group=gundem` (`ContentGroupBeacon`); GSC `haberler` sitemap |
| İlk Blob / DoD | `scripts/seed-gundem-blob.ts`, `.github/workflows/seed-gundem-blob.yml` |

## Kuyruk JSON alanları

- `category`: `ekonomi` \| `siyaset` \| … \| `bilisim` \| `diger` (bilişim **isteğe bağlı** şerit).
- `angle`: Okur ve kamuoyu odaklı analiz sorusu (`GUNDEM_DEFAULT_ANGLE_PROMPT` ile hizalı).
- `trendQuery`: Trends/KWP sorgusu; konu yazılım dışı olabilir.

## Yapılmaz

- Sadece “yazılım ekibi / sprint / bulut” hattına kilitlenmek.
- Portföy `/blogs` veya ana sayfadan gündem linki (sızıntı testi: `scripts/assert-no-gundem-links.mjs`).

## Doğrulama

```bash
pnpm check:queues
pnpm test:e2e -- e2e/plan-seo-gundem.spec.ts
```
