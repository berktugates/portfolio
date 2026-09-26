# Yönlendirme kütüğü

Yeni 301 / 308 / 410 bu tabloya satır eklemeden birleşmez. 302 kullanılmaz.

| Kaynak | Hedef | Kod | Nerede | Durum |
| --- | --- | --- | --- | --- |
| `www.berktugberke.com` + path | `https://berktugberke.com` + aynı path | 308 | `middleware.ts` | 2026-09-26 kod. Prod, deploy sonrası `curl -I` ile doğrulanır. |
| `/gundem` ve altı | `https://haberler.berktugberke.com` + sonek | 308 | `middleware.ts`, yalnız `VERCEL_ENV=production` | 2026-09-26 prod: `/gundem` → `https://haberler.berktugberke.com/` |
| `/sitemap-gundem.xml` | `https://haberler.berktugberke.com/sitemap.xml` | 308 | aynı | 2026-09-26 prod doğrulandı |
| `/tr/` | `/tr` | 308 | Next / Vercel, `trailingSlash` kapalı | 2026-09-26 prod doğrulandı |
| `/` → `/tr` | istemci `location.replace` | HTTP değil | `LOCALE_REDIRECT_SCRIPT` | Politika satırı. HTTP kütüğüne yazılmaz. |

Geri alma: ilgili middleware dalını kaldıran commit. Statik taşınacak veri yok.
