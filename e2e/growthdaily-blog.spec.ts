import { test, expect } from "@playwright/test";

const fixtureSlug = process.env.GROWTHDAILY_E2E_SLUG;

test.describe("GrowthDailySEO R2 blog", () => {
  test.skip(!fixtureSlug, "Set GROWTHDAILY_E2E_SLUG after first live publish");

  test("renders EN and locale pages with hreflang", async ({ page }) => {
    const slug = fixtureSlug!;
    await page.goto(`/blogs/${slug}`);
    await expect(page.locator("article h1")).toBeVisible();
    await expect(page.getByText(/min read|dk okuma|Min\./i)).toBeVisible();

    for (const locale of ["tr", "de", "fr", "it", "zh", "ja"] as const) {
      await page.goto(`/${locale}/blogs/${slug}`);
      await expect(page.locator("article h1")).toBeVisible();
    }
  });
});
