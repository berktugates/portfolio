/**
 * Faz 0: ölçülebilir snapshot (GSC/GA4 rakamları dashboard’dan; bu script otomatik metrikleri toplar).
 */
import { execSync } from "node:child_process";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { runPublicSurfaceProbes } from "./lib/ops-probes";

const root = resolve(import.meta.dirname, "..");
const outPath = resolve(root, "docs/ops-baseline.snapshot.json");

async function countJson(dir: string): Promise<number> {
  try {
    const names = await readdir(resolve(root, dir));
    return names.filter((n) => n.endsWith(".json")).length;
  } catch {
    return 0;
  }
}

async function gitBlogCommits90d(): Promise<number> {
  try {
    const out = execSync('git log --since="90 days ago" --oneline -- app/data/blogs.ts content/posts', {
      cwd: root,
      encoding: "utf8",
    });
    return out.trim() ? out.trim().split("\n").length : 0;
  } catch {
    return 0;
  }
}

async function vercelDeploymentSummary(): Promise<{
  ok: boolean;
  totalListed?: number;
  note: string;
}> {
  const token = process.env.VERCEL_TOKEN;
  let projectId = process.env.VERCEL_PROJECT_ID;
  let teamId = process.env.VERCEL_TEAM_ID;
  if (!projectId || !teamId) {
    try {
      const raw = await readFile(resolve(root, ".vercel/project.json"), "utf8");
      const j = JSON.parse(raw) as { projectId: string; orgId: string };
      projectId = projectId ?? j.projectId;
      teamId = teamId ?? j.orgId;
    } catch {
      return { ok: true, note: "VERCEL_TOKEN veya .vercel/project.json yok; deployment sayımı atlandı." };
    }
  }
  if (!token) {
    return { ok: true, note: "VERCEL_TOKEN yok; deployment sayımı atlandı (CI secret ile doldurulur)." };
  }
  try {
    const url = `https://api.vercel.com/v6/deployments?projectId=${projectId}&teamId=${teamId}&limit=100`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) {
      return { ok: false, note: `Vercel API ${res.status}` };
    }
    const data = (await res.json()) as { deployments?: unknown[] };
    const n = data.deployments?.length ?? 0;
    return { ok: true, totalListed: n, note: `Son ${n} deployment listelendi (limit 100).` };
  } catch (error) {
    return { ok: false, note: error instanceof Error ? error.message : String(error) };
  }
}

async function main() {
  const probes = await runPublicSurfaceProbes();
  const snapshot = {
    generatedAt: new Date().toISOString(),
    faz: 0,
    probes,
    queues: {
      blogJson: await countJson("content/blog-queue"),
      gundemJson: await countJson("content/gundem-queue"),
      blogMinRecommended: 7,
    },
    git: {
      blogRelatedCommits90d: await gitBlogCommits90d(),
    },
    vercel: await vercelDeploymentSummary(),
    manualDashboard: {
      gscProperty: "sc-domain:berktugberke.com",
      gtmContainer: "GTM-K2PXS8ZC",
      ga4: "G-5H6GDB1CRH",
      retentionTarget: { productionDays: "5-10", previewDays: 1 },
    },
  };

  await writeFile(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Wrote ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
