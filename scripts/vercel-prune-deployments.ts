/**
 * Faz 0: eski preview ve fazla production deployment artifact temizliği.
 * Varsayılan dry-run; --apply ile siler. --safe production alias’lı deploy’lara dokunmaz.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

type Deployment = {
  uid: string;
  url: string;
  created: number;
  target?: string | null;
  state?: string;
};

const root = resolve(import.meta.dirname, "..");

async function loadProjectIds(): Promise<{ projectId: string; teamId: string }> {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (projectId && teamId) return { projectId, teamId };
  const raw = await readFile(resolve(root, ".vercel/project.json"), "utf8");
  const j = JSON.parse(raw) as { projectId: string; orgId: string };
  return { projectId: j.projectId, teamId: j.orgId };
}

async function listDeployments(token: string, projectId: string, teamId: string): Promise<Deployment[]> {
  const url = `https://api.vercel.com/v6/deployments?projectId=${projectId}&teamId=${teamId}&limit=100`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Vercel list deployments: ${res.status}`);
  }
  const data = (await res.json()) as { deployments: Deployment[] };
  return data.deployments ?? [];
}

async function deleteDeployment(token: string, teamId: string, id: string): Promise<void> {
  const url = `https://api.vercel.com/v13/deployments/${id}?teamId=${teamId}`;
  const res = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Delete ${id}: HTTP ${res.status}`);
  }
}

async function main() {
  const apply = process.argv.includes("--apply");
  const safe = !process.argv.includes("--no-safe");
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error("VERCEL_TOKEN required (Vercel → Account → Tokens).");
    process.exit(1);
  }

  const { projectId, teamId } = await loadProjectIds();
  const deployments = await listDeployments(token, projectId, teamId);
  const now = Date.now();
  const previewMaxAgeMs = 24 * 60 * 60 * 1000;
  const prodKeep = 8;
  const prodMaxAgeMs = 14 * 24 * 60 * 60 * 1000;

  const readyProd = deployments
    .filter((d) => d.target === "production" && d.state === "READY")
    .sort((a, b) => b.created - a.created);

  const toDelete: Deployment[] = [];

  for (const d of deployments) {
    if (d.state !== "READY" && d.state !== "CANCELED") continue;
    const age = now - d.created;
    if (d.target === "production") {
      const rank = readyProd.findIndex((x) => x.uid === d.uid);
      if (rank >= 0 && rank < prodKeep) continue;
      if (safe && rank === 0) continue;
      if (age < prodMaxAgeMs && rank >= 0 && rank < prodKeep + 2) continue;
      toDelete.push(d);
    } else {
      if (age > previewMaxAgeMs) toDelete.push(d);
    }
  }

  const unique = [...new Map(toDelete.map((d) => [d.uid, d])).values()];
  console.log(`Deployments listed: ${deployments.length}; candidates: ${unique.length} (apply=${apply})`);

  for (const d of unique) {
    const line = `${d.target ?? "preview"} ${d.url} age=${Math.round((now - d.created) / 3600000)}h`;
    if (apply) {
      await deleteDeployment(token, teamId, d.uid);
      console.log(`DELETED ${line}`);
    } else {
      console.log(`DRY-RUN delete ${line}`);
    }
  }

  if (!apply && unique.length > 0) {
    console.log("Re-run with --apply to delete.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
