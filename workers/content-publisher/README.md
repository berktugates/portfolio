# content-publisher Worker

Cloudflare cron: haber taraması (`7,22,37,52 * * * *` UTC), haftalık blog (`0 6 * * 1` UTC).

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

## Manuel tetik (opsiyonel)

`MANUAL_CRON_SECRET` secret + `POST /cron/haber` veya `/cron/blog` with `Authorization: Bearer …`.
