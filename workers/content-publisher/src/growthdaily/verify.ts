const MAX_SKEW_MS = 5 * 60 * 1000;

function hexToBytes(hex: string): Uint8Array | null {
  const normalized = hex.trim().toLowerCase();
  if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) return null;
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export type VerifyWebhookInput = {
  secret: string;
  rawBody: string;
  timestamp: string | null;
  signature: string | null;
};

export async function verifyGrowthDailyWebhook(input: VerifyWebhookInput): Promise<boolean> {
  const { secret, rawBody, timestamp, signature } = input;
  if (!secret || !timestamp || !signature) return false;
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  const skew = Math.abs(Date.now() - ts * 1000);
  if (skew > MAX_SKEW_MS) return false;

  const expected = await hmacSha256Hex(secret, `${timestamp}.${rawBody}`);
  const got = hexToBytes(signature.replace(/^sha256=/i, ""));
  const want = hexToBytes(expected);
  if (!got || !want) return false;
  return timingSafeEqual(got, want);
}

export function webhookHeaders(request: Request): { timestamp: string | null; signature: string | null } {
  const timestamp =
    request.headers.get("x-growthdaily-timestamp") ??
    request.headers.get("x-figrush-timestamp");
  const signature =
    request.headers.get("x-growthdaily-signature") ??
    request.headers.get("x-figrush-signature");
  return { timestamp, signature };
}
