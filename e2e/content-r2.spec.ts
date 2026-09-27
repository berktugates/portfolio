import { test, expect } from "@playwright/test";

const contentBase = process.env.CONTENT_PUBLIC_BASE_URL?.replace(/\/$/, "");

test.describe("content R2 (optional staging)", () => {
  test.skip(!contentBase, "CONTENT_PUBLIC_BASE_URL not set");

  test("N1: gundem index returns seed slugs when configured", async ({ request }) => {
    const res = await request.get(`${contentBase}/gundem/index.json`);
    expect(res.ok()).toBeTruthy();
    const data = (await res.json()) as { posts: { slug: string }[] };
    const slugs = data.posts?.map((p) => p.slug) ?? [];
    expect(slugs).toContain("turkiye-gram-altin-brifing");
  });

  test("N2: gram altın cover image URL is reachable", async ({ request }) => {
    const res = await request.get(`${contentBase}/gundem/turkiye-gram-altin-brifing.json`);
    expect(res.ok()).toBeTruthy();
    const post = (await res.json()) as { image?: { src?: string } };
    const img = post.image?.src;
    expect(img).toBeTruthy();
    const imgRes = await request.head(img!);
    expect(imgRes.status()).toBeLessThan(400);
  });
});

test("N3: /gundem UI shows Haberler (local merge)", async ({ page }) => {
  await page.goto("/gundem");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Haberler");
});
