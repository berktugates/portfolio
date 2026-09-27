CREATE TABLE IF NOT EXISTS published_slugs (
  slug TEXT PRIMARY KEY,
  channel TEXT NOT NULL,
  published_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trend_dedup (
  trend_query TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  published_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS revalidate_pending (
  path TEXT PRIMARY KEY,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug_hint TEXT NOT NULL UNIQUE,
  prompt TEXT NOT NULL,
  published_at TEXT
);
