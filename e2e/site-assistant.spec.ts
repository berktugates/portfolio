import { expect, test } from "@playwright/test";

const MOBILE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 800 };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.removeItem("site-assistant-messages");
    sessionStorage.setItem("blog-subscribe-prompted", "1");
  });
});

async function assertSendInsideBar(page: import("@playwright/test").Page) {
  const bar = page.locator(".hw-dock-bar").first();
  const send = page.getByRole("button", { name: /Send|Gönder/i }).first();
  await expect(bar).toBeVisible();
  await expect(send).toBeVisible();
  const barBox = await bar.boundingBox();
  const sendBox = await send.boundingBox();
  expect(barBox).not.toBeNull();
  expect(sendBox).not.toBeNull();
  if (barBox && sendBox) {
    expect(sendBox.x + sendBox.width).toBeLessThanOrEqual(barBox.x + barBox.width + 2);
    expect(sendBox.x).toBeGreaterThanOrEqual(barBox.x - 2);
  }
}

test.describe("site assistant home dock", () => {
  test.use({ viewport: MOBILE });

  test("send button stays inside input bar on mobile", async ({ page }) => {
    await page.goto("/");
    const input = page.getByRole("textbox", { name: /How can I help/i });
    await input.click();
    await assertSendInsideBar(page);
  });

  test("outside click closes chat panel but keeps dock input", async ({ page }) => {
    await page.goto("/");
    const input = page.getByRole("textbox", { name: /How can I help/i });
    await input.click();
    const suggestion = page.locator(".hw-dock-suggestion").first();
    await expect(suggestion).toBeVisible({ timeout: 10_000 });
    await suggestion.click();
    const panel = page.locator(".site-assistant-chat-panel");
    await expect(panel).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(".hw-dock-send-spinner")).toHaveCount(0, { timeout: 20_000 });
    await page.getByTestId("site-assistant-home-backdrop").click({ force: true });
    await expect(panel).not.toBeAttached({ timeout: 5_000 });
    await expect(input).toBeVisible();
  });
});

test.describe("site assistant blog dock", () => {
  test.use({ viewport: MOBILE });

  test("close control returns to FAB on /blogs", async ({ page }) => {
    await page.goto("/blogs");
    const fab = page.getByTestId("site-assistant-fab");
    await fab.click();
    const shell = page.locator(".site-assistant-input-shell");
    await expect(shell.getByRole("textbox", { name: /How can I help/i })).toBeVisible({ timeout: 10_000 });
    await page.getByTestId("site-assistant-dock-close").click();
    await expect(fab).toBeVisible({ timeout: 5_000 });
  });

  test("input bar layout on blog detail", async ({ page }) => {
    await page.goto("/blogs/release-trains-for-ai-assisted-products");
    await page.getByTestId("site-assistant-fab").click();
    await assertSendInsideBar(page);
  });
});

test.describe("site assistant desktop", () => {
  test.use({ viewport: DESKTOP });

  test("home dock bar width is constrained on large screens", async ({ page }) => {
    await page.goto("/");
    const stack = page.locator("[data-testid=site-assistant-dock-host] .hw-dock-stack");
    await page.getByRole("textbox", { name: /How can I help/i }).click();
    const box = await stack.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeLessThanOrEqual(416);
    }
  });
});
