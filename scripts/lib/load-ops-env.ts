import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadDotenvLocal } from "./load-dotenv-local";
/** Ops script’leri için env: `.env.local`, `.env`, opsiyonel Vercel pull, proje ID enjeksiyonu. */
export function loadOpsEnv(root: string): void {
  loadDotenvLocal(root);

  const vercelEnvFile =
    process.env.OPS_VERCEL_ENV_FILE?.trim() || resolve(root, ".env.vercel.local");
  try {
    const raw = readFileSync(vercelEnvFile, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // optional — `pnpm ops:env-pull`
  }

  if (!process.env.VERCEL_PROJECT_ID || !process.env.VERCEL_TEAM_ID) {
    try {
      const raw = readFileSync(resolve(root, ".vercel/project.json"), "utf8");
      const j = JSON.parse(raw) as { projectId: string; orgId: string };
      if (!process.env.VERCEL_PROJECT_ID) process.env.VERCEL_PROJECT_ID = j.projectId;
      if (!process.env.VERCEL_TEAM_ID) process.env.VERCEL_TEAM_ID = j.orgId;
    } catch {
      // optional
    }
  }
}

export type OpsSecretId =
  | "VERCEL_TOKEN"
  | "MANUAL_CRON_SECRET"
  | "CONTENT_PUBLIC_BASE_URL"
  | "GSC_SERVICE_ACCOUNT";

export function opsSecretStatus(): Record<OpsSecretId, boolean> {
  const gsc = Boolean(
    process.env.GSC_SERVICE_ACCOUNT_JSON?.trim() || process.env.GSC_SERVICE_ACCOUNT_PATH?.trim(),
  );
  return {
    VERCEL_TOKEN: Boolean(process.env.VERCEL_TOKEN?.trim()),
    MANUAL_CRON_SECRET: Boolean(process.env.MANUAL_CRON_SECRET?.trim()),
    CONTENT_PUBLIC_BASE_URL: Boolean(
      process.env.CONTENT_PUBLIC_BASE_URL?.trim() || process.env.BLOB_PUBLIC_BASE_URL?.trim(),
    ),
    GSC_SERVICE_ACCOUNT: gsc,
  };
}

export function listMissingOpsSecrets(): OpsSecretId[] {
  const status = opsSecretStatus();
  return (Object.entries(status) as [OpsSecretId, boolean][])
    .filter(([, ok]) => !ok)
    .map(([id]) => id);
}
