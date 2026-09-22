# Operasyon baseline (Faz 0)

**Durum:** Otomatik kontroller `pnpm check:ops` + haftalık [Ops phase 0](https://github.com/berktugates/portfolio/actions/workflows/ops-phase0.yml). Snapshot: `docs/ops-baseline.snapshot.json` (`pnpm ops:collect`). Runbook: `docs/ops-phase0-runbook.md`.

## Faz 0 DoD

**Durum:** `pnpm check:ops` → 0 hata (blog kuyruğu ≥7, prod smoke, Vercel token CI’da).

| Kontrol | Otomasyon |
|---------|-----------|
| Prod sitemap / robots / haberler / gündem redirect | `scripts/lib/ops-probes.ts` |
| IndexNow public key | `public/bberke2026indexnowkey.txt` |
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

## Google Search Console (son 28 gün)

- Property: `sc-domain:berktugberke.com`
- Snapshot: `docs/gsc-performance-baseline.snapshot.json` (`pnpm ops:import-gsc-baseline` → merge)
- **2026-09-22:** tıklama **7**, gösterim **329**, ort. TO **%2,1**, konum **44,2** (46 sorgu satırı)
- Haberler sitemap: `https://haberler.berktugberke.com/sitemap-gundem.xml`

## GA4 — manuel

- Sayfa görüntüleme (28g): _
- `/blogs` landing oturumları: _
- `content_group=gundem` (GTM): haberler host

## Git içerik ritmi

`pnpm ops:collect` → `git.blogRelatedCommits90d` veya:

```bash
git log --since=90.days --oneline -- app/data/blogs.ts content/posts | wc -l
```

## Kuyruk

- `content/blog-queue/*.json` — hedef ≥7, `pnpm check:queues` zorunlu
- `content/gundem-queue` — CI `refresh-gundem-queue` (git’e yazılmaz)

## Faz 4 (gündem) — kapalı

Günlük cron: **Publish gundem briefing** 07:00 UTC. Detay: `docs/gundem-editorial.md`.

## Faz 5 (ölçüm) — GTM / GSC / GA4

**DoD:** `pnpm check:measurement` (GTM çift tag yok, llms, sitemap sayıları). Detay: `docs/faz-5-measurement.md`.

GSC Performance export → `data/gsc-performance-export.json` (örnek: `.example.json`) → `pnpm ops:merge-gsc-demand`.

## IndexNow

- Key: `public/bberke2026indexnowkey.txt`
- Env: `INDEXNOW_KEY=bberke2026indexnowkey`

## Vercel env

| Değişken | Amaç |
|----------|------|
| `REVALIDATE_SECRET` | `/api/revalidate` |
| `BLOB_READ_WRITE_TOKEN` | Gündem/blog Blob |
| `BLOB_PUBLIC_BASE_URL` | Blob JSON base |
| `REVALIDATE_URL` | `https://berktugberke.com/api/revalidate` |
| `VERCEL_TOKEN` | Ops prune + deployment metrics (GitHub secret) |
