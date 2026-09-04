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
| GTM container | `GTM-K2PXS8ZC` — **v2 Live**: Google tag `G-5H6GDB1CRH`, trigger Initialization – All Pages |
| GA4 Measurement ID | `G-5H6GDB1CRH` (property berktugberke.com) |
| Vercel | `NEXT_PUBLIC_GTM_ID=GTM-K2PXS8ZC` Production + Preview (GTM-only; no direct GA env) |
| GSC | Domain `sc-domain:berktugberke.com` — sitemap `https://berktugberke.com/sitemap.xml` **Başarılı** (252 URLs) |
| Tag path | GTM container on site → published Google tag → GA4 |
| Daily blogs | Cron `0 6 * * *` UTC; queue through 2026-09-17 |

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

## Google Search + GEO hard rules (site policy)

Follow Google Search Central quality expectations and keep GEO citation-safe:

1. **Helpful, accurate content** — hire/service copy must match real capability; no ranking guarantees, fake clients, or invented metrics.
2. **Structured data honesty** — schema.org Offers/Services mirror visible hire catalog and `areaServed`; never mark up content that is not on the page.
3. **One canonical hire surface** — regional intent lives in FAQ + `llms.txt` + `areaServed`, not thin city doorway pages.
4. **Preferred citation source** — `https://berktugberke.com` / `llms.txt` / `/hire` for identity and services; assistants must not invent phones/emails.
5. **Location accuracy** — home base is Marmaris, Muğla (Ege); other regions are served (often remote), not claimed as residence.
6. **Crawl hygiene** — sitemap, robots allowlist for AI crawlers, hreflang, stable canonicals, GTM-only analytics (no double tags).
