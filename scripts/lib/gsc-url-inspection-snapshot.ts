import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { GDS_PROD_PUBLISHED_SLUG, gdsProdBlogUrl } from "../../app/lib/gds-prod-fixtures";
import { GIT_BLOG_SCHEMA_PROBE_SLUG } from "./schema-probes";

export type GscUrlInspectionSnapshot = {
  exportedAt?: string;
  property?: string;
  urls?: { url: string }[];
};

export function requiredGscInspectionUrls(): string[] {
  return [
    "https://berktugberke.com/",
    "https://berktugberke.com/hire",
    `https://berktugberke.com/blogs/${GIT_BLOG_SCHEMA_PROBE_SLUG}`,
    gdsProdBlogUrl(GDS_PROD_PUBLISHED_SLUG),
  ];
}

export async function validateGscUrlInspectionSnapshot(root: string): Promise<{
  ok: boolean;
  detail: string;
}> {
  const id = "gsc-inspection-snapshot";
  try {
    const snap = JSON.parse(
      await readFile(resolve(root, "docs/gsc-url-inspection.snapshot.json"), "utf8"),
    ) as GscUrlInspectionSnapshot;
    const listed = new Set((snap.urls ?? []).map((u) => u.url));
    const missing = requiredGscInspectionUrls().filter((u) => !listed.has(u));
    if (missing.length > 0) {
      return { ok: false, detail: `missing URLs: ${missing.join(", ")}` };
    }
    return {
      ok: true,
      detail: `${listed.size} URLs (exportedAt=${snap.exportedAt ?? "?"}, property=${snap.property ?? "?"})`,
    };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}
