-- GrowthDailySEO trial: max N new publishes per Istanbul calendar day (default 1).
-- One row per (day, post). Re-ingesting an already counted/published post never adds a row.
CREATE TABLE IF NOT EXISTS growthdaily_daily_publish (
  istanbul_day TEXT NOT NULL,
  post_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  quality_band TEXT,
  reserved_at TEXT NOT NULL,
  PRIMARY KEY (istanbul_day, post_id)
);

CREATE INDEX IF NOT EXISTS idx_growthdaily_daily_publish_day ON growthdaily_daily_publish (istanbul_day);
