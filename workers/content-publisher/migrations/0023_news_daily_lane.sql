CREATE TABLE IF NOT EXISTS news_daily_lane_publish (
  istanbul_day TEXT NOT NULL,
  lane TEXT NOT NULL,
  slug TEXT NOT NULL,
  published_at TEXT NOT NULL,
  PRIMARY KEY (istanbul_day, lane)
);

CREATE INDEX IF NOT EXISTS idx_news_daily_lane_day ON news_daily_lane_publish (istanbul_day);
