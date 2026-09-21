# Faz 0 runbook (operasyon)

Otomasyon: `pnpm check:ops`, `pnpm ops:collect`, `pnpm ops:prune-deployments`.

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

## GA4 / GTM

- Container: `GTM-K2PXS8ZC` (canlı)
- GA4: `G-5H6GDB1CRH`
- Haberler: `content_group=gundem` (`ContentGroupBeacon`)

## Blog kuyruğu

- Hedef: **≥7** `content/blog-queue/*.json` ( `pnpm check:queues` geçmeli)
- Haftalık yayın: `.github/workflows/weekly-seo-blog.yml`

## Doğrulama

```bash
pnpm ops:collect
pnpm check:ops
pnpm gundem:smoke-prod
```

Faz 0 CI: `.github/workflows/ops-phase0.yml`
