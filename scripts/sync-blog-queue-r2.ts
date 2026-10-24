/**
 * Git content/blog-queue → R2 queue/blog/ (Worker blog-queue-cron buradan yayınlar).
 * Vercel deploy tetiklemez.
 */
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { createR2Client, putR2Json } from "./lib/r2-s3-client";

const root = resolve(import.meta.dirname, "..");
const queueDir = resolve(root, "content/blog-queue");
const PREFIX = "queue/blog/";

function bucketName(): string {
  return process.env.R2_BUCKET_NAME ?? "portfolio-content";
}

async function main() {
  const client = createR2Client();
  const bucket = bucketName();
  const names = (await readdir(queueDir)).filter((n) => n.endsWith(".json")).sort();
  if (names.length === 0) {
    console.log("OK sync-blog-queue-r2: queue empty");
    return;
  }
  let uploaded = 0;
  for (const name of names) {
    const body = await readFile(resolve(queueDir, name), "utf8");
    JSON.parse(body);
    const key = `${PREFIX}${name}`;
    const digest = createHash("sha256").update(body).digest("hex");
    await putR2Json(client, bucket, key, JSON.parse(body));
    console.log(`OK sync-blog-queue-r2: ${key} sha256=${digest.slice(0, 12)}`);
    uploaded += 1;
  }
  console.log(`OK sync-blog-queue-r2: ${uploaded} object(s) → R2`);
}

main().catch((err) => {
  console.error(`FAIL sync-blog-queue-r2: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
