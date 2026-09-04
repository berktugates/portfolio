const CACHE_PREFIX = "https://assistant-rate-limit.internal";

function clientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

async function readCounter(cacheKey: string): Promise<number> {
  const cache = caches.default;
  const hit = await cache.match(new Request(cacheKey));
  if (!hit) return 0;
  const n = Number.parseInt(await hit.text(), 10);
  return Number.isFinite(n) ? n : 0;
}

async function writeCounter(cacheKey: string, value: number, maxAgeSec: number): Promise<void> {
  const cache = caches.default;
  await cache.put(
    new Request(cacheKey),
    new Response(String(value), {
      headers: {
        "Cache-Control": `max-age=${maxAgeSec}`,
      },
    }),
  );
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; reason: "hourly" | "daily" | "payload" };

export async function checkAssistantRateLimit(
  request: Request,
  limits: { hourly: number; daily: number },
): Promise<RateLimitResult> {
  const ip = clientIp(request);
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const hour = now.toISOString().slice(0, 13);

  const dailyKey = `${CACHE_PREFIX}/day/${encodeURIComponent(ip)}/${day}`;
  const hourlyKey = `${CACHE_PREFIX}/hour/${encodeURIComponent(ip)}/${hour}`;

  const [daily, hourly] = await Promise.all([readCounter(dailyKey), readCounter(hourlyKey)]);

  if (daily >= limits.daily) {
    return { allowed: false, reason: "daily" };
  }
  if (hourly >= limits.hourly) {
    return { allowed: false, reason: "hourly" };
  }

  await Promise.all([
    writeCounter(dailyKey, daily + 1, 86_400),
    writeCounter(hourlyKey, hourly + 1, 3600),
  ]);

  return { allowed: true };
}

export function isQuotaExhaustedError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  return (
    msg.includes("quota") ||
    msg.includes("limit exceeded") ||
    msg.includes("rate limit") ||
    msg.includes("429") ||
    msg.includes("1101") ||
    msg.includes("exceeded")
  );
}
