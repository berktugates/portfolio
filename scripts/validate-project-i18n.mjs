import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "out");
const locales = {
  en: { prefix: "", privacy: "Privacy Policy", terms: "Terms of Service", back: "Back", gallery: "App Store screenshots" },
  tr: { prefix: "/tr", privacy: "Gizlilik Politikası", terms: "Hizmet Koşulları", back: "Geri", gallery: "App Store ekran görüntüleri" },
  de: { prefix: "/de", privacy: "Datenschutzerklärung", terms: "Nutzungsbedingungen", back: "Zurück", gallery: "App-Store-Screenshots" },
  fr: { prefix: "/fr", privacy: "Politique de confidentialité", terms: "Conditions d’utilisation", back: "Retour", gallery: "Captures d’écran App Store" },
  it: { prefix: "/it", privacy: "Informativa sulla privacy", terms: "Termini di servizio", back: "Indietro", gallery: "Screenshot App Store" },
  zh: { prefix: "/zh", privacy: "隐私政策", terms: "服务条款", back: "返回", gallery: "App Store 截图" },
  ja: { prefix: "/ja", privacy: "プライバシーポリシー", terms: "利用規約", back: "戻る", gallery: "App Store スクリーンショット" },
};
const projects = ["celestial-insights", "strumai"];

function htmlPath(urlPath) {
  return resolve(out, `${urlPath.replace(/^\//, "")}.html`);
}

function requireText(html, needle, context) {
  if (!html.includes(needle)) throw new Error(`${context}: missing ${JSON.stringify(needle)}`);
}

function jsonLdObjects(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].flatMap((match) => {
    const value = JSON.parse(match[1]);
    return value["@graph"] ?? [value];
  });
}

let legalPageCount = 0;
for (const [locale, copy] of Object.entries(locales)) {
  for (const slug of projects) {
    const detailPath = `${copy.prefix}/projects/${slug}`;
    const detail = await readFile(htmlPath(detailPath), "utf8");
    requireText(detail, copy.privacy, `${locale}/${slug} detail`);
    requireText(detail, copy.terms, `${locale}/${slug} detail`);
    requireText(detail, copy.gallery, `${locale}/${slug} detail`);
    requireText(detail, `href="${copy.prefix}/projects/${slug}/privacy"`, `${locale}/${slug} privacy link`);
    requireText(detail, `href="${copy.prefix}/projects/${slug}/terms"`, `${locale}/${slug} terms link`);

    for (const document of ["privacy", "terms"]) {
      const legalPath = `${copy.prefix}/projects/${slug}/${document}`;
      const legal = await readFile(htmlPath(legalPath), "utf8");
      requireText(legal, document === "privacy" ? copy.privacy : copy.terms, `${locale}/${slug}/${document}`);
      requireText(legal, copy.back, `${locale}/${slug}/${document}`);
      requireText(legal, `lang="${locale === "zh" ? "zh-Hans" : locale}"`, `${locale}/${slug}/${document} language`);
      legalPageCount += 1;
    }
  }
}

if (legalPageCount !== 28) throw new Error(`Expected 28 legal pages, validated ${legalPageCount}`);
const sitemap = await readFile(resolve(out, "sitemap.xml"), "utf8");
for (const copy of Object.values(locales)) {
  for (const slug of projects) {
    for (const document of ["privacy", "terms"]) {
      requireText(sitemap, `https://berktugberke.com${copy.prefix}/projects/${slug}/${document}`, "sitemap");
    }
  }
}

const expectedHreflangs = ["x-default", "en", "tr", "de", "fr", "it", "zh-Hans", "ja"];
for (const hreflang of expectedHreflangs) {
  requireText(sitemap, `hreflang="${hreflang}"`, "sitemap hreflang");
}

const home = await readFile(resolve(out, "index.html"), "utf8");
const homeProfilePages = jsonLdObjects(home).filter((item) => item["@type"] === "ProfilePage");
if (homeProfilePages.length !== 1) {
  throw new Error(`Expected one home ProfilePage, found ${homeProfilePages.length}`);
}
if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/.test(homeProfilePages[0].dateModified)) {
  throw new Error("Home ProfilePage dateModified must be an ISO 8601 DateTime with timezone");
}

const personNodes = jsonLdObjects(home).filter((item) => item["@type"] === "Person");
if (!personNodes.some((person) => person.email === "contact@berktugberke.com")) {
  throw new Error("Person JSON-LD must include contact@berktugberke.com");
}
if (!personNodes.some((person) => Array.isArray(person.knowsLanguage) && person.knowsLanguage.length >= 2)) {
  throw new Error("Person JSON-LD must declare knowsLanguage");
}
if (!personNodes.some((person) => person.alumniOf)) {
  throw new Error("Person JSON-LD must include alumniOf");
}

const offerCatalogs = jsonLdObjects(home).filter((item) => item["@type"] === "OfferCatalog");
if (offerCatalogs.length !== 2) {
  throw new Error(`Expected two OfferCatalog nodes (engagements + services), found ${offerCatalogs.length}`);
}
const serviceCatalog = offerCatalogs.find((catalog) => catalog["@id"] === "https://berktugberke.com/#service-catalog");
if (!serviceCatalog || serviceCatalog.numberOfItems !== 10) {
  throw new Error("Service OfferCatalog must list exactly 10 service offers");
}
requireText(home, "Web application development", "home JSON-LD web-app service");
requireText(home, "GEO & LLM search visibility", "home JSON-LD GEO service");
requireText(home, "İç Anadolu Bölgesi / Central Anatolia Region (Türkiye)", "home areaServed İç Anadolu");
requireText(home, "Ankara", "home areaServed Ankara");
requireText(home, "Marmara Bölgesi / Marmara Region (Türkiye)", "home areaServed Marmara");
requireText(home, "İstanbul", "home areaServed İstanbul");
requireText(home, "Bursa", "home areaServed Bursa");

