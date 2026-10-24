const DEFAULT_ORIGIN = "https://berktug-content-publisher.berktugates.workers.dev";

export type GdsOpsSnapshot = {
  istanbulDay: string;
  cap: number;
  countToday: number;
  publishedToday: { slug: string }[];
};

export function workerOrigin(): string {
  return process.env.CONTENT_PUBLISHER_ORIGIN?.trim() || DEFAULT_ORIGIN;
}

export async function fetchGdsOpsSnapshot(secret: string): Promise<GdsOpsSnapshot> {
  const res = await fetch(`${workerOrigin()}/ops/growthdaily`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`gds-ops-api HTTP ${res.status}`);
  }
  return (await res.json()) as GdsOpsSnapshot;
}

/** GDS bugün en az bir yazı saydıysa git kuyruk fallback gerekmez. */
export function gdsPublishedToday(snapshot: GdsOpsSnapshot): boolean {
  return snapshot.countToday >= 1 || snapshot.publishedToday.length >= 1;
}

export async function postGdsReconcile(secret: string): Promise<{ processed: number; deferredByCap: number }> {
  const res = await fetch(`${workerOrigin()}/cron/growthdaily`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`gds-reconcile HTTP ${res.status}`);
  }
  return (await res.json()) as { processed: number; deferredByCap: number };
}
