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
| GTM container | `GTM-K2PXS8ZC` — **v3 Live** (2026-10-24): Google tag `G-5H6GDB1CRH` + GA4 event `page_context` (`content_group`, `page_locale`, `page_path`) |
| GA4 Measurement ID | `G-5H6GDB1CRH` (property berktugberke.com) |
| Vercel | `NEXT_PUBLIC_GTM_ID=GTM-K2PXS8ZC` Production + Preview (GTM-only; no direct GA env) |
| GSC | Domain `sc-domain:berktugberke.com` — sitemap `https://berktugberke.com/sitemap.xml` **Başarılı** (252 URLs) |
| Tag path | GTM container on site → published Google tag → GA4 |
| Daily blogs | Cron `0 6 * * *` UTC; queue through 2026-09-17 |

## Recommended path (GTM + GA4 + GSC)

1. **GA4** — [analytics.google.com](https://analytics.google.com) → Admin → Create GA4 property for `berktugberke.com` → copy Measurement ID (`G-…`).
2. **GTM** — container already created (`GTM-K2PXS8ZC`). Add tag **Google Analytics: GA4 Configuration** → Measurement ID → Trigger **All Pages** → **Submit** / Publish.
3. **Search Console** — Domain property is preferred (DNS). Optional HTML-tag token → `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
4. GSC → Sitemaps → submit `https://berktugberke.com/sitemap.xml` ve `https://haberler.berktugberke.com/sitemap-gundem.xml` (veya ana sitemap üzerinden gündem URL’leri).
5. GTM → GA4 event: `page_context` (`ContentGroupBeacon`, GTM-only; ikinci GA env yok) — `content_group` = `blog` (`/blogs…`) | `gundem` (haberler host, `/gundem…`) | `hire` (`/hire…`) | `other`; ayrıca `page_locale`, `page_path`. Locale önekleri (`/tr/blogs`) dikkate alınmaz. GTM’de Custom Event `page_context` trigger + Data Layer Variable `content_group`, GA4 event parametresi olarak ekle.
6. After env changes on Vercel → Redeploy Production.

## Structured data dates

`BlogPosting` `datePublished` / `dateModified` must be full ISO-8601 UTC datetimes (e.g. `2026-10-20T12:00:00.000Z`), not bare `YYYY-MM-DD` (GSC invalid-date / ProfilePage drilldown). `app/lib/schema-dates.ts` normalizes legacy date-only values (noon UTC); GrowthDaily/blog-cron R2 records are written in full ISO. `ProfilePage` on the home page intentionally has no `dateModified`.

**GSC URL Inspection (staff):** After schema changes, run live test on URLs in `docs/gsc-url-inspection.snapshot.json` (Search Console → URL denetimi). CI/prod gate: `pnpm check:schema-gsc` (HTML probes + snapshot URL list).

## Daily SEO blogs

- Queue: `content/blog-queue/YYYY-MM-DD-slug.json`
- Git blog kuyruk: `.github/workflows/weekly-seo-blog.yml` (yalnızca `workflow_dispatch`; günlük yayın GDS → R2)
- Manual: `pnpm blog:publish:dry` / `pnpm blog:publish`
- Keep **≥ 7–14** queued days so the cron never exits empty.

Optional GitHub secret: `BLOG_PUBLISH_TOKEN` (PAT with `contents: write`) if `main` is branch-protected.

## Google Search + GEO hard rules (site policy)

Follow Google Search Central quality expectations and keep GEO citation-safe:

1. **Helpful, accurate content** — hire/service copy must match real capability; no ranking guarantees, fake clients, or invented metrics.
2. **Structured data honesty** — schema.org Offers/Services mirror visible hire catalog and `areaServed`; never mark up content that is not on the page.
3. **Canonical hire surfaces** — regional intent lives in FAQ + `llms.txt` + `areaServed` + **per-service pages** (`/hire/{slug}`), not thin city doorway pages.
4. **Preferred citation source** — `https://berktugberke.com` / `llms.txt` / `/hire` / `/hire/{slug}` for identity and each service title; assistants must not invent phones/emails.
5. **Location accuracy** — home base is Marmaris, Muğla (Ege); other Türkiye regions are served (often remote), not claimed as residence.
6. **Crawl hygiene** — sitemap includes hire index + every service×locale URL, robots allowlist for AI crawlers, hreflang, stable canonicals, GTM-only analytics (no double tags).
7. **Per-title depth** — each software service title has its own indexable page with unique title/H1/FAQ/Offer JSON-LD so Google and LLMs can rank/cite services separately.

## Contact form (Turnstile)

| Variable | Where | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Vercel build + Production | Cloudflare Turnstile site key (public) |
| `TURNSTILE_SECRET` | Vercel Production | Turnstile secret for `/api/contact` siteverify |

In **Cloudflare → Turnstile**, use the **berktugberke.com Contact** widget (not HoneyTrade). Hostnames must include `berktugberke.com` and `www.berktugberke.com`. Paste site key and secret in Vercel **without trailing spaces or newlines** (the app trims, but clean env avoids bad builds). Widget mode **Managed** is fine; the contact form uses explicit render with action `contact`.