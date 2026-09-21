/**
 * Trends TR RSS + data/gundem-demand-signals.json → tek yayın hazır kuyruk dosyası.
 * GTM content_group=gundem ve GSC haberler sitemap ile ölçüm (docs/gundem-editorial.md).
 */
import { readFile, readdir, writeFile, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import { assessContentSafety } from "../app/lib/content-safety";
import { validateLicensedImage } from "../app/lib/image-license";
import type { GundemBriefing } from "../app/lib/gundem/types";
import { GUNDEM_EDITORIAL_MISSION } from "../app/lib/gundem/editorial";
import {
  composeBriefingFromTrend,
  type DemandSignal,
  scoreTrendItem,
} from "./lib/gundem-compose";
import { fetchGundemBlobIndex, indexHasSlug, indexHasTrendQuery } from "./lib/gundem-blob-index";
import { fetchTurkeyTrends } from "./lib/gundem-trends";

const root = resolve(import.meta.dirname, "..");
const queueDir = resolve(root, "content/gundem-queue");

async function loadDemandSignals(): Promise<DemandSignal[]> {
  try {
    const raw = await readFile(resolve(root, "data/gundem-demand-signals.json"), "utf8");
    const data = JSON.parse(raw) as { queries: DemandSignal[] };
    return data.queries ?? [];
  } catch {
    return [];
  }
}

async function clearQueueJson() {
  const names = (await readdir(queueDir)).filter((n) => n.endsWith(".json"));
  for (const name of names) {
    await unlink(resolve(queueDir, name));
  }
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  console.log(`Gundem refresh mission: ${GUNDEM_EDITORIAL_MISSION}`);

  const [trends, demand, indexPosts] = await Promise.all([
    fetchTurkeyTrends(),
    loadDemandSignals(),
    fetchGundemBlobIndex(),
  ]);

  const ranked = trends
    .map((t) => ({ trend: t, score: scoreTrendItem(t, demand) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    console.log("No eligible Trends items after filtering.");
    return;
  }

  for (const { trend } of ranked) {
    const draft = composeBriefingFromTrend(trend, today);
    if (indexHasTrendQuery(indexPosts, draft.trendQuery) || indexHasSlug(indexPosts, draft.slug)) {
      console.log(`Skip already published: ${draft.trendQuery} (${draft.slug})`);
      continue;
    }

    const safety = assessContentSafety({
      title: draft.title,
      body: draft.bodyMarkdown,
      excerpt: draft.excerpt,
      alt: draft.image?.alt,
      sources: draft.sources,
    });
    if (!safety.ok) {
      console.warn(`Compose safety fail ${draft.slug}: ${safety.code}`, safety.hits);
      continue;
    }

    const imageCheck = validateLicensedImage(draft.image);
    if (!imageCheck.ok) {
      console.warn(`Compose image fail ${draft.slug}:`, imageCheck.reason);
      continue;
    }

    await clearQueueJson();
    const outName = `${today}-${draft.slug}.json`;
    const outPath = resolve(queueDir, outName);
    await writeFile(outPath, `${JSON.stringify(draft, null, 2)}\n`);
    console.log(
      `Queued briefing for publish: ${outName} (trend="${draft.trendQuery}", traffic~${trend.approxTraffic})`,
    );
    return;
  }

  console.log("All ranked Trends items already exist in Blob index; queue unchanged.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
