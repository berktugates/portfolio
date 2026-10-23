import { test, expect } from "@playwright/test";
import { localeMeta } from "../app/lib/i18n/config";

const fixtureSlug = process.env.GROWTHDAILY_E2E_SLUG;
const LOCALES = ["tr", "de", "fr", "it", "zh", "ja"] as const;

test.describe("GrowthDailySEO R2 blog", () => {
  test.skip(!fixtureSlug, "Set GROWTHDAILY_E2E_SLUG after first live publish");

  test("EN is published; locale pages exist only for hreflang-advertised locales", async ({ page }) => {
    const slug = fixtureSlug!;
    const response = await page.goto(`/blogs/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("article h1")).toBeVisible();
    await expect(page.getByText(/min read|dk okuma|Min\./i).first()).toBeVisible();

    // R2 `locales` drives hreflang; GDS may ingest EN only, so derive expectations from the page.
    const advertised = new Set(
      await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((links) => links.map((l) => l.getAttribute("hreflang") ?? "")),
    );
    expect(advertised.has("en")).toBe(true);

    for (const locale of LOCALES) {
      const res = await page.goto(`/${locale}/blogs/${slug}`);
      expect(res?.status(), `${locale} final status`).toBe(200);
      if (advertised.has(localeMeta[locale].hreflang)) {
        expect(new URL(page.url()).pathname).toBe(`/${locale}/blogs/${slug}`);
        await expect(page.locator("article h1")).toBeVisible();
      } else {
        // No R2 translation: the site redirects to the canonical EN post (no thin/duplicate locale page).
        expect(new URL(page.url()).pathname).toBe(`/blogs/${slug}`);
      }
    }
  });
});
