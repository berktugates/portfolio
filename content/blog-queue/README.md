# Daily SEO blog queue

Queued posts are published by `pnpm blog:publish` / `.github/workflows/daily-seo-blog.yml`.

## File naming

`YYYY-MM-DD-slug.json`

The publisher prefers a file matching today's Istanbul date. If none exists, it takes the oldest file and stamps `publishedAt` to today.

## Required shape

- English fields at the top level (`slug`, `title`, `excerpt`, `description`, `readingMinutes`, `keywords`, `sections`, `socialThreadTr`)
- Full overlays under `locales.tr|de|fr|it|zh|ja` with matching section structure
- Unique `slug` not already in `app/data/blogs.ts`

## Operations

```bash
pnpm blog:publish:dry
pnpm blog:publish
```

Keep at least 7–14 days of inventory in this folder so the daily cron never goes empty.
