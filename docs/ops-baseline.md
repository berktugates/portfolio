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

- `content/blog-queue/*.json` sayısı: _
- `content/gundem-queue/*.json` sayısı: _

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
