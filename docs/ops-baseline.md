# Operasyon baseline (Faz 0)

**Durum:** Otomatik kontroller `pnpm check:ops` + haftalık [Ops phase 0](https://github.com/berktugates/portfolio/actions/workflows/ops-phase0.yml). Snapshot: `docs/ops-baseline.snapshot.json` (`pnpm ops:collect`). Runbook: `docs/ops-phase0-runbook.md`.

## Faz 0 DoD

**Durum:** `pnpm check:ops` → 0 hata (blog kuyruğu ≥7, prod smoke, Vercel token CI’da).

| Kontrol | Otomasyon |
|---------|-----------|
| Prod sitemap / robots / haberler / gündem redirect | `scripts/lib/ops-probes.ts` |
| IndexNow public key | `data/indexnow-public.json` → `public/{key}.txt` |
| Gündem prod smoke | `pnpm gundem:smoke-prod` |
| Portfolio’da gündem sızıntısı yok | `scripts/assert-no-gundem-links.mjs` |
| Gereksiz Vercel build azaltma | `scripts/vercel-ignore-build.sh` |
| Deployment prune | `pnpm ops:prune-deployments` (+ `VERCEL_TOKEN`) |
| Blog kuyruk envanteri | uyarı 7 altı; runway hedef ≥9 (`content/blog-queue`) |

GSC/GA4 **rakamları** dashboard’dan; snapshot’ta property ID’leri referans.

## Vercel Deployment Storage

| Tarih | GB-Hours (30g) | Not |
|-------|----------------|-----|
| 2026-09-21 | **16.9 GB / 10 GB** (Hobby limit aşımı) | Prune + ignoreCommand; retention API’de `deploymentsToKeep: 10` |

**Otomasyon:** `pnpm ops:collect` → `vercel.retention` + deployment sayısı. Prune: `VERCEL_TOKEN` + `pnpm ops:prune-deployments --apply` (preview >24s, prod fazlalık).

**Konsol hedefi (API ile PATCH desteklenmiyor):** preview `expirationDays` 1, production `expirationDaysProduction` 5–10.

**Dashboard teyit (2026-10-24, Vercel → portfolio → Settings → Build and Deployment → Deployment Retention):**

| Tür | Süre | Not |
|-----|------|-----|
| Pre-Production | **1 day** | Kaydedildi |
| Production | **1 week** (~7 gün; 5–10 hedef aralığında) | Kaydedildi |
| Canceled / Errored | 30 days | Varsayılan; isteğe bağlı 1 güne indirilebilir |

`docs/ops-baseline.snapshot.json` → `vercel.retention` (ör. preview 1d / prod 7d); `VERCEL_TOKEN` (Full Account) ile `pnpm ops:collect`.

## Cloudflare (zone — repo dışı)

**2026-10-24 mimari teyit:** `berktugberke.com` ve `haberler.berktugberke.com` HTML yanıtları **`server: Vercel`**; apex yanıtında `cf-ray` yok → ana site HTML **turuncu bulut / zone cache kuralları / Early Hints** ile Vercel origin’i önünde proxy edilmiyor. Cloudflare rolü: **Turnstile**, **Workers** (yayıncı, GDS), **R2/D1**, DNS. Zone Speed / cache optimizasyonu R2 public URL veya ileride proxy değişirse anlamlı; Turnstile zaten aktif.

## Google Search Console (son 28 gün)

- Property: `sc-domain:berktugberke.com`
- Snapshot: `docs/gsc-performance-baseline.snapshot.json` (`pnpm ops:import-gsc-baseline` → merge)
- **2026-10-24 (28g UI export → baseline):** tıklama **7**, gösterim **183**, ort. TO **%3,8**, konum **11,3** (62 sorgu) — `docs/gsc-performance-baseline.snapshot.json`; `pnpm ops:import-gsc-baseline` / `pnpm ops:merge-gsc-demand`
- **API (opsiyonel):** GCP service account + Search Console kullanıcısı → `GSC_SERVICE_ACCOUNT_JSON` → `pnpm ops:fetch-gsc` (baseline otomatik güncellenir). GCP Console `gstatic` engeli varsa UI export + `pnpm ops:sync-gsc-baseline` yeterli.
- **3 ay UI genel bakış** export’tan farklı olabilir (17 tıklama / 553 gösterim); otomasyon **28g** export’a bağlı kalır.
- Haberler sitemap: `https://haberler.berktugberke.com/sitemap-gundem.xml`

**GSC İletiler + URL denetimi (2026-10-24):** İletiler çoğunlukla tarihsel (dizin, görsel meta, Ağu 2026 Profil “düzeltildi/doğrulanıyor”). `https://berktugberke.com/` URL denetimi: **Google’da**, dizine eklendi, HTTPS OK; zengin sonuç **Profil sayfası 1 geçerli öğe**. Prod schema probeleri temiz (`dateModified` apex Profil’de yok; blog ISO) → kalan Profil uyarıları büyük olasılıkla **gecikme / eski kayıt**.

## GA4 — manuel dashboard + otomasyon

- **Otomasyon (prod):** `pnpm check:measurement` → `dl-*` probeleri (`page_context`, `content_group` home/blog/hire/gundem; çift `gtag config` yok). **2026-10-24:** 0 error.
- Sayfa görüntüleme (28g, GA4 UI **2026-10-24**): **558** görüntüleme, **96** etkin kullanıcı
- Blog listesi (28g): **`/tr/blogs`** **22** görüntüleme, **4** etkin kullanıcı; EN `/blogs` ayrı path (locale ayrımı)
- `content_group` custom dimension: GA4 Admin’de kayıtlı (**2026-10-24**); event parametresi GTM v3 `page_context`

## Git içerik ritmi

`pnpm ops:collect` → `git.blogRelatedCommits90d` veya:

```bash
git log --since=90.days --oneline -- app/data/blogs.ts content/posts | wc -l
```

## Kuyruk

- `content/blog-queue/*.json` — hedef ≥7, `pnpm check:queues` zorunlu
- `content/gundem-queue` — CI `refresh-gundem-queue` (git’e yazılmaz)

## Faz 4 (gündem + blog içerik)

- **Yayın:** Cloudflare Worker `workers/content-publisher` — haber `7,22,37,52 * * * *` UTC. Blog GDS webhook + `0 */2 * * *` reconcile → R2. Git kuyruk GH `15 4 * * *` → R2 sync; Worker `0 9 * * *` UTC ≈ 12:00 TR yayın (`source: queue`, 7 dil). GH deploy etmez; `pnpm check:blog-queue-r2` CDN parity.
- **Depo:** R2 `portfolio-content` → Vercel `CONTENT_PUBLIC_BASE_URL`.
- **Manuel seed:** `pnpm gundem:seed-r2` / doğrulama `pnpm gundem:verify-r2` (GitHub: Seed gundem R2 workflow).
- GitHub zamanlı `publish-gundem` **kapalı** (`workflow_dispatch`). Blog **iki ayrı hat:** (1) **GDS → Worker → R2** webhook/cron; (2) **git kuyruk** → `weekly-seo-blog.yml` R2 sync + CDN verify → Worker cron **`0 9 * * *` UTC** `blog-queue-cron`.
- Detay: `docs/gundem-editorial.md`.

## Faz 5 (ölçüm) — GTM / GSC / GA4

**DoD:** `pnpm check:measurement` (GTM çift tag yok, llms, sitemap sayıları). Detay: `docs/faz-5-measurement.md`.

GSC Performance export → `data/gsc-performance-export.json` (örnek: `.example.json`) → `pnpm ops:merge-gsc-demand`.

## IndexNow

- Manifest: `data/indexnow-public.json` (hex key, IndexNow spec)
- Env: `INDEXNOW_KEY` = manifest `key`; Worker + Vercel + GitHub secrets aligned

## Vercel env

| Değişken | Amaç |
|----------|------|
| `REVALIDATE_SECRET` | `/api/revalidate` |
| `CONTENT_PUBLIC_BASE_URL` | R2 public JSON base (gundem + blogs) |
| `REVALIDATE_URL` | `https://berktugberke.com/api/revalidate` |
| `R2_*` | Yerel/CI seed (Worker’da bucket binding) |
| `VERCEL_TOKEN` | Ops prune + deployment metrics (GitHub secret) |
| `MANUAL_CRON_SECRET` | Worker cron/ops (`check:gds-ops` → `/ops/growthdaily`, `check:content-ops` → `/ops/content`) |
| `GITHUB_DISPATCH_TOKEN` | Worker secret → `repository_dispatch` `blog-published` → `blog-post-publish.yml` |
| `CLOUDFLARE_API_TOKEN` | GitHub → `deploy-content-publisher.yml` (Workers deploy) |
| `GSC_SERVICE_ACCOUNT_JSON` | `pnpm ops:gsc-sync` (yoksa baseline export + merge) |

## Periyodik / yerel ops

| Komut | Sıklık | Not |
|-------|--------|-----|
| `pnpm ops:periodic-report` | İsteğe bağlı | Secret env özeti (WARN = beklenen yerel boşluk) |
| `pnpm ops:gsc-sync` | Haftalık (CI ops-phase0) | GSC API veya `docs/gsc-performance-baseline.snapshot.json` → `data/gundem-demand-signals.json` |
| `pnpm ops:collect` | Haftalık | `VERCEL_TOKEN` ile retention snapshot güncellenir |
| `pnpm ops:prune-deployments` | Aylık / limit | `--apply` yalnızca token ile |
| `pnpm check:gds-ops` | Günlük cap / GDS | `MANUAL_CRON_SECRET` yoksa ops API atlanır (WARN) |
| `pnpm verify:prod` | Release öncesi | `gundem:verify-r2` index adımı `CONTENT_PUBLIC_BASE_URL` yoksa **skip (OK)** |

Yerel ops env: `scripts/lib/load-ops-env.ts` — `.env.local` + opsiyonel **`pnpm ops:env-pull`** → `.env.vercel.local` (`CONTENT_PUBLIC_BASE_URL`); `.vercel/project.json` → `VERCEL_PROJECT_*`. Tam yerel kapasite: `VERCEL_TOKEN`, `MANUAL_CRON_SECRET` (Worker ile aynı), `GSC_SERVICE_ACCOUNT_JSON` → `.env.local` veya GitHub secrets.

| Komut | Amaç |
|-------|------|
| `pnpm check:ops-secrets` | Secret env özeti; CI’da `VERCEL_TOKEN` + `CONTENT_PUBLIC_BASE_URL` zorunlu |
| `pnpm ops:verify-local` | env-pull + `verify:prod` (R2 index dahil) |
| `pnpm ops:gsc-sync` | Canlı GSC fetch veya baseline import + demand merge |

GitHub secrets (2026-10-24): **`MANUAL_CRON_SECRET`** ✓, **`VERCEL_*`** ✓ (Full Account token). **`GSC_SERVICE_ACCOUNT_JSON`**: henüz yok (GCP Console `gstatic` / SA kurulumu); haftalık CI **`docs/gsc-performance-baseline.snapshot.json`** + demand merge ile devam. Canlı API: SA → GSC kullanıcı → `gh secret set GSC_SERVICE_ACCOUNT_JSON`.

## Ürün sürekliliği (beklenen davranış)

| Konu | Otomasyon | Not |
|------|-----------|-----|
| **sitemap-gundem.xml (48h)** | `gundem-sitemap-index` probe | Sık **0 loc** normal; geçer sayılması için `haberler…/sitemap.xml` **≥10** loc fallback (`scripts/lib/gundem-sitemap-probe.ts`) |
| **Git blog kuyruk** | `check:ops` | GDS → R2 günlük kanonik; git `content/blog-queue` **≥7** bakım (runway **≥9** uyarı). `weekly-seo-blog.yml` yalnız `workflow_dispatch`. |
| **GDS cap regression slug’ları** | `check:gds-ops` + `gds-prod-fixtures.ts` | Yeni yayın / cap günü değişince **`pnpm gds:sync-fixtures`** (D1 → fixtures). Özet: **`pnpm ops:periodic-report`**. |

## Faz C — GDS mimari (2026-10-24 teyit)

| Madde | DoD |
|-------|-----|
| **isolate-actions** | `weekly-seo-blog.yml` yalnız `workflow_dispatch`; günlük blog Worker → R2. Git kuyruk dosyaları GDS ile karışmıyor. |
| **daily-cap** | `GROWTHDAILY_DAILY_PUBLISH_CAP=1`, D1 `growthdaily_daily_publish` + `growthdaily_deferred`, webhook + `0 */2` reconcile + `15 4 * * *` (Istanbul). |
| **ship-renderer** | `blog-detail` → `contentHtml` (R2); git overlay ayrı. Prod: `pnpm check:gds-ops` (yayın 200, cap slug 404). |
| **Index hreflang** | Blog liste sayfaları yalnız EN+TR kardeşi olan yazıları listeler (`shouldListOnBlogIndex`); R2 kısmi dil indeks kaymasını önler. |

## Faz D — schema / GSC (2026-10-24 teyit)

| Madde | DoD |
|-------|-----|
| **ISO BlogPosting** | `toSchemaDateTime` (Next) + Worker `isoDate()`; prod git + GDS slug probeleri. |
| **ProfilePage** | Apex `ProfilePage` **dateModified yok** (`schema-home-profile`). |
| **GSC URL denetimi** | `docs/gsc-url-inspection.snapshot.json` — apex, hire, git + GDS blog; canlı HTML probeleri kanonik. |
| **Otomasyon** | `pnpm check:schema-gsc` veya `pnpm check:measurement` (schema + snapshot dahil). |

GSC İletiler’deki tarihsel Profil `dateModified` uyarısı prod HTML temiz olsa da **gecikmeli** kaybolabilir; yeni sorun için URL denetimi → canlı test + probeleri yenile.

## Faz E — GTM/GA4, CF/Vercel, E2E (2026-10-24 teyit)

| Madde | DoD |
|-------|-----|
| **gtm-ga** | GTM-only (`GTM-K2PXS8ZC`); `page_context` + `content_group` (home/blog/hire/gundem); `gtm-no-double-config`. |
| **cf-vercel** | Apex/haberler **server=Vercel**, apex’te **cf-ray yok**; `/_next/static` uzun cache; IndexNow kök dosya. `docs/cf-vercel.snapshot.json`. |
| **e2e-verify** | `pnpm test:e2e:prod` (prod smoke, SEO program, gündem, GDS blog); CI `e2e-prod-smoke.yml`. |
| **Otomasyon** | `pnpm check:faz-e`; release: `pnpm verify:prod`. |

Apex DNS doğrudan Vercel → zone Early Hints / turuncu bulut HTML için **bilinçli uygulanmıyor**; CF rolü Workers, R2, Turnstile, DNS.
