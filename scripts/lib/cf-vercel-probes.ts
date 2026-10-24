/**
 * Faz E — Cloudflare / Vercel yüzey (zone proxy olmadan apex Vercel; statik cache; IndexNow).
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { HABERLER_ORIGIN } from "../../app/lib/gundem/hosts";

export type CfVercelProbe = { id: string; ok: boolean; detail: string };

const APEX = "https://berktugberke.com";

async function fetchHead(url: string): Promise<Response> {
  const res = await fetch(url, { method: "GET", redirect: "follow", cache: "no-store" });
  return res;
}

export async function probeApexServedByVercel(): Promise<CfVercelProbe> {
  const id = "cf-apex-vercel";
  try {
    const res = await fetchHead(`${APEX}/`);
    const server = (res.headers.get("server") ?? "").toLowerCase();
    const cfRay = res.headers.get("cf-ray");
    if (!res.ok) return { id, ok: false, detail: `apex HTTP ${res.status}` };
    if (!server.includes("vercel")) {
      return { id, ok: false, detail: `expected server=Vercel, got ${server || "(empty)"}` };
    }
    if (cfRay) {
      return {
        id,
        ok: false,
        detail: `apex has cf-ray (${cfRay}); HTML should not be orange-cloud proxied`,
      };
    }
    return { id, ok: true, detail: "apex server=Vercel, no cf-ray (direct origin)" };
  } catch (error) {
    return { id, ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}

export async function probeHaberlerServedByVercel(): Promise<CfVercelProbe> {
  const id = "cf-haberler-vercel";
  try {
    const res = await fetchHead(`${HABERLER_ORIGIN}/`);
    const server = (res.headers.get("server") ?? "").toLowerCase();
    if (!res.ok) return { id, ok: false, detail: `haberler HTTP ${res.status}` };
    if (!server.includes("vercel")) {
      return { id, ok: false, detail: `expected server=Vercel, got ${server || "(empty)"}` };
    }
    return { id, ok: true, detail: "haberler server=Vercel" };
  } catch (error) {
    return { id, ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}

export async function probeNextStaticLongCache(): Promise<CfVercelProbe> {
  const id = "vercel-static-cache";
  try {
    const html = await (await fetchHead(`${APEX}/`)).text();
    const match = html.match(/\/_next\/static\/[^"'\s]+\.(?:js|css)/);
    if (!match) return { id, ok: false, detail: "no /_next/static asset in homepage HTML" };
    const assetUrl = `${APEX}${match[0]}`;
    const res = await fetch(assetUrl, { cache: "no-store" });
    if (!res.ok) return { id, ok: false, detail: `${assetUrl} HTTP ${res.status}` };
    const cc = (res.headers.get("cache-control") ?? "").toLowerCase();
    const ok = cc.includes("immutable") || cc.includes("max-age=31536000") || cc.includes("max-age=");
    if (!ok) return { id, ok: false, detail: `weak cache-control on static: ${cc || "(empty)"}` };
    return { id, ok: true, detail: `static cache OK (${cc.slice(0, 60)})` };
  } catch (error) {
    return { id, ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}

export async function probeIndexNowKeyOnProd(root: string): Promise<CfVercelProbe> {
  const id = "cf-indexnow-key";
  try {
    const manifest = JSON.parse(
      await readFile(resolve(root, "data/indexnow-public.json"), "utf8"),
    ) as { key: string; keyFile: string; host: string };
    const url = `${APEX}/${manifest.keyFile}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { id, ok: false, detail: `${url} HTTP ${res.status}` };
    const body = (await res.text()).trim();
    if (body !== manifest.key) {
      return { id, ok: false, detail: "IndexNow key file body mismatch" };
    }
    return { id, ok: true, detail: `${manifest.host}/${manifest.keyFile} hex key OK` };
  } catch (error) {
    return { id, ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}

export async function probeR2PublicOptional(): Promise<CfVercelProbe> {
  const id = "cf-r2-public";
  const base = process.env.CONTENT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!base) {
    return { id, ok: true, detail: "skipped (CONTENT_PUBLIC_BASE_URL unset)" };
  }
  try {
    const url = `${base}/blogs/index.json`;
    const res = await fetch(url, { cache: "no-store" });
    const cfCache = res.headers.get("cf-cache-status") ?? "—";
    if (!res.ok) return { id, ok: false, detail: `${url} HTTP ${res.status}` };
    return { id, ok: true, detail: `R2 public blogs index OK (cf-cache-status=${cfCache})` };
  } catch (error) {
    return { id, ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}

export async function runCfVercelProbes(root: string): Promise<CfVercelProbe[]> {
  return Promise.all([
    probeApexServedByVercel(),
    probeHaberlerServedByVercel(),
    probeNextStaticLongCache(),
    probeIndexNowKeyOnProd(root),
    probeR2PublicOptional(),
  ]);
}
