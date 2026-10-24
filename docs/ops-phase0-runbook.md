# Faz 0 runbook (operasyon)

Otomasyon: `pnpm check:ops`, `pnpm ops:collect`, `pnpm ops:prune-deployments`, `pnpm ops:gsc-sync`, `pnpm ops:periodic-report`.

Yerel env: `.env.local` (`VERCEL_TOKEN`, `MANUAL_CRON_SECRET`, `CONTENT_PUBLIC_BASE_URL`, `GSC_SERVICE_ACCOUNT_JSON`). Özet: `pnpm ops:periodic-report`.

## Vercel (Deployment Storage)

| Adım | Nerede | Hedef |
|------|--------|--------|
| Retention | Project → Settings → Deployment Retention | Production **5–10 gün**, Preview **1 gün** |
| Spend alert | Team → Settings → Billing → Spend Management | Deployment Storage **%70** |
| Prune | CI veya yerel | `VERCEL_TOKEN` + `pnpm ops:prune-deployments --apply` |
| Gereksiz build | `vercel.json` → `ignoreCommand` | Sadece feed/ops snapshot push’larında build atlanır |

`VERCEL_TOKEN`: [Vercel Account Tokens](https://vercel.com/account/tokens) → GitHub secret `VERCEL_TOKEN` (ops workflow).

## Google Search Console

- Property: `sc-domain:berktugberke.com`
- Sitemap: `https://berktugberke.com/sitemap.xml`, `https://haberler.berktugberke.com/sitemap-gundem.xml`
- 28 günlük tıklama/gösterim rakamlarını `docs/ops-baseline.md` tablosuna elle işleyin (API anahtarı opsiyonel sonraki faz).

### GSC → gündem talep sinyalleri (Faz 5)

**Otomatik (önerilen):** GCP service account → Search Console’da `sc-domain:berktugberke.com` için **Tam** veya **Kısıtlı** erişim → JSON’u GitHub secret `GSC_SERVICE_ACCOUNT_JSON`. Haftalık ops job: `pnpm ops:gsc-sync` (fetch + merge).

**Yerel:** `pnpm ops:gsc-sync` (aynı env) veya manuel export → `data/gsc-performance-export.json` → `pnpm ops:merge-gsc-demand`.

`data/gsc-performance-export.json` gitignore; `pnpm check:measurement` dosya yoksa uyarı verir (CI’da secret yoksa beklenen).

## GA4 / GTM

- Container: `GTM-K2PXS8ZC` (canlı)
- GA4: `G-5H6GDB1CRH`
- Haberler: `content_group=gundem` (`ContentGroupBeacon`)

## Blog kuyruğu

- Hedef: **≥7** `content/blog-queue/*.json` ( `pnpm check:queues` geçmeli)
- Git blog kuyruk (manuel): `.github/workflows/weekly-seo-blog.yml` — zamanlanmış cron yok; GDS → R2 günlük

## GrowthDailySEO (site yayını)

- **Kanonik sayaç:** D1 `growthdaily_daily_publish` (Istanbul günü) + prod URL **200** — GDS Faturalama “Bugün yayınlanan” ayrı ürün sayacı olabilir.
- **Audit:** `growthdaily_ingest`, `published_slugs`, cap erteleme `growthdaily_deferred` (reason `daily-publish-cap`).
- **Webhook:** `article.ready` / `published` / `updated` → Worker; GDS **Yayınla** her zaman webhook göndermeyebilir → yedek: cron `0 */2 * * *` reconcile + `15 4 * * *`.
- **Gündem news sitemap:** `sitemap-gundem.xml` yalnız **son 48 saat** (boş olabilir); kalıcı indeks `https://haberler.berktugberke.com/sitemap.xml`. Check’ler: `news48h ≥ 1` **veya** `haberMain ≥ 10`.
- **Prod regression slug’ları:** `pnpm gds:sync-fixtures` (D1 → `app/lib/gds-prod-fixtures.ts`) veya `pnpm check:gds-ops`.
- **Ops API:** `GET https://berktug-content-publisher.berktugates.workers.dev/ops/growthdaily` + `Authorization: Bearer $MANUAL_CRON_SECRET`.
- **Reconcile (manuel):** `POST …/cron/growthdaily` aynı bearer; veya `GDS_RECONCILE=1 pnpm check:gds-ops`.
- **IndexNow (GDS Entegrasyonlar):** `data/indexnow-public.json` — **hex** anahtar; host `berktugberke.com` (www değil); doğrulama `https://berktugberke.com/{key}.txt`. Eski `bberke2026indexnowkey` geçersizdi (IndexNow hex kuralı). Worker/Vercel/GitHub `INDEXNOW_KEY` secret’ını yeni key ile güncelle.

## Doğrulama

```bash
pnpm ops:collect
pnpm check:ops
pnpm gundem:smoke-prod
```

Faz 0 CI: `.github/workflows/ops-phase0.yml`
