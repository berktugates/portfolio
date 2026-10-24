CREATE TABLE IF NOT EXISTS growthdaily_deferred (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  istanbul_day TEXT NOT NULL,
  post_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  reason TEXT NOT NULL,
  deferred_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_growthdaily_deferred_post_day_reason
  ON growthdaily_deferred (istanbul_day, post_id, reason);

CREATE INDEX IF NOT EXISTS idx_growthdaily_deferred_slug ON growthdaily_deferred (slug);

-- Backfill audit rows for slots already reserved before early ingest recording shipped.
INSERT OR IGNORE INTO growthdaily_ingest (post_id, slug, updated_at, language)
SELECT post_id, slug, reserved_at, 'en'
FROM growthdaily_daily_publish;

INSERT OR IGNORE INTO published_slugs (slug, channel, published_at)
SELECT slug, 'growthdaily', reserved_at
FROM growthdaily_daily_publish;
