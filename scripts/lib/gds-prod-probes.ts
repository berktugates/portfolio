import {
  GDS_PROD_CAP_DEFERRED_SLUG,
  GDS_PROD_PUBLISHED_SLUG,
  gdsProdBlogUrl,
} from "../../app/lib/gds-prod-fixtures";

export type ProbeResult = { name: string; ok: boolean; detail: string };

async function probeUrl(
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

const SCHEMA_ISO =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

function jsonLdDateModifiedValues(html: string): string[] {
  const values: string[] = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(match[1]) as {
        dateModified?: string;
        "@graph"?: { dateModified?: string }[];
      };
      const nodes = data["@graph"] ?? [data];
      for (const node of nodes) {
        if (typeof node.dateModified === "string") values.push(node.dateModified);
      }
    } catch {
      /* ignore malformed blocks */
    }
  }
  return values;
}

export async function probeGdsDailyCapSurface(): Promise<ProbeResult[]> {
  const publishedUrl = gdsProdBlogUrl(GDS_PROD_PUBLISHED_SLUG);
  const deferredUrl = gdsProdBlogUrl(GDS_PROD_CAP_DEFERRED_SLUG);

  const [published, deferred] = await Promise.all([
    probeUrl("gds-published-blog", publishedUrl, {
      contains: ["<article", "BlogPosting", GDS_PROD_PUBLISHED_SLUG],
    }),
    probeUrl("gds-cap-deferred", deferredUrl, { expectStatus: 404 }),
  ]);

  const probes = [published, deferred];

  if (published.ok) {
    try {
      const res = await fetch(publishedUrl, { cache: "no-store" });
      const html = await res.text();
      const dates = jsonLdDateModifiedValues(html);
      if (dates.length === 0) {
        probes.push({
          name: "gds-schema-dates",
          ok: false,
          detail: `${publishedUrl} missing BlogPosting dateModified in JSON-LD`,
        });
      } else {
        const bad = dates.filter((d) => !SCHEMA_ISO.test(d));
        probes.push({
          name: "gds-schema-dates",
          ok: bad.length === 0,
          detail:
            bad.length === 0
              ? `dateModified ISO OK (${dates[0]})`
              : `invalid dateModified: ${bad.join(", ")}`,
        });
      }
      if (!html.includes('"@type":"ProfilePage"') && !html.includes('"@type": "ProfilePage"')) {
        probes.push({
          name: "gds-no-profile-page",
          ok: true,
          detail: "blog page has no ProfilePage schema",
        });
      }
    } catch (error) {
      probes.push({
        name: "gds-schema-dates",
        ok: false,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return probes;
}
