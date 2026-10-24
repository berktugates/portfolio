interface Env {
  CONTENT_BUCKET: R2Bucket;
  META: D1Database;
  AI: Ai;
  REVALIDATE_SECRET?: string;
  REVALIDATE_URL: string;
  HABERLER_HOST?: string;
  INDEXNOW_KEY?: string;
  INDEXNOW_HOST?: string;
  MANUAL_CRON_SECRET?: string;
  /** Fine-grained PAT: Actions + Contents read (repository_dispatch). */
  GITHUB_DISPATCH_TOKEN?: string;
  /** e.g. berktugates/portfolio */
  GITHUB_REPOSITORY?: string;
  NEWS_AUTO_PUBLISH?: string;
  PUBLICATION_LEGAL_READY?: string;
  TURNSTILE_SECRET?: string;
  ADMIN_ALLOWED_EMAIL?: string;
  ALERT_EMAIL?: SendEmail;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  CORRECTION_INGEST_SECRET?: string;
  CONTACT_INGEST_SECRET?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_INBOUND_EMAIL?: string;
  GROWTHDAILY_WEBHOOK_SECRET?: string;
  GROWTHDAILY_API_KEY?: string;
  GROWTHDAILY_SITE_ID?: string;
  /** When "true", ingest drafts before GDS publish (not recommended with “review first”). */
  GROWTHDAILY_PUBLISH_DRAFTS?: string;
  /** Max new GDS posts per Europe/Istanbul day (default 1 for the trial; "0" pauses). */
  GROWTHDAILY_DAILY_PUBLISH_CAP?: string;
}
