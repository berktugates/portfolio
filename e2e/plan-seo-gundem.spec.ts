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
    await expect(page.getByRole("heading", { name: "Türkiye Gündemi", level: 1 })).toBeVisible();
    await expect(page.locator("[data-haberler-nav]")).toBeVisible();
    await expect(page.getByRole("link", { name: "BBA ana sayfa" })).toBeVisible();
  });

  test("GUN-5 mobile category sheet anchors to viewport bottom", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/gundem");
    await page.getByRole("button", { name: "Kategorileri aç" }).click();
    const overlay = page.locator("[data-haberler-mobile-sheet]");
    const sheet = page.locator("#haberler-mobile-menu");
    await expect(overlay).toHaveAttribute("data-state", "open");
    await expect(sheet.getByText("Gündem alanı seçin")).toBeVisible();
    await page.waitForFunction(() => {
      const root = document.querySelector("[data-haberler-mobile-sheet]");
      const el = document.getElementById("haberler-mobile-menu");
      if (!root || root.getAttribute("data-state") !== "open" || !el) return false;
      const rect = el.getBoundingClientRect();
      return Math.abs(rect.bottom - window.innerHeight) <= 2;
    });
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    const rect = await sheet.evaluate((el) => el.getBoundingClientRect());
    expect(rect.bottom).toBeGreaterThanOrEqual(viewport!.height - 2);
    expect(rect.bottom).toBeLessThanOrEqual(viewport!.height + 2);
    await sheet.getByRole("button", { name: "Kapat" }).click();
    await expect(overlay).toHaveAttribute("data-state", "closed");
    await expect(overlay).toHaveAttribute("aria-hidden", "true");
  });

  test("GUN-2 detail has a cover, sources, and one portfolio link", async ({ page }) => {
    await page.goto("/gundem/turkiye-gram-altin-brifing");
    const html = await page.content();
    expect(html).toContain("NewsArticle");
    expect(html).not.toContain("Stok görsel");
    expect(html).not.toContain("Olay fotoğrafı değildir");
    expect(html).not.toMatch(/i\.hurimg|gettyimages|shutterstock/);
    await expect(page.locator("[data-gundem-cover]")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Kaynaklar" })).toBeVisible();
    await expect(page.locator("[data-gundem-chat-dock]")).toBeVisible();
    await expect(page.locator('a[href="https://berktugberke.com"]')).toHaveCount(1);
    await expect(page.getByText(/haber ajansı servisi değildir/i)).toHaveCount(0);
    await expect(page.getByText(/Pexels \(pexels\)/i)).toHaveCount(0);
  });

  test("GUN-4 index is a pictured grid", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/gundem");
    const cards = page.locator("[data-gundem-card]");
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator("[data-gundem-cover]")).toBeVisible();
    }
    await expect(page.locator("[data-gundem-carousel] [data-gundem-card='hero'] time")).not.toHaveText(
      /^\d{4}-\d{2}-\d{2}$/,
    );
    await expect(page.getByText("Stok görsel")).toHaveCount(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1);
    expect(overflow).toBe(true);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator("[data-gundem-carousel] [data-gundem-cover]").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "En çok okunanlar" })).toBeVisible();
    await expect(page.getByText(/\d[\d.]* okuma/).first()).toBeVisible();
  });

  test("GUN-3 sitemap-gundem lists slug", async ({ request }) => {
    const res = await request.get("/sitemap-gundem.xml");
    expect(res.ok()).toBeTruthy();
    const xml = await res.text();
    expect(xml).toContain("haberler.berktugberke.com/turkiye-gram-altin-brifing");
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
