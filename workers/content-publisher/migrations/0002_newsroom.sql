CREATE TABLE IF NOT EXISTS news_sources (
  source_id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  publisher_group_id TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('official', 'media', 'licensed-wire')),
  feed_url TEXT NOT NULL UNIQUE,
  terms_url TEXT,
  rights_reviewed_at TEXT,
  trust_tier INTEGER NOT NULL DEFAULT 1,
  enabled INTEGER NOT NULL DEFAULT 1,
  etag TEXT,
  last_modified TEXT,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  circuit_open_until TEXT,
  last_polled_at TEXT
);

CREATE TABLE IF NOT EXISTS news_source_items (
  item_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  publisher_group_id TEXT NOT NULL,
  canonical_url TEXT,
  title TEXT NOT NULL,
  description_snippet TEXT,
  published_at TEXT,
  content_hash TEXT NOT NULL,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (source_id) REFERENCES news_sources(source_id)
);
CREATE INDEX IF NOT EXISTS idx_news_items_window ON news_source_items(expires_at, published_at);
CREATE INDEX IF NOT EXISTS idx_news_items_group ON news_source_items(publisher_group_id, published_at);

CREATE TABLE IF NOT EXISTS news_stories (
  story_id TEXT PRIMARY KEY,
  cluster_key TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'prohibited')),
  status TEXT NOT NULL,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  published_at TEXT,
  date_modified TEXT,
  current_revision_id TEXT
);

CREATE TABLE IF NOT EXISTS news_story_evidence (
  story_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  publisher_group_id TEXT NOT NULL,
  supports_claim_ids TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (story_id, item_id),
  FOREIGN KEY (story_id) REFERENCES news_stories(story_id),
  FOREIGN KEY (item_id) REFERENCES news_source_items(item_id)
);

CREATE TABLE IF NOT EXISTS news_claims (
  claim_id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  predicate TEXT NOT NULL,
  value_text TEXT,
  unit TEXT,
  occurred_at TEXT,
  official_status TEXT NOT NULL CHECK (official_status IN ('official', 'media-reported', 'disputed')),
  confidence REAL NOT NULL,
  evidence_item_ids TEXT NOT NULL,
  FOREIGN KEY (story_id) REFERENCES news_stories(story_id)
);

CREATE TABLE IF NOT EXISTS news_revisions (
  revision_id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL,
  revision_kind TEXT NOT NULL CHECK (revision_kind IN ('publish', 'update', 'correction', 'retraction')),
  object_key TEXT NOT NULL UNIQUE,
  content_hash TEXT NOT NULL,
  gate_report TEXT NOT NULL,
  model_version TEXT,
  prompt_version TEXT,
  approved_by TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (story_id) REFERENCES news_stories(story_id)
);

CREATE TABLE IF NOT EXISTS news_review_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  story_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  detail TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (story_id) REFERENCES news_stories(story_id)
);

CREATE TABLE IF NOT EXISTS news_publish_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idempotency_key TEXT NOT NULL UNIQUE,
  story_id TEXT NOT NULL,
  revision_id TEXT NOT NULL,
  status TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS news_daily_usage (
  usage_date TEXT PRIMARY KEY,
  new_published INTEGER NOT NULL DEFAULT 0,
  updates_published INTEGER NOT NULL DEFAULT 0,
  ai_neurons_estimated INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS correction_requests (
  request_id TEXT PRIMARY KEY,
  story_id TEXT,
  article_url TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  statement TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  received_at TEXT NOT NULL,
  resolved_at TEXT
);
