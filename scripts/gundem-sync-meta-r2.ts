/**
 * data/gundem-demand-signals.json + data/tr-media-rss-feeds.json → R2 meta (Worker cron).
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createR2Client, putR2Json } from "./lib/r2-s3-client";

const root = resolve(import.meta.dirname, "..");

async function main() {
  const client = createR2Client();
  const bucket = process.env.R2_BUCKET_NAME ?? "portfolio-content";

  const demand = await readFile(resolve(root, "data/gundem-demand-signals.json"), "utf8");
  await putR2Json(client, bucket, "meta/gundem-demand-signals.json", JSON.parse(demand));
  console.log("Uploaded meta/gundem-demand-signals.json");

  const feeds = await readFile(resolve(root, "data/tr-media-rss-feeds.json"), "utf8");
  await putR2Json(client, bucket, "meta/tr-media-rss-feeds.json", JSON.parse(feeds));
  console.log("Uploaded meta/tr-media-rss-feeds.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
