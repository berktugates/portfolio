import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("blog-subscribe-prompted", "1");
  });
});

function jsonLdBlocks(html: string): unknown[] {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return blocks.map((match) => JSON.parse(match[1]) as unknown);
}

function personNode(html: string): { alternateName?: string[]; jobTitle?: string[]; sameAs?: string[] } {
  for (const block of jsonLdBlocks(html)) {
    const graph = (block as { "@graph"?: { "@type"?: string }[] })["@graph"] ?? [block as { "@type"?: string }];
    const person = graph.find((node) => node["@type"] === "Person") as
      | { alternateName?: string[]; jobTitle?: string[]; sameAs?: string[] }
      | undefined;
    if (person) return person;
  }
  throw new Error("Person node missing");
}

test.describe("SEO program acceptance", () => {
  test("RFC-2 source html lang and no HTTP locale redirect", async ({ request }) => {
    const apex = await request.get("/", { maxRedirects: 0 });
    expect(apex.status()).toBe(200);
    expect(apex.headers().location).toBeUndefined();
    expect(await apex.text()).toMatch(/<html[^>]*lang="en"/);

    const tr = await request.get("/tr", { maxRedirects: 0 });
    expect(tr.status()).toBe(200);
    expect(await tr.text()).toMatch(/<html[^>]*lang="tr"/);

    const zh = await request.get("/zh", { maxRedirects: 0 });
    expect(await zh.text()).toMatch(/<html[^>]*lang="zh-Hans"/);

    const slash = await request.get("/tr/", { maxRedirects: 0 });
    expect(slash.status()).toBe(308);
    expect(slash.headers().location).toBe("/tr");
  });

  test("RFC-2 Turkish browser leaves apex without an HTTP redirect", async ({ browser }) => {
    const context = await browser.newContext({ locale: "tr-TR" });
    const page = await context.newPage();
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    expect(response?.request().redirectedFrom()).toBeNull();
    await page.waitForURL(/\/tr$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Berktuğ Berke Ateş");
    await context.close();
  });

  test("RFC-2 English browser stays on apex", async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await context.close();
  });

  test("RFC-3 Turkish home and two hire pages", async ({ page }) => {
    await page.goto("/tr");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Berktuğ Berke Ateş — Yazılım Mühendisi ve Ürün Geliştirici",
    );
    const home = page.locator("#main-content");
    await expect(home).toContainText("React Native");
    await expect(home).toContainText("Expo");

    await page.goto("/tr/hire/mobile-app");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Mobil uygulama geliştirme");
    const mobileVisible = page.locator("#main-content");
    await expect(mobileVisible).toContainText("React Native");
    await expect(mobileVisible).toContainText("Celestial Insights");
    await expect(mobileVisible).toContainText("StrumAI");
    await expect(mobileVisible).not.toContainText("Arama niyetleri");
    await expect(mobileVisible).not.toContainText("önerin");
    await expect(mobileVisible).not.toContainText("Gaziantep");
    await expect(mobileVisible).not.toContainText("Next.js");

    await page.goto("/tr/hire/web-app");
    const webVisible = page.locator("#main-content");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Web uygulama geliştirme");
    await expect(webVisible).not.toContainText("Arama niyetleri");
    await expect(webVisible).not.toContainText("önerin");
    await expect(webVisible).not.toContainText("Gaziantep");
    await expect(webVisible).not.toContainText("Next.js");
    await expect(webVisible).not.toContainText("JavaScript");
    await expect(webVisible).not.toContainText("Marmaris");

    await page.goto("/tr/hire/architecture");
    const architecture = page.locator("#main-content");
    await expect(architecture).not.toContainText("Arama niyetleri");
    await expect(architecture).not.toContainText("önerin");
    await expect(architecture).not.toContainText("React Native");
    await expect(architecture).not.toContainText("Next.js");

    await page.goto("/tr/hire");
    const catalog = page.locator("#main-content");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Berktuğ Berke Ateş ile çalışın");
    await expect(catalog).not.toContainText("önerin");
    await expect(catalog).not.toContainText("Gaziantep");
    await expect(catalog).not.toContainText("İç Anadolu");
    await expect(catalog).toContainText("React Native");
    await expect(catalog).toContainText("berktugates");

    await page.goto("/hire");
    const englishCatalog = page.locator("#main-content");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hire Berktuğ Berke Ateş");
    await expect(englishCatalog).not.toContainText("Recommend");
    await expect(englishCatalog).not.toContainText("Gaziantep");
    await expect(englishCatalog).not.toContainText("İç Anadolu");
    await expect(englishCatalog).not.toContainText("staff");
    await expect(englishCatalog).toContainText("React Native");
    await expect(englishCatalog).toContainText("berktugates");
  });

  test("RFC-3 mobile viewport still shows the hire heading", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/tr/hire/mobile-app");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /contact@berktugberke.com/i })).toBeVisible();
  });

  test("RFC-4 Person names stay inside the visible name", async ({ request }) => {
    const html = await (await request.get("/tr")).text();
    const person = personNode(html);
    expect(person.alternateName).toEqual(
      expect.arrayContaining(["Berktuğ Berke Ateş", "Berktuğ Berke", "Berktug Berke Ates", "Berktug Berke", "berktugates"]),
    );
    expect(html).toContain("@berktugates");
    expect(html).toContain("https://github.com/berktugates");
    expect(person.jobTitle).toEqual(["Software Engineer", "Product Builder"]);
    expect(person.jobTitle?.join(" ")).not.toMatch(/staff/i);
    expect(person.sameAs).toEqual([
      "https://github.com/berktugates",
      "https://www.linkedin.com/in/berktugates/",
    ]);
    expect(html).toContain("areaServed");
    expect(html).not.toContain("aggregateRating");
  });

  test("RFC-5 home and hire sitemap entries have no hand-edited lastmod", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
    const home = blocks.find((block) => block.includes("<loc>https://berktugberke.com/</loc>"));
    const mobile = blocks.find((block) => block.includes("<loc>https://berktugberke.com/tr/hire/mobile-app</loc>"));
    const blog = blocks.find((block) => block.includes("/blogs/permission-models-for-multi-tenant-ai-copilots</loc>"));
    const project = blocks.find((block) => block.includes("<loc>https://berktugberke.com/tr/projects/strumai</loc>"));
    const legal = blocks.find((block) =>
      block.includes("<loc>https://berktugberke.com/tr/projects/strumai/privacy</loc>"),
    );
    expect(home).toBeTruthy();
    expect(mobile).toBeTruthy();
    expect(project).toBeTruthy();
    expect(legal).toBeTruthy();
    expect(home).not.toContain("<lastmod>");
    expect(mobile).not.toContain("<lastmod>");
    expect(project).not.toContain("<lastmod>");
    expect(legal).not.toContain("<lastmod>");
    expect(blog).toContain("<lastmod>");

    const profile = await (await request.get("/tr")).text();
    const hire = await (await request.get("/tr/hire")).text();
    expect(profile).not.toContain("dateModified");
    expect(hire).not.toContain("dateModified");
    const article = await (await request.get("/tr/blogs/permission-models-for-multi-tenant-ai-copilots")).text();
    expect(article).toContain("dateModified");
  });

  test("github streak numbers appear only after a real contribution response", async ({ page }) => {
    await page.route("https://github-contributions-api.jogruber.de/**", (route) => route.abort());
    await page.goto("/tr");
    await expect(page.getByRole("heading", { name: "GitHub Aktivitesi" })).toBeVisible();
    await expect(page.getByText("Güncel Seri")).toHaveCount(0);
    await expect(page.getByText("En Uzun Seri")).toHaveCount(0);

    await page.unroute("https://github-contributions-api.jogruber.de/**");
    await page.route("https://github-contributions-api.jogruber.de/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          contributions: [
            { date: "2026-09-25", count: 0 },
            { date: "2026-09-26", count: 2 },
          ],
        }),
      }),
    );
    await page.goto("/");
    await expect(page.getByText("Current Streak")).toBeVisible();
    const streak = page.getByText("Current Streak").locator("xpath=..");
    await expect(streak.getByText("1", { exact: true })).toBeVisible();
    await expect(page.getByText("Longest Streak").locator("xpath=..").getByText("1", { exact: true })).toBeVisible();
  });

  test("canonical ignores tracking parameters and slash twins", async ({ request }) => {
    const tracked = await (await request.get("/tr?utm_source=newsletter&utm_medium=email")).text();
    const canonicals = [...tracked.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((match) => match[1]);
    expect(canonicals).toEqual(["https://berktugberke.com/tr"]);

    const post = await (
      await request.get("/tr/blogs/permission-models-for-multi-tenant-ai-copilots?utm_campaign=x")
    ).text();
    const postCanonical = "https://berktugberke.com/tr/blogs/permission-models-for-multi-tenant-ai-copilots";
    expect([...post.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((match) => match[1])).toEqual([
      postCanonical,
    ]);
    expect(post).toContain(`property="og:url" content="${postCanonical}"`);
    expect(postCanonical).not.toContain("utm_");
    expect(canonicals.join(" ")).not.toContain("utm_");

    const pageTwo = await (await request.get("/tr/blogs/pages/2")).text();
    expect([...pageTwo.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((match) => match[1])).toEqual([
      "https://berktugberke.com/tr/blogs/pages/2",
    ]);
    expect(pageTwo).toContain('property="og:url" content="https://berktugberke.com/tr/blogs/pages/2"');
    expect(pageTwo.match(/property="og:locale" content="([^"]+)"/)?.[1]).toBe("tr_TR");

    const slash = await request.get("/tr/hire/web-app/", { maxRedirects: 0 });
    expect(slash.status()).toBe(308);
    expect(slash.headers().location).toBe("/tr/hire/web-app");
  });

  test("person schema does not carry a biography the page does not show", async ({ request }) => {
    function nodes(html: string): Array<{ "@type"?: string; description?: string }> {
      return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(
        (match) => {
          const data = JSON.parse(match[1]) as {
            "@type"?: string;
            description?: string;
            "@graph"?: Array<{ "@type"?: string; description?: string }>;
          };
          return data["@graph"] ?? [data];
        },
      );
    }

    const home = nodes(await (await request.get("/tr")).text());
    const person = home.find((node) => node["@type"] === "Person");
    const website = home.find((node) => node["@type"] === "WebSite");
    const profile = home.find((node) => node["@type"] === "ProfilePage");
    expect(person?.description).toBeUndefined();
    expect(website?.description).toBeUndefined();
    expect(profile?.description).toContain("Celestial Insights");
    expect(profile?.description).toContain("React Native");

    const blog = nodes(await (await request.get("/tr/blogs")).text());
    expect(blog.find((node) => node["@type"] === "Person")?.description).toBeUndefined();
    expect(home.find((node) => node["@type"] === "Person") && "knowsAbout" in (home.find((node) => node["@type"] === "Person") ?? {})).toBe(false);
    expect(blog.find((node) => node["@type"] === "Person") && "knowsAbout" in (blog.find((node) => node["@type"] === "Person") ?? {})).toBe(false);
    expect(blog.find((node) => node["@type"] === "WebSite")?.description).toBeUndefined();
    expect(blog.some((node) => node["@type"] === "ProfilePage")).toBe(false);
  });

  test("a locale blog index does not claim a different language page is the same list", async ({ request }) => {
    const index = await (await request.get("/tr/blogs")).text();
    expect(index).toContain('rel="canonical" href="https://berktugberke.com/tr/blogs"');
    expect(index).toContain('hrefLang="x-default" href="https://berktugberke.com/blogs"');
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("https://berktugberke.com/tr/blogs/permission-models-for-multi-tenant-ai-copilots");
    const redirect = await request.get("/tr/blogs/not-a-real-post", { maxRedirects: 0 });
    expect(redirect.status()).toBe(308);
    expect(redirect.headers().location).toBe("/blogs/not-a-real-post");
  });

  test("localized blog feeds serve that language", async ({ request }) => {
    const slug = "zero-downtime-database-migrations";
    const page = await (await request.get(`/tr/blogs/${slug}`)).text();
    expect(page).toContain(`https://berktugberke.com/tr/blogs/${slug}/md`);
    expect(page).toContain("https://berktugberke.com/tr/blogs/rss.xml");
    expect(page).not.toContain(`https://berktugberke.com/blogs/${slug}/md`);

    const markdown = await request.get(`/tr/blogs/${slug}/md`);
    expect(markdown.status()).toBe(200);
    expect(markdown.headers()["content-type"]).toContain("text/markdown");
    const body = await markdown.text();
    expect(body.startsWith("# Pratikte Sıfır Kesintili Veritabanı Taşımaları")).toBe(true);
    expect(body).not.toContain("Zero-Downtime Database Migrations in Practice");

    const feed = await (await request.get("/tr/blogs/rss.xml")).text();
    expect(feed).toContain(`https://berktugberke.com/tr/blogs/${slug}`);
    expect(feed).toContain("Pratikte Sıfır Kesintili Veritabanı Taşımaları");
    expect(feed).not.toContain(`https://berktugberke.com/blogs/${slug}`);
  });

  test("blog author matches the name visible on that language", async ({ request }) => {
    const slug = "zero-downtime-database-migrations";
    const turkish = await (await request.get(`/tr/blogs/${slug}`)).text();
    expect(turkish).toContain('property="article:author" content="Berktuğ Berke Ateş"');
    expect(turkish).toContain('"name":"Berktuğ Berke Ateş"');
    expect(turkish).not.toContain('name="keywords"');
    expect(turkish).not.toContain("article:tag");

    const english = await (await request.get(`/blogs/${slug}`)).text();
    expect(english).toContain('property="article:author" content="Berktug Berke Ates"');
  });

  test("author meta matches the name in the header", async ({ request }) => {
    const turkish = await (await request.get("/tr")).text();
    const english = await (await request.get("/")).text();
    const hire = await (await request.get("/tr/hire/mobile-app")).text();
    const project = await (await request.get("/tr/projects/strumai")).text();
    expect(turkish).toContain('name="author" content="Berktuğ Berke Ateş"');
    expect(turkish).not.toContain('name="author" content="Berktug Berke Ates"');
    expect(turkish).toContain('property="og:site_name" content="Berktuğ Berke Ateş"');
    expect(english).toContain('name="author" content="Berktug Berke Ates"');
    expect(hire).toContain('name="author" content="Berktuğ Berke Ateş"');
    expect(project).toContain('name="author" content="Berktuğ Berke Ateş"');
  });

  test("document title suffix matches the header name", async ({ request }) => {
    const slug = "zero-downtime-database-migrations";
    const turkish = await (await request.get(`/tr/blogs/${slug}`)).text();
    const english = await (await request.get(`/blogs/${slug}`)).text();
    const turkishTitle = turkish.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    const englishTitle = english.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    expect(turkishTitle.endsWith("| Berktuğ Berke Ateş")).toBe(true);
    expect(turkishTitle).not.toContain("Berktug Berke Ates");
    expect(englishTitle.endsWith("| Berktug Berke Ates")).toBe(true);
  });

  test("schema names that label the person use the header name", async ({ request }) => {
    const slug = "zero-downtime-database-migrations";
    const blog = await (await request.get(`/tr/blogs/${slug}`)).text();
    const project = await (await request.get("/tr/projects/strumai")).text();
    const hire = await (await request.get("/tr/hire/mobile-app")).text();
    const crumb = '"@type":"ListItem","position":1,"name":"Berktuğ Berke Ateş"';
    expect(blog).toContain(crumb);
    expect(hire).toContain(crumb);
    expect(project).toContain('"author":{"@id":"https://berktugberke.com/#person","@type":"Person","name":"Berktuğ Berke Ateş"}');
    expect(hire).not.toContain('property="og:site_name" content="Berktug Berke Ates"');
  });

  test("turkish surfaces use the Turkish name and do not invent 09:00", async ({ request }) => {
    const gundem = await (await request.get("/gundem")).text();
    expect(gundem).toContain(">Berktuğ Berke Ateş<");
    const feed = await (await request.get("/tr/blogs/rss.xml")).text();
    expect(feed).toContain("<title>Berktuğ Berke Ateş — Blog</title>");
    expect(feed).toContain("05 Jun 2024 00:00:00 GMT");
    expect(feed).not.toContain("09:00:00 GMT");
  });

  test("project schema does not invent an application category", async ({ request }) => {
    for (const path of ["/projects/strumai", "/tr/projects/celestial-insights"]) {
      const html = await (await request.get(path)).text();
      const json = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
        .map((match) => match[1])
        .join("\n");
      expect(json, path).toContain('"@type":"SoftwareApplication"');
      expect(json, path).not.toContain("applicationCategory");
    }
  });

  test("footer copyright uses the header name", async ({ page }) => {
    const year = String(new Date().getFullYear());
    await page.goto("/tr");
    await expect(page.locator("footer")).toContainText(`© ${year} Berktuğ Berke Ateş`);
    await expect(page.locator("footer")).not.toContainText("Berktug Berke Ates");
    await page.goto("/");
    await expect(page.locator("footer")).toContainText(`© ${year} Berktug Berke Ates`);
    await page.goto("/gundem");
    await expect(page.locator("footer")).toContainText(`© ${year} Berktuğ Berke Ateş`);
  });

  test("blog feed description matches the blog index", async ({ request }) => {
    const turkish = await (await request.get("/tr/blogs/rss.xml")).text();
    const english = await (await request.get("/blogs/rss.xml")).text();
    const turkishChannel = turkish.slice(turkish.indexOf("<channel>"), turkish.indexOf("<item>"));
    const englishChannel = english.slice(english.indexOf("<channel>"), english.indexOf("<item>"));
    expect(turkishChannel).toContain(
      "Yazılım mimarisi, yapay zeka ürün mühendisliği, çapraz platform mobil geliştirme, güvenilirlik, API'ler, erişilebilirlik ve teknik liderlik üzerine uzun form yazılar.",
    );
    expect(turkishChannel).not.toContain("Technical blog posts");
    expect(englishChannel).toContain(
      "Long-form writing on software architecture, AI product engineering, cross-platform mobile development, reliability, APIs, accessibility, and technical leadership.",
    );
  });

  test("revalidate endpoint is not an indexable document", async ({ request }) => {
    const response = await request.get("/api/revalidate", { maxRedirects: 0 });
    expect(response.status()).toBe(405);
    expect(response.headers()["content-type"] ?? "").not.toContain("text/html");
  });

  test("RFC-7 Turkish share card is used only on Turkish URLs", async ({ request }) => {
    const tr = await (await request.get("/tr")).text();
    const en = await (await request.get("/")).text();
    const hire = await (await request.get("/tr/hire/web-app")).text();
    expect(tr).toContain("/tr/opengraph-image");
    expect(tr).not.toContain('content="https://berktugberke.com/opengraph-image"');
    expect(hire).toContain("/tr/opengraph-image");
    expect(en).toContain("/opengraph-image");
    expect(en).not.toContain("/tr/opengraph-image");

    const image = await request.get("/tr/opengraph-image");
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
    const bytes = Buffer.from(await image.body());
    expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(bytes.length).toBeGreaterThan(1000);
  });

  test("schema matches the visible service area and og locale does not leak", async ({ request }) => {
    const pages = ["/tr", "/tr/hire", "/tr/hire/mobile-app", "/tr/projects/strumai", "/tr/blogs"];
    for (const path of pages) {
      const html = await (await request.get(path)).text();
      const locale = html.match(/property="og:locale" content="([^"]+)"/);
      expect(locale?.[1], path).toBe("tr_TR");
      const xDefault = html.match(/hrefLang="x-default" href="([^"]+)"/);
      expect(xDefault?.[1], path).toBeTruthy();
      expect(xDefault?.[1], path).not.toContain("/tr");
      expect(html, path).not.toContain("aggregateRating");
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      expect(blocks.length, path).toBeGreaterThan(0);
      const json = blocks.map((match) => match[1]).join("\n");
      expect(json, path).not.toContain("Gaziantep");
      expect(json, path).not.toContain("Marmaris");
      expect(json, path).not.toContain("homeLocation");
      const ids = new Map<string, string>();
      for (const match of blocks) {
        const data = JSON.parse(match[1]) as { "@graph"?: { "@id"?: string; "@type"?: string }[] };
        for (const node of data["@graph"] ?? []) {
          if (!node["@id"] || !node["@type"]) continue;
          const previous = ids.get(node["@id"]);
          if (previous && previous !== node["@type"]) {
            throw new Error(`${path} @id ${node["@id"]} is both ${previous} and ${node["@type"]}`);
          }
          ids.set(node["@id"], node["@type"]);
        }
      }
    }
    const homeLinks = await (await request.get("/tr")).text();
    expect(homeLinks).toContain('hrefLang="x-default" href="https://berktugberke.com"');

    const service = await (await request.get("/tr/hire/mobile-app")).text();
    const serviceJson = [...service.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((match) => match[1])
      .join("\n");
    expect(serviceJson).toContain('"name":"Türkiye"');
    expect(serviceJson).toContain('"name":"Remote"');
    expect(serviceJson.match(/"@type":"Offer"/g)?.length).toBe(1);

    const blog = await (await request.get("/tr/blogs")).text();
    const blogJson = [...blog.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((match) => match[1])
      .join("\n");
    expect(blogJson).not.toContain('"@type":"Offer"');
    expect(blogJson).not.toContain("OfferCatalog");

    const english = await (await request.get("/")).text();
    expect(english.match(/property="og:locale" content="([^"]+)"/)?.[1]).toBe("en_US");
  });

  test("www host redirects to the apex with 308", async ({ request }) => {
    const response = await request.get("/tr/hire/web-app", {
      maxRedirects: 0,
      headers: { host: "www.berktugberke.com" },
    });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe("https://berktugberke.com/tr/hire/web-app");
  });
});
