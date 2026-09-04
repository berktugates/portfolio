#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));
const queueDir = join(dir, "../../content/blog-queue");

const files = [
  ["2026-09-12-feature-store-vs-prompt-store-tradeoffs.json", (await import("./post-12.mjs")).default],
  ["2026-09-13-offline-first-sync-conflicts-in-mobile-apps.json", (await import("./post-13.mjs")).default],
  ["2026-09-14-cost-attribution-for-shared-llm-gateways.json", (await import("./post-14.mjs")).default],
  ["2026-09-15-designing-human-escalation-queues-for-agents.json", (await import("./post-15.mjs")).default],
  ["2026-09-16-cache-invalidation-for-personalized-ai-uis.json", (await import("./post-16.mjs")).default],
  ["2026-09-17-permission-models-for-multi-tenant-ai-copilots.json", (await import("./post-17.mjs")).default],
];

for (const [name, post] of files) {
  writeFileSync(join(queueDir, name), `${JSON.stringify(post, null, 2)}\n`);
  console.log("wrote", name);
}
