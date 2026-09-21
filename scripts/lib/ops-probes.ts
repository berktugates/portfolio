import { HABERLER_ORIGIN } from "../../app/lib/gundem/hosts";

export type ProbeResult = { name: string; ok: boolean; detail: string };

export async function probeUrl(
  name: string,
  url: string,
  opts?: { expectStatus?: number; contains?: string[] },
): Promise<ProbeResult> {
  const expectStatus = opts?.expectStatus ?? 200;
  try {
    const res = await fetch(url, { redirect: "follow", cache: "no-store" });
    if (res.status !== expectStatus) {
      return { name, ok: false, detail: `${url} → HTTP ${res.status} (expected ${expectStatus})` };
    }
    if (opts?.contains?.length) {
      const body = await res.text();
      for (const needle of opts.contains) {
        if (!body.includes(needle)) {
          return { name, ok: false, detail: `${url} missing: ${needle}` };
        }
      }
    }
    return { name, ok: true, detail: `${url} → ${res.status}` };
  } catch (error) {
    return { name, ok: false, detail: `${url} → ${error instanceof Error ? error.message : String(error)}` };
  }
}

export async function probeGundemRedirect(): Promise<ProbeResult> {
  try {
    const res = await fetch("https://berktugberke.com/gundem", { redirect: "manual", cache: "no-store" });
    if (![301, 308].includes(res.status)) {
      return { name: "gundem-redirect", ok: false, detail: `/gundem → ${res.status}` };
    }
    const loc = res.headers.get("location") ?? "";
    if (!loc.startsWith(HABERLER_ORIGIN)) {
      return { name: "gundem-redirect", ok: false, detail: `location ${loc}` };
    }
    return { name: "gundem-redirect", ok: true, detail: `308 → ${loc}` };
  } catch (error) {
    return {
      name: "gundem-redirect",
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function runPublicSurfaceProbes(): Promise<ProbeResult[]> {
  return Promise.all([
    probeUrl("sitemap-main", "https://berktugberke.com/sitemap.xml", { contains: ["<urlset", "berktugberke.com"] }),
    probeUrl("sitemap-gundem", `${HABERLER_ORIGIN}/sitemap-gundem.xml`, {
      contains: ["<urlset", HABERLER_ORIGIN.replace("https://", "")],
    }),
    probeUrl("robots", "https://berktugberke.com/robots.txt"),
    probeUrl("haberler-index", `${HABERLER_ORIGIN}/`, { contains: ["Gündem"] }),
    probeGundemRedirect(),
  ]);
}
