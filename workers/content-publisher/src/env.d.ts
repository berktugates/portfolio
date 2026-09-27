interface Env {
  CONTENT_BUCKET: R2Bucket;
  META: D1Database;
  AI: Ai;
  REVALIDATE_SECRET?: string;
  REVALIDATE_URL: string;
  HABERLER_HOST?: string;
  INDEXNOW_KEY?: string;
  MANUAL_CRON_SECRET?: string;
}
