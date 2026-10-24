/**
 * Prod structured-data probes for GSC / Rich Results alignment.
 */
export type SchemaProbe = { id: string; ok: boolean; detail: string };

const ISO_DT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

function parseJsonLd(html: string): unknown[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => JSON.parse(m[1]) as unknown,
  );
}

function graphNodes(html: string): Record<string, unknown>[] {
  return parseJsonLd(html).flatMap((block) => {
    const b = block as { "@graph"?: Record<string, unknown>[] };
    return b["@graph"] ?? [block as Record<string, unknown>];
  });
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store", redirect: "follow" });
  if (!res.ok) throw new Error(`${url} HTTP ${res.status}`);
  return res.text();
}

export async function probeHomeProfilePageNoDateModified(): Promise<SchemaProbe> {
  const id = "schema-home-profile";
  try {
    const html = await fetchHtml("https://berktugberke.com/");
    const profile = graphNodes(html).find((n) => n["@type"] === "ProfilePage");
    if (!profile) return { id, ok: false, detail: "ProfilePage missing on apex home" };
    if ("dateModified" in profile && profile.dateModified != null) {
      return { id, ok: false, detail: `ProfilePage must not have dateModified (${String(profile.dateModified)})` };
    }
    if (html.includes('"dateModified"') && html.includes("ProfilePage")) {
      const block = html.match(/ProfilePage[\s\S]{0,400}dateModified/);
      if (block) return { id, ok: false, detail: "ProfilePage block contains dateModified in HTML" };
    }
    return { id, ok: true, detail: "ProfilePage without dateModified (apex)" };
  } catch (error) {
    return { id, ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}

/** Stable git-queue post (7-locale overlay); prod schema regression anchor. */
export const GIT_BLOG_SCHEMA_PROBE_SLUG = "reducing-flaky-e2e-tests-in-expo-apps";

export async function probeBlogPostingIsoDates(
  slug: string,
  id = "schema-blog-iso",
): Promise<SchemaProbe> {
  const url = `https://berktugberke.com/blogs/${slug}`;
  try {
    const html = await fetchHtml(url);
    const posting = graphNodes(html).find((n) => n["@type"] === "BlogPosting");
    if (!posting) return { id, ok: false, detail: `${url} missing BlogPosting` };
    const pub = posting.datePublished;
    const mod = posting.dateModified ?? posting.datePublished;
    if (typeof pub !== "string" || !ISO_DT.test(pub)) {
      return { id, ok: false, detail: `datePublished invalid: ${String(pub)}` };
    }
    if (typeof mod !== "string" || !ISO_DT.test(mod)) {
      return { id, ok: false, detail: `dateModified invalid: ${String(mod)}` };
    }
    return { id, ok: true, detail: `BlogPosting ISO OK (${String(mod)})` };
  } catch (error) {
    return { id, ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}

export async function probeHireNoDateModified(): Promise<SchemaProbe> {
  const id = "schema-hire-no-dm";
  try {
    const html = await fetchHtml("https://berktugberke.com/hire");
    if (html.includes("dateModified")) {
      return { id, ok: false, detail: "/hire contains dateModified in HTML" };
    }
    return { id, ok: true, detail: "/hire has no dateModified" };
  } catch (error) {
    return { id, ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}

export async function probeGtmSinglePath(): Promise<SchemaProbe> {
  const id = "gtm-single-container";
  try {
    const html = await fetchHtml("https://berktugberke.com/blogs");
    const gtm = (html.match(/GTM-[A-Z0-9]+/g) ?? []).length;
    const directGa = html.includes("gtag/js?id=G-") && html.includes("googletagmanager.com/gtag/js");
    if (gtm < 1) return { id, ok: false, detail: "missing GTM container" };
    if (directGa) return { id, ok: false, detail: "direct gtag.js + GTM double-count risk" };
    return { id, ok: true, detail: "GTM only, no duplicate gtag on /blogs" };
  } catch (error) {
    return { id, ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}

export async function runSchemaProbes(gdsBlogSlug: string): Promise<SchemaProbe[]> {
  return Promise.all([
    probeHomeProfilePageNoDateModified(),
    probeBlogPostingIsoDates(gdsBlogSlug, "schema-gds-blog-iso"),
    probeBlogPostingIsoDates(GIT_BLOG_SCHEMA_PROBE_SLUG, "schema-git-blog-iso"),
    probeHireNoDateModified(),
    probeGtmSinglePath(),
  ]);
}
