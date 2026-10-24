# E2E matrisi

```bash
pnpm test:e2e:local    # localhost dev server; @prod suite hariç
pnpm test:e2e:prod     # berktugberke.com; @local client-locale testleri hariç
pnpm test:e2e          # tüm spec'ler (yerel sunucu + prod URL probeleri)
```

| Spec | Kapsam |
|------|--------|
| `prod-smoke.spec.ts` | **@prod** — GUN-0 redirect, haberler 200, sitemap/robots |
| `plan-seo-gundem.spec.ts` | Gündem sızıntısı, haberler yüzeyi, RSS/sitemap, GTM `content_group` |
| `seo-program.spec.ts` | RFC dil/şema/sitemap; `@local` = apex client locale bootstrap |

**GUN-0:** `plan-seo-gundem` + `prod-smoke` — her zaman `https://berktugberke.com/gundem` (CI/local simetrisi). `check:ops` ile aynı invariant.

**CI:** `.github/workflows/e2e-prod-smoke.yml` — haftalık `pnpm test:e2e:prod` (Pazartesi 06:00 UTC). `ops-phase0.yml` içinde `check:measurement` ayrıca koşar.

Faz 5: GTM-1 beacon `dataLayer` `content_group=gundem` on `/gundem` (local) veya haberler redirect (prod base URL).
