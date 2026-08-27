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
  `Validated ${legalPageCount} localized legal pages, reciprocal sitemap hreflang, and ProfilePage structured data.`,
);
