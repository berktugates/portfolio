import { expect, test } from "@playwright/test";
import { HABERLER_ORIGIN, PROD_APEX } from "./helpers/e2e-target";

/**
 * Prod-only invariants (absolute URLs). CI: `pnpm test:e2e:prod`.
 * Mirrors `check:ops` gundem-redirect + haberler smoke; keeps E2E symmetry with GUN-0.
 */
test.describe("Prod smoke @prod", () => {
  test("GUN-0 apex /gundem redirects to haberler", async ({ request }) => {
    const res = await request.get(`${PROD_APEX}/gundem`, { maxRedirects: 0 });
    expect([301, 308]).toContain(res.status());
    expect(res.headers().location).toMatch(/^https:\/\/haberler\.berktugberke\.com/);
  });

  test("haberler origin serves gündem index", async ({ request }) => {
    const res = await request.get(`${HABERLER_ORIGIN}/`);
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain("Türkiye Gündemi");
  });

  test("main sitemap and robots respond", async ({ request }) => {
    expect((await request.get(`${PROD_APEX}/sitemap.xml`)).ok()).toBeTruthy();
    expect((await request.get(`${PROD_APEX}/robots.txt`)).ok()).toBeTruthy();
  });

  test("portfolio pages omit contact@ and personal geo (not project legal)", async ({ request }) => {
    const paths = ["/", "/contact", "/hire", "/hire/geo", "/llms.txt"];
    const forbidden =
      /contact@berktugberke\.com|Marmaris|Muğla|Mugla|Ege Bölgesi|Kenan Evren|Covina,\s*CA/;
    for (const path of paths) {
      const html = await (await request.get(`${PROD_APEX}${path}`)).text();
      expect(html, path).not.toMatch(forbidden);
    }
  });
});
