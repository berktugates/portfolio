CREATE TABLE IF NOT EXISTS growthdaily_sync (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  cursor_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS growthdaily_ingest (
  post_id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  language TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_growthdaily_ingest_slug ON growthdaily_ingest (slug);
