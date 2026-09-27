# content-publisher Worker

Cloudflare cron: günlük haber (`0 4 * * *` UTC), haftalık blog (`0 6 * * 1` UTC).

## İlk kurulum

```bash
cd workers/content-publisher
pnpm wrangler d1 create content-meta
# wrangler.toml içindeki database_id güncelle
pnpm wrangler r2 bucket create portfolio-content
pnpm wrangler secret put REVALIDATE_SECRET
pnpm wrangler deploy
```

R2 public URL veya Worker proxy → Vercel `CONTENT_PUBLIC_BASE_URL`. Bir kerelik seed: repo kökünde `pnpm gundem:seed-r2`.

## Manuel tetik (opsiyonel)

`MANUAL_CRON_SECRET` secret + `POST /cron/haber` veya `/cron/blog` with `Authorization: Bearer …`.
