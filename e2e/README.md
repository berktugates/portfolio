# E2E matrisi

```bash
pnpm test:e2e
pnpm test:e2e -- e2e/plan-seo-gundem.spec.ts
```

| Spec | Kapsam |
|------|--------|
| `plan-seo-gundem.spec.ts` | Gündem sızıntısı, haberler yüzeyi, RSS/sitemap, GTM `content_group` |
| `site-assistant.spec.ts` | Hire/blog asistan dock |

Prod-only: `GUN-0` (`berktugberke.com/gundem` → haberler) yalnızca `CI=true`.

Faz 5: GTM-1 beacon `dataLayer` `content_group=gundem` on `/gundem`.
