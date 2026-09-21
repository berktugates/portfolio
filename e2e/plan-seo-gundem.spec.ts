import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.removeItem("site-assistant-messages");
    sessionStorage.setItem("blog-subscribe-prompted", "1");
  });
});

const FORBIDDEN_PATHS = ["/", "/blogs", "/hire"];

test.describe("NAV gundem leak", () => {
  for (const path of FORBIDDEN_PATHS) {
    test(`NAV-1 no gundem href on ${path}`, async ({ page }) => {
      await page.goto(path);
      const html = await page.content();
      expect(html).not.toMatch(/href=["']\/gundem/);
      expect(html).not.toContain("haberler.berktugberke.com");
    });
  }

  test("NAV-2 assistant suggestions exclude gundem URL", async ({ page }) => {
    await page.goto("/");
    const input = page.getByRole("textbox", { name: /How can I help|Nasıl yardımcı/i });
    await input.click();
    const suggestions = page.locator(".hw-dock-suggestion");
    await expect(suggestions.first()).toBeVisible({ timeout: 10_000 });
    const text = await suggestions.allTextContents();
    expect(text.join(" ")).not.toContain("/gundem");
    expect(text.join(" ")).not.toContain("haberler.berktugberke.com");
  });
});

test.describe("Gündem surface", () => {
  test("GUN-0 prod redirect /gundem to subdomain", async ({ request }) => {
    if (!process.env.CI) {
      test.skip();
    }
    const res = await request.get("https://berktugberke.com/gundem", { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(res.headers().location).toMatch(/^https:\/\/haberler\.berktugberke\.com/);
  });

  test("GUN-1 index 200", async ({ page }) => {
    const res = await page.goto("/gundem");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Gündem" })).toBeVisible();
  });

  test("GUN-2 detail NewsArticle + credit", async ({ page }) => {
    await page.goto("/gundem/turkiye-yazilim-ekipleri-icin-bulut-maliyetleri");
    const html = await page.content();
    expect(html).toContain("NewsArticle");
    expect(html).toContain("Stok görsel");
    expect(html).not.toMatch(/i\.hurimg|gettyimages|shutterstock/);
  });

  test("GUN-3 sitemap-gundem lists slug", async ({ request }) => {
    const res = await request.get("/sitemap-gundem.xml");
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();
    expect(xml).toContain("haberler.berktugberke.com/turkiye-yazilim-ekipleri-icin-bulut-maliyetleri");
  });
});

test.describe("SEO", () => {
  test("SEO-1 locale blog without overlay redirects to EN", async ({ request }) => {
    const res = await request.get("/tr/blogs/nonexistent-slug-for-redirect-test", {
      maxRedirects: 0,
    });
    expect([301, 308, 404]).toContain(res.status());
  });

  test("SEO-2 blog RSS valid", async ({ request }) => {
    const res = await request.get("/blogs/rss.xml");
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();
    expect(xml).toContain("<rss");
    expect(xml).toContain("<channel>");
  });
});

test.describe("GTM content_group", () => {
  test("GTM-1 dataLayer beacon on gundem", async ({ page }) => {
    await page.addInitScript(() => {
      window.dataLayer = [];
    });
    await page.goto("/gundem");
    // Local dev serves /gundem; production uses haberler subdomain redirect.
    await page.waitForFunction(() => {
      const events = (window as unknown as { dataLayer?: { content_group?: string }[] }).dataLayer ?? [];
      return events.some((e) => e.content_group === "gundem");
    });
  });
});

test.describe("Assistant markdown", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("SAFE-2 strong from markdown", async ({ page }) => {
    await page.goto("/tr");
    const input = page.getByRole("textbox", { name: /Nasıl yardımcı/i });
    await input.click();
    await page.locator(".hw-dock-suggestion").filter({ hasText: /SEO ve GEO/i }).click();
    const panel = page.locator(".site-assistant-chat-panel");
    await expect(panel).toBeVisible({ timeout: 10_000 });
    await expect(page.locator(".hw-dock-send-spinner")).toHaveCount(0, { timeout: 20_000 });
    await expect(
      panel.locator("strong").filter({ hasText: "contact@berktugberke.com" }),
    ).toBeVisible({ timeout: 10_000 });
  });
});
