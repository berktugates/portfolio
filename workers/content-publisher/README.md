# content-publisher Worker

Cloudflare cron: haber taraması (`7,22,37,52 * * * *` UTC), GrowthDailySEO reconcile (`0 */2 * * *` UTC), GrowthDailySEO günlük seçim (`15 4 * * *` UTC ≈ 07:15 Europe/Istanbul).

GrowthDailySEO: `POST /webhooks/growthdaily` (HMAC), secret'lar `GROWTHDAILY_WEBHOOK_SECRET`, `GROWTHDAILY_API_KEY`, `GROWTHDAILY_SITE_ID`.

UI: Entegrasyonlar → `/app/{orgSlug}/{siteSlug}/integrations` (webhook). API → `/app/{orgSlug}/{siteSlug}/api` (site UUID + `fig_live_` key). Worker yalnızca GDS'de **yayınlanmış / onaylı** (`status=published` veya `reviewStatus=approved`) EN yazılarını berktugberke.com'a alır; 2 saatlik reconcile onayı kaçırmaz.

### GrowthDailySEO günlük yayın kotası

- `GROWTHDAILY_DAILY_PUBLISH_CAP` (wrangler `[vars]`, varsayılan **1**; `0` = yayın duraklatılır; geçersiz değer → 1). Gün = `Europe/Istanbul` takvim günü; sayaç D1 `growthdaily_daily_publish` (migration `0021_growthdaily_daily_cap.sql`: `wrangler d1 migrations apply content-meta --remote`).
- Kota doluyken yeni yazı R2'ye yazılmaz: ingest `{ ok: true, skipped: true, reason: "daily-publish-cap" }` döner (webhook yanıtında da `reason`). Zaten yayınlanmış yazının güncellemesi (`updated`) kotayı tüketmez.
- Webhook (`article.ready|published|updated`), 2 saatlik reconcile ve sabah cron aynı cap fonksiyonundan geçer. Reconcile adayları `qualityBand` (premium > standard > review), eşitlikte en yeni `updatedAt` sırasıyla işler; kota dolunca kalanlar ertesi güne kalır (sync cursor ertelenen yazının önüne ilerlemez).
- Webhook ilk gelen onaylı yazıyı basar; "en iyi" seçimi cron/reconcile'da yapılır.

## İlk kurulum

```bash
cd workers/content-publisher
pnpm wrangler d1 create content-meta
# wrangler.toml içindeki database_id güncelle
pnpm wrangler r2 bucket create portfolio-content
pnpm wrangler secret put REVALIDATE_SECRET
pnpm wrangler secret put TURNSTILE_SECRET_KEY
pnpm wrangler secret put CORRECTION_INGEST_SECRET
pnpm wrangler deploy
```

R2 public URL veya Worker proxy → Vercel `CONTENT_PUBLIC_BASE_URL`. Bir kerelik seed: repo kökünde `pnpm gundem:seed-r2`.

`NEWS_AUTO_PUBLISH` ve `PUBLICATION_LEGAL_READY` varsayılan olarak `false` kalır. Cloudflare Access üzerinde `editor.haberler.berktugberke.com` için yalnız izinli e-posta politikası tanımlanır; `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` ve `EDITOR_EMAIL` secret/var değerleri daha sonra eklenir. Künye alanları ve hukuk kontrolü tamamlanmadan iki anahtar da açılmaz.

## Otomasyon (GitHub)

- `deploy-content-publisher.yml` — push `workers/content-publisher/**` → `wrangler deploy` (secret: `CLOUDFLARE_API_TOKEN`).
- Worker `GITHUB_DISPATCH_TOKEN` (fine-grained PAT: Actions + Contents) + `[vars] GITHUB_REPOSITORY` → `repository_dispatch` `blog-published` → `blog-post-publish.yml` (Buttondown + slug smoke).

```bash
pnpm wrangler secret put GITHUB_DISPATCH_TOKEN
```

## Manuel tetik (opsiyonel)

`MANUAL_CRON_SECRET` secret + `POST /cron/haber`, `/cron/blog`, veya `/cron/growthdaily` with `Authorization: Bearer …`.

`POST /cron/growthdaily` aynı cap-aware reconcile'ı çalıştırır (2 saatlik / sabah cron ile aynı kod); yanıt: `{ "processed": n, "deferredByCap": m }`.

```bash
curl -X POST https://berktug-content-publisher.<account>.workers.dev/cron/growthdaily \
  -H "Authorization: Bearer $MANUAL_CRON_SECRET"
```
