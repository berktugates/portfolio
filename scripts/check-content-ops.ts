/**
 * Worker /ops/content + git kuyruk tutarlılığı (MANUAL_CRON_SECRET ile).
 */
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { loadOpsEnv } from "./lib/load-ops-env";

const WORKER_ORIGIN =
  process.env.CONTENT_PUBLISHER_ORIGIN ?? "https://berktug-content-publisher.berktugates.workers.dev";

async function gitQueueCount(root: string): Promise<number> {
  const dir = resolve(root, "content/blog-queue");
  const names = await readdir(dir);
  return names.filter((n) => n.endsWith(".json")).length;
}

async function main() {
  const root = resolve(import.meta.dirname, "..");
  loadOpsEnv(root);

  const gitCount = await gitQueueCount(root);
  const secret = process.env.MANUAL_CRON_SECRET?.trim();
  let errors = 0;
  let warns = 0;

  if (!secret) {
    console.log("WARN content-ops-api: MANUAL_CRON_SECRET unset; skip /ops/content");
    warns += 1;
    console.log(`\nContent ops: ${errors} error(s), ${warns} warning(s).`);
    return;
  }

  const res = await fetch(`${WORKER_ORIGIN}/ops/content`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(`FAIL content-ops-api: HTTP ${res.status}`);
    process.exit(1);
  }

  const body = (await res.json()) as {
    queueObjectCount: number;
    revalidatePending: number;
    githubDispatchConfigured: boolean;
    queueOldestKey: string | null;
  };

  console.log(
    `OK content-ops-api: r2Queue=${body.queueObjectCount} gitQueue=${gitCount} revalidatePending=${body.revalidatePending} githubDispatch=${body.githubDispatchConfigured}`,
  );

  if (gitCount > 0 && body.queueObjectCount === 0) {
    console.error("FAIL content-ops-queue: git has queue files but R2 queue/ is empty (sync lag or failed upload)");
    errors += 1;
  } else if (gitCount > 0 && body.queueObjectCount !== gitCount) {
    console.log(
      `WARN content-ops-queue: count mismatch git=${gitCount} r2=${body.queueObjectCount} (partial sync or published items removed from queue)`,
    );
    warns += 1;
  } else if (gitCount > 0) {
    console.log(`OK content-ops-queue: git/R2 counts aligned (${gitCount})`);
  }

  if (body.revalidatePending > 20) {
    console.log(`WARN content-ops-revalidate: ${body.revalidatePending} pending paths (flush cron or REVALIDATE_SECRET)`);
    warns += 1;
  }

  if (!body.githubDispatchConfigured) {
    console.log(
      "WARN content-ops-dispatch: GITHUB_DISPATCH_TOKEN + GITHUB_REPOSITORY not set on Worker (newsletter auto-trigger off)",
    );
    warns += 1;
  }

  console.log(`\nContent ops: ${errors} error(s), ${warns} warning(s).`);
  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
