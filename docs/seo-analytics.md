# Analytics & Search Console (staff setup)

Prefer **one** client-side tag path to avoid double-counting:

| Variable | Where | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_GTM_ID` | Vercel Production | Google Tag Manager container (`GTM-XXXX`). Load GA4 **inside** GTM. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Vercel Production | Direct GA4 (`G-XXXX`) only if GTM is **not** set. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Vercel Production | Google Search Console HTML-tag verification token. |

## Live setup (2026-09)

| Item | Value / status |
|------|----------------|
| GTM container | `GTM-K2PXS8ZC` (Web, account Berktug Berke Ates) |
| Vercel | `NEXT_PUBLIC_GTM_ID=GTM-K2PXS8ZC` on Production + Preview |
| GSC | Domain property `sc-domain:berktugberke.com` (already present) |
| GA4 | Create property → wire **GA4 Configuration** tag inside GTM → Publish workspace |
| Redeploy | Required after env add so static export embeds GTM |

## Recommended path (GTM + GA4 + GSC)

1. **GA4** — [analytics.google.com](https://analytics.google.com) → Admin → Create GA4 property for `berktugberke.com` → copy Measurement ID (`G-…`).
2. **GTM** — container already created (`GTM-K2PXS8ZC`). Add tag **Google Analytics: GA4 Configuration** → Measurement ID → Trigger **All Pages** → **Submit** / Publish.
3. **Search Console** — Domain property is preferred (DNS). Optional HTML-tag token → `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
4. GSC → Sitemaps → submit `https://berktugberke.com/sitemap.xml`.
5. After env changes on Vercel → Redeploy Production.

## Daily SEO blogs

- Queue: `content/blog-queue/YYYY-MM-DD-slug.json`
- Cron: `.github/workflows/daily-seo-blog.yml` (`0 6 * * *` UTC ≈ 09:00 Istanbul)
- Manual: `pnpm blog:publish:dry` / `pnpm blog:publish`
- Keep **≥ 7–14** queued days so the cron never exits empty.

Optional GitHub secret: `BLOG_PUBLISH_TOKEN` (PAT with `contents: write`) if `main` is branch-protected.