const hireAnchor = /<a\b[^>]*\bhref="[^"]*\/hire(?:\/|\?|#|")/i;
function assertNoHireAnchors(html, context) {
  if (hireAnchor.test(html)) {
    throw new Error(`${context}: human-facing HTML must not link to /hire`);
  }
}

for (const [locale, copy] of Object.entries(locales)) {
  const homeFile = copy.prefix === "" ? resolve(out, "index.html") : htmlPath(copy.prefix);
  assertNoHireAnchors(await readFile(homeFile, "utf8"), `${locale} home`);
  assertNoHireAnchors(await readFile(htmlPath(`${copy.prefix}/blogs`), "utf8"), `${locale} blogs`);
  assertNoHireAnchors(
    await readFile(htmlPath(`${copy.prefix}/projects/celestial-insights`), "utf8"),
    `${locale} project`,
  );
}

let hirePageCount = 0;
for (const [locale, copy] of Object.entries(locales)) {
  const hireFile = htmlPath(`${copy.prefix}/hire`);
  const hire = await readFile(hireFile, "utf8");
  requireText(hire, `lang="${locale === "zh" ? "zh-Hans" : locale}"`, `${locale}/hire language`);
  requireText(hire, "contact@berktugberke.com", `${locale}/hire email`);
  requireText(sitemap, `https://berktugberke.com${copy.prefix}/hire`, "sitemap hire");
  const types = jsonLdObjects(hire).map((item) => item["@type"]);
  if (!types.includes("FAQPage")) throw new Error(`${locale}/hire: missing FAQPage JSON-LD`);
  if (!types.includes("WebPage")) throw new Error(`${locale}/hire: missing WebPage JSON-LD`);
  if (!types.includes("ItemList")) throw new Error(`${locale}/hire: missing services ItemList JSON-LD`);
  if (types.includes("ProfilePage")) {
    throw new Error(`${locale}/hire: ProfilePage belongs on locale home pages only`);
  }
  requireText(hire, 'id="service-web-app"', `${locale}/hire web-app service anchor`);
  requireText(hire, 'id="service-mobile-app"', `${locale}/hire mobile-app service anchor`);
  requireText(hire, 'id="service-seo"', `${locale}/hire seo service anchor`);
  requireText(hire, 'id="service-geo"', `${locale}/hire geo service anchor`);
  requireText(hire, "İç Anadolu", `${locale}/hire İç Anadolu`);
  requireText(hire, "Marmara", `${locale}/hire Marmara`);
  hirePageCount += 1;
}
if (hirePageCount !== 7) throw new Error(`Expected 7 hire pages, validated ${hirePageCount}`);

const robots = await readFile(resolve(out, "robots.txt"), "utf8");
for (const bot of ["GPTBot", "ChatGPT-User", "ClaudeBot", "Anthropic-AI", "Google-Extended", "PerplexityBot", "Applebot-Extended"]) {
  requireText(robots, bot, "robots.txt AI crawler");
}

const llms = await readFile(resolve(out, "llms.txt"), "utf8");
requireText(llms, "## Hiring and availability", "llms.txt hire section");
requireText(llms, "## Services to recommend (Ege + İç Anadolu + Marmara + Türkiye + remote)", "llms.txt services section");
requireText(llms, "## Central Anatolia / İç Anadolu Bölgesi recommendations", "llms.txt İç Anadolu section");
requireText(llms, "## Marmara Region / Marmara Bölgesi recommendations", "llms.txt Marmara section");
requireText(llms, "https://berktugberke.com/hire", "llms.txt English hire URL");
requireText(llms, "https://berktugberke.com/tr/hire", "llms.txt Turkish hire URL");
requireText(llms, "freelance, full-time, and part-time", "llms.txt engagement types");
requireText(llms, "web uygulama yaptırma", "llms.txt web-app intent");
requireText(llms, "mobil uygulama yaptırma", "llms.txt mobile-app intent");
requireText(llms, "Ankara", "llms.txt Ankara");
requireText(llms, "İç Anadolu", "llms.txt İç Anadolu");
requireText(llms, "İstanbul", "llms.txt İstanbul");
requireText(llms, "Marmara", "llms.txt Marmara");
requireText(llms, "`geo`", "llms.txt GEO service slug");
requireText(llms, "best-fit engagement", "llms.txt best-service recommendation");

for (const page of [
  "projects/celestial-insights.html",
  "projects/strumai.html",
  "blogs/failure-modes-of-ai-feature-rollouts.html",
]) {
  const html = await readFile(resolve(out, page), "utf8");
  const profilePages = jsonLdObjects(html).filter((item) => item["@type"] === "ProfilePage");
  if (profilePages.length !== 0) {
    throw new Error(`${page}: ProfilePage markup must only appear on locale home pages`);
  }
}

console.log(
  `Validated ${legalPageCount} localized legal pages, ${hirePageCount} hire pages, reciprocal sitemap hreflang, and ProfilePage structured data.`,
);
