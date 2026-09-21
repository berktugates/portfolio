/**
 * Faz 0 DoD — fail-closed kritik yüzeyler; uyarılar blog kuyruğu / Vercel token için.
 */
import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { runPublicSurfaceProbes } from "./lib/ops-probes";
import { fetchDeploymentExpiration, loadVercelProjectIds } from "./lib/vercel-project";

const root = resolve(import.meta.dirname, "..");

type Severity = "error" | "warn";

function log(severity: Severity, code: string, message: string) {
  const prefix = severity === "error" ? "FAIL" : "WARN";
  console.log(`${prefix} ${code}: ${message}`);
}

async function main() {
  let errors = 0;
  let warns = 0;

  const probes = await runPublicSurfaceProbes();
  for (const p of probes) {
    if (!p.ok) {
      log("error", p.name, p.detail);
      errors += 1;
    } else {
      console.log(`OK ${p.name}: ${p.detail}`);
    }
  }

  const indexNowPath = resolve(root, "public/bberke2026indexnowkey.txt");
  try {
    const key = (await readFile(indexNowPath, "utf8")).trim();
    if (key.length < 8) {
      log("error", "indexnow-key", "public key file empty");
      errors += 1;
    } else {
      console.log("OK indexnow-key: present");
    }
  } catch {
    log("error", "indexnow-key", "missing public/bberke2026indexnowkey.txt");
    errors += 1;
  }

  const vercelJson = await readFile(resolve(root, "vercel.json"), "utf8");
  if (!vercelJson.includes("ignoreCommand")) {
    log("error", "vercel-ignore", "vercel.json missing ignoreCommand");
    errors += 1;
  } else {
    console.log("OK vercel-ignore: ignoreCommand configured");
  }

  try {
    execSync("node scripts/assert-no-gundem-links.mjs", { cwd: root, stdio: "pipe" });
    console.log("OK gundem-leak: portfolio graph clean");
  } catch {
    log("error", "gundem-leak", "assert-no-gundem-links failed");
    errors += 1;
  }

  try {
    execSync("pnpm exec node --import tsx scripts/gundem-smoke-prod.ts", {
      cwd: root,
      stdio: "inherit",
    });
  } catch {
    log("error", "gundem-smoke", "haberler prod smoke failed");
    errors += 1;
  }

  let blogCount = 0;
  try {
    const out = execSync('find content/blog-queue -maxdepth 1 -name "*.json" | wc -l', {
      cwd: root,
      encoding: "utf8",
    });
    blogCount = Number.parseInt(out.trim(), 10) || 0;
  } catch {
    blogCount = 0;
  }
  if (blogCount < 1) {
    log("warn", "blog-queue", `inventory ${blogCount}; hedef ≥7 (weekly-seo-blog)`);
    warns += 1;
  } else if (blogCount < 7) {
    log("warn", "blog-queue", `inventory ${blogCount}; hedef ≥7`);
    warns += 1;
  } else {
    console.log(`OK blog-queue: ${blogCount} posts`);
  }

  const vercelToken = process.env.VERCEL_TOKEN;
  if (!vercelToken) {
    log("warn", "vercel-token", "VERCEL_TOKEN unset; deployment prune/metrics CI’da secret gerekir");
    warns += 1;
  } else {
    console.log("OK vercel-token: set");
    const ids = await loadVercelProjectIds(root);
    if (ids) {
      const retention = await fetchDeploymentExpiration(vercelToken, ids.projectId, ids.teamId);
      const previewDays = retention?.expirationDays ?? 0;
      const prodDays = retention?.expirationDaysProduction ?? 0;
      if (previewDays > 1 || prodDays > 10) {
        log(
          "warn",
          "vercel-retention",
          `preview=${previewDays}d prod=${prodDays}d (hedef preview≤1, prod≤10); konsol Build and Deployment → Retention`,
        );
        warns += 1;
      } else {
        console.log(`OK vercel-retention: preview=${previewDays}d prod=${prodDays}d`);
      }
    }
  }

  console.log(`\nFaz 0 check: ${errors} error(s), ${warns} warning(s).`);
  if (errors > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
