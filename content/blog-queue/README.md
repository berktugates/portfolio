# Daily SEO blog queue

Queued posts were published by `pnpm blog:publish` / `.github/workflows/weekly-seo-blog.yml`. **New posts come from GrowthDailySEO → Cloudflare Worker**; this folder is archived inventory only. The workflow remains available via `workflow_dispatch` for emergencies.

## File naming

`YYYY-MM-DD-slug.json`

The publisher prefers a file matching today's Istanbul date. If none exists, it takes the oldest file and stamps `publishedAt` to today.

## Required shape

- English fields at the top level (`slug`, `title`, `excerpt`, `description`, `readingMinutes`, `keywords`, `sections`, `socialThreadTr`)
- Full overlays under `locales.tr|de|fr|it|zh|ja` with matching section structure
- Unique `slug` not already in `app/data/blogs.ts`
- **≥10 min read** in every locale (EN ≥800 words after `pnpm blog-queue:sync` long-form pipeline)

## Operations

```bash
pnpm blog:publish:dry
pnpm blog:publish
```

Keep at least 7–14 days of inventory in this folder so the weekly cron never goes empty.

```bash
pnpm blog-queue:sync
pnpm check:queues
```
