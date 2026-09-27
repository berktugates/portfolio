interface Env {
  CONTENT_BUCKET: R2Bucket;
  META: D1Database;
  AI: Ai;
  REVALIDATE_SECRET?: string;
  REVALIDATE_URL: string;
  HABERLER_HOST?: string;
  INDEXNOW_KEY?: string;
  MANUAL_CRON_SECRET?: string;
  NEWS_AUTO_PUBLISH?: string;
  PUBLICATION_LEGAL_READY?: string;
  TURNSTILE_SECRET?: string;
  ADMIN_ALLOWED_EMAIL?: string;
  ALERT_EMAIL?: SendEmail;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  CORRECTION_INGEST_SECRET?: string;
}
