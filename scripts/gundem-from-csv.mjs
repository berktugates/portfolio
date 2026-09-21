#!/usr/bin/env node
/**
 * Reads Trends/KWP CSV exports and writes skeleton JSON into content/gundem-queue/.
 * Ulusal gündem (yalnızca bilişim değil); insan editöryal analiz gerekir.
 * No auto-publish — human review required.
 *
 * Usage: node scripts/gundem-from-csv.mjs path/to/trends.csv
 */
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: node scripts/gundem-from-csv.mjs <csv-file>");
  process.exit(1);
}

const { readFile } = await import("node:fs/promises");
const text = await readFile(csvPath, "utf8");
const lines = text.trim().split(/\r?\n/).filter(Boolean);
if (lines.length < 2) {
  console.error("CSV needs a header row and at least one data row.");
  process.exit(1);
}

const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
const queryIdx = header.findIndex((h) => /query|keyword|term/.test(h));
const volumeIdx = header.findIndex((h) => /volume|vol/.test(h));
const date = new Date().toISOString().slice(0, 10);

for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split(",");
  const trendQuery = cols[queryIdx >= 0 ? queryIdx : 0]?.trim() ?? `row-${i}`;
  const kwpVolume = volumeIdx >= 0 ? Number(cols[volumeIdx]) || 0 : 0;
  const slug = trendQuery
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const skeleton = {
    slug: slug || `gundem-${i}`,
    trendQuery,
    kwpVolume,
    angle:
      "Türkiye'de bu gündem maddesi hane halkını, iş dünyasını ve kamuoyunu nasıl etkiler? Okur için ne anlama gelir?",
    category: "diger",
    sources: [],
    draftBody: "",
  };
  const out = resolve(process.cwd(), "content/gundem-queue", `${date}-${skeleton.slug}.json`);
  await writeFile(out, `${JSON.stringify(skeleton, null, 2)}\n`);
  console.log(`Wrote ${out}`);
}
