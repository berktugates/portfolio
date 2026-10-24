/**
 * Prod GTM dataLayer — `page_context` + `content_group` (client beacon).
 */
import { chromium, type Browser } from "@playwright/test";
import { GDS_PROD_PUBLISHED_SLUG, gdsProdBlogUrl } from "../../app/lib/gds-prod-fixtures";

export type DatalayerProbe = { id: string; ok: boolean; detail: string };

type PageContextEvent = {
  event?: string;
  content_group?: string;
  page_locale?: string;
  page_path?: string;
};

async function waitForPageContext(page: import("@playwright/test").Page, timeoutMs = 25_000): Promise<PageContextEvent> {
  await page.waitForFunction(
    () => {
      const dl = (window as unknown as { dataLayer?: PageContextEvent[] }).dataLayer ?? [];
      return dl.some((e) => e?.event === "page_context" && typeof e.content_group === "string");
    },
    { timeout: timeoutMs },
  );
  return page.evaluate(() => {
    const dl = (window as unknown as { dataLayer?: PageContextEvent[] }).dataLayer ?? [];
    const hit = [...dl].reverse().find((e) => e?.event === "page_context");
    return hit ?? {};
  });
}

async function probeOne(
  browser: Browser,
  id: string,
  url: string,
  expectedGroup: string,
): Promise<DatalayerProbe> {
  const page = await browser.newPage();
  try {
    const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    if (!res?.ok()) {
      return { id, ok: false, detail: `${url} HTTP ${res?.status() ?? "?"}` };
    }
    const evt = await waitForPageContext(page);
    if (evt.content_group !== expectedGroup) {
      return {
        id,
        ok: false,
        detail: `expected content_group=${expectedGroup}, got ${String(evt.content_group)} (${url})`,
      };
    }
    if (typeof evt.page_path !== "string" || !evt.page_path.startsWith("/")) {
      return { id, ok: false, detail: `missing page_path on page_context (${url})` };
    }
    return {
      id,
      ok: true,
      detail: `${expectedGroup} @ ${evt.page_path} (locale=${String(evt.page_locale ?? "?")})`,
    };
  } catch (error) {
    return { id, ok: false, detail: error instanceof Error ? error.message : String(error) };
  } finally {
    await page.close();
  }
}

async function probeNoDuplicateGtagConfig(page: import("@playwright/test").Page): Promise<DatalayerProbe> {
  const id = "gtm-no-double-config";
  const counts = await page.evaluate(() => {
    const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer ?? [];
    let config = 0;
    for (const entry of dl) {
      if (Array.isArray(entry) && entry[0] === "config") config += 1;
    }
    const scripts = [...document.querySelectorAll("script[src]")]
      .map((s) => s.getAttribute("src") ?? "")
      .filter((src) => src.includes("googletagmanager.com/gtag/js"));
    return { config, directGtagScripts: scripts.length };
  });
  if (counts.directGtagScripts > 0) {
    return { id, ok: false, detail: `direct gtag.js script count=${counts.directGtagScripts}` };
  }
  if (counts.config > 1) {
    return { id, ok: false, detail: `dataLayer gtag config calls=${counts.config} (double page_view risk)` };
  }
  return { id, ok: true, detail: `gtag config calls=${counts.config}, no direct gtag.js` };
}

export async function runDatalayerProbes(): Promise<DatalayerProbe[]> {
  const browser = await chromium.launch({ headless: true });
  try {
    const cases: [string, string, string][] = [
      ["dl-home-other", "https://berktugberke.com/", "other"],
      ["dl-blog", gdsProdBlogUrl(GDS_PROD_PUBLISHED_SLUG), "blog"],
      ["dl-hire", "https://berktugberke.com/hire", "hire"],
      ["dl-gundem", "https://haberler.berktugberke.com/gundem", "gundem"],
    ];
    const results: DatalayerProbe[] = [];
    for (const [id, url, group] of cases) {
      results.push(await probeOne(browser, id, url, group));
    }
    const page = await browser.newPage();
    try {
      await page.goto("https://berktugberke.com/blogs", { waitUntil: "domcontentloaded", timeout: 60_000 });
      await waitForPageContext(page);
      results.push(await probeNoDuplicateGtagConfig(page));
    } finally {
      await page.close();
    }
    return results;
  } finally {
    await browser.close();
  }
}
