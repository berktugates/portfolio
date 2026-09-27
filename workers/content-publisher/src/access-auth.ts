type JwtHeader = { alg?: string; kid?: string };
type JwtPayload = { aud?: string | string[]; email?: string; exp?: number; iss?: string };
type JwkSet = { keys?: (JsonWebKey & { kid?: string })[] };

function decodePart<T>(part: string): T | null {
  try {
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
    return JSON.parse(atob(normalized)) as T;
  } catch { return null; }
}

function bytes(part: string): Uint8Array {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
  return Uint8Array.from(atob(normalized), (character) => character.charCodeAt(0));
}

export async function authenticatedEditor(request: Request, env: Env): Promise<string | null> {
  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD || !env.ADMIN_ALLOWED_EMAIL) return null;
  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const header = decodePart<JwtHeader>(parts[0]);
  const payload = decodePart<JwtPayload>(parts[1]);
  if (!header?.kid || header.alg !== "RS256" || !payload?.email || !payload.exp) return null;
  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(env.CF_ACCESS_AUD) || payload.exp * 1000 <= Date.now()) return null;
  if (payload.email.toLowerCase() !== env.ADMIN_ALLOWED_EMAIL.toLowerCase()) return null;
  if (payload.iss !== `https://${env.CF_ACCESS_TEAM_DOMAIN}`) return null;

  const response = await fetch(`https://${env.CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`, {
    cf: { cacheTtl: 3600, cacheEverything: true },
  });
  if (!response.ok) return null;
  const jwks = (await response.json()) as JwkSet;
  const jwk = jwks.keys?.find((key) => key.kid === header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    bytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  return valid ? payload.email : null;
}
