import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export type DeploymentExpiration = {
  expirationDays?: number;
  expirationDaysProduction?: number;
  expirationDaysCanceled?: number;
  expirationDaysErrored?: number;
  deploymentsToKeep?: number;
};

export async function loadVercelProjectIds(root: string): Promise<{ projectId: string; teamId: string } | null> {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (projectId && teamId) return { projectId, teamId };
  try {
    const raw = await readFile(resolve(root, ".vercel/project.json"), "utf8");
    const j = JSON.parse(raw) as { projectId: string; orgId: string };
    return { projectId: j.projectId, teamId: j.orgId };
  } catch {
    return null;
  }
}

export async function fetchDeploymentExpiration(
  token: string,
  projectId: string,
  teamId: string,
): Promise<DeploymentExpiration | null> {
  const url = `https://api.vercel.com/v9/projects/${projectId}?teamId=${teamId}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as { deploymentExpiration?: DeploymentExpiration };
  return data.deploymentExpiration ?? null;
}
