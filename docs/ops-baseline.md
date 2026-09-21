# Operasyon baseline (Faz 0)

Bu dosya Vercel/GSC/GA4 ölçümlerinin elle doldurulması için şablondur. Agent otomatik erişemez.

## Vercel Deployment Storage (son 30 gün)

| Tarih | GB-Hours (30g) | Not |
|-------|----------------|-----|
| 2026-09-21 | **16.9 GB / 10 GB** (Hobby limit aşımı) | Vercel team Usage; export+retention sonrası düşmeli |

Son 10 production deployment artifact boyutu (Deployments → …):

1. _MB_ — _commit_
2. …

**Hedef (plan):** İçerik yayınları günlük full export deploy tetiklemesin; retention production 5–10, preview 1 gün.

## Google Search Console (son 28 gün)

- Property: `sc-domain:berktugberke.com`
- Toplam tıklama: _
- Toplam gösterim: _
- `/blogs/*` tıklama: _
- `/hire` tıklama: _

## GA4

- Sayfa görüntüleme (28g): _
- `/blogs` landing oturumları: _

## Git içerik ritmi

```bash
git log --since=90.days --oneline -- app/data/blogs.ts | wc -l
```

- Son 90 günde `blogs.ts` commit sayısı: _

## Kuyruk

- `content/blog-queue/*.json` sayısı: 0 (2026-09-21)
- `content/gundem-queue/*.json` sayısı: 0 (2026-09-21; boş kuyruk → `publish-gundem` exit 0)

**CI:** [Publish gundem briefing](https://github.com/berktugates/portfolio/actions/workflows/publish-gundem.yml) — `workflow_dispatch` doğrulandı (Run #35653676497, success).

## Haberler editöryal kapsam

- **Kitle:** Türkiye geneli; yalnızca bilişim profesyonelleri değil.
- **Konular:** Ekonomi, siyaset, toplum, sağlık, spor, kültür, bilim, bilişim (eşit şeritler).
- **Biçim:** Gündem + kısa analiz; Trends/KWP ile talep odaklı konu seçimi.
- **Dokümantasyon:** `docs/gundem-editorial.md`, kod: `app/lib/gundem/editorial.ts`.

## Faz 4 (gündem uçtan uca)

| DoD | Durum |
|-----|--------|
| T4-01…04,07,09,11,14,27 (E2E) | `pnpm test:e2e` — plan-seo-gundem |
| 1 gerçek brifing **prod Blob** | `Seed gundem Blob` workflow + `pnpm gundem:verify-blob` |
| Kuyruk → publish | `content/gundem-queue/*.json` + `publish-gundem` (idempotent skip) |

İlk Blob seed: Actions → **Seed gundem Blob (Faz 4)** → Run workflow.

## IndexNow (repo’da hazır)

- Key dosyası: `public/bberke2026indexnowkey.txt`
- Production env: `INDEXNOW_KEY=bberke2026indexnowkey`
- GitHub secret: aynı değer (`publish-gundem` workflow)

## Vercel env (deploy sonrası)

| Değişken | Amaç |
|----------|------|
| `REVALIDATE_SECRET` | `/api/revalidate` bearer |
| `BLOB_READ_WRITE_TOKEN` | Gündem/blog Blob yazımı |
| `BLOB_PUBLIC_BASE_URL` | Blob JSON public base |
| `REVALIDATE_URL` | `https://berktugberke.com/api/revalidate` |

## Dashboard aksiyonları (manuel)

1. Vercel → Settings → Deployment Retention (production 5–10, preview 1 gün).
2. Eski production deployment’ları sil (14g+).
3. Spend alert: Deployment Storage %70.
4. GSC → Sitemaps: `https://berktugberke.com/sitemap.xml`, `https://haberler.berktugberke.com/sitemap.xml`, blog RSS.
5. Vercel → Domains: `haberler.berktugberke.com` (Cloudflare CNAME → `*.vercel-dns-*.com`, DNS only önerilir).
