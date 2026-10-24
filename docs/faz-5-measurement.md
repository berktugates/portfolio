# Faz 5 — Ölçüm (GTM / GA4 / GSC)

**Amaç:** Tag’lerin prod’da doğru yüklendiğini, sitemap/llms/geo yüzeylerinin hizalı olduğunu ve (opsiyonel) GSC export’un gündem talep sinyallerine aktığını doğrulamak.

## Otomasyon

| Komut | Ne yapar |
|--------|-----------|
| `pnpm check:measurement` | Prod GTM (çift tag yok), llms, sitemap, JSON-LD probeleri, **Playwright `page_context`** |
| `pnpm ops:fetch-gsc` | Search Console API → `data/gsc-performance-export.json` (`GSC_SERVICE_ACCOUNT_JSON`) |
| `pnpm ops:merge-gsc-demand` | `data/gsc-performance-export.json` → `gundem-demand-signals.json` |
| `pnpm ops:gsc-sync` | fetch + merge |
| `pnpm ops:sync-gsc-baseline` | `data/gsc-performance-export.json` → committed baseline snapshot |
| `pnpm ops:import-gsc-baseline` | `docs/gsc-performance-baseline.snapshot.json` → export + merge |
| `pnpm verify:prod` | ops + measurement + queues + gundem smoke |
| `pnpm ops:collect` | Snapshot’a `measurement` bloğu ekler |

## GSC export (manuel veya API)

1. Search Console → Performance → Export → JSON’u `data/gsc-performance-export.json` olarak kaydet (örnek: `data/gsc-performance-export.example.json`).
2. `pnpm ops:merge-gsc-demand` çalıştır.
3. Commit **isteğe bağlı** (hassas rakamlar içeriyorsa commit etmeyin; sadece CI secret veya yerel dosya).

## DoD

| ID | Kriter | Otomasyon |
|----|--------|-----------|
| M5-1 | Ana site + `/blogs` + haberler host’ta GTM, doğrudan gtag yok | `check:measurement` |
| M5-2 | `llms.txt` haberler gündemini cite eder | `check:measurement` |
| M5-3 | Ana sitemap ≥50 URL; haberler sitemap ≥4 | `check:measurement` |
| M5-4 | GSC export (opsiyonel uyarı) | `data/gsc-performance-export.json` |
| M5-5 | `page_context` / `content_group` (home, blog, hire, haberler) | `check:measurement` → `scripts/lib/datalayer-probes.ts` |
| M5-6 | E2E GTM `content_group` + prod smoke | `pnpm test:e2e:prod` (CI: `e2e-prod-smoke.yml`); yerel GTM: `pnpm test:e2e -- e2e/plan-seo-gundem.spec.ts -g GTM-1` |

## CI

`.github/workflows/ops-phase0.yml` → `pnpm check:measurement` (Faz 0 ile aynı haftalık job).
