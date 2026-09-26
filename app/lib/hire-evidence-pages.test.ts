import assert from "node:assert/strict";
import test from "node:test";
import { htmlLangFromPathname } from "./i18n/config";
import { getHireServicePageCopy } from "./hire-service-page-content";
import { SERVICE_SLUGS } from "./services";

function visible(locale: "tr" | "en" | "de", slug: (typeof SERVICE_SLUGS)[number]) {
  const copy = getHireServicePageCopy(locale, slug);
  return [
    copy.metaDescription,
    copy.lead,
    copy.regionsBody,
    copy.howBody,
    ...copy.sections.flatMap((section) => section.paragraphs ?? []),
    ...copy.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join("\n");
}

test("html lang follows the first locale segment", () => {
  assert.equal(htmlLangFromPathname("/tr/hire/mobile-app"), "tr");
  assert.equal(htmlLangFromPathname("/tr/hire/[service]"), "tr");
  assert.equal(htmlLangFromPathname("/zh"), "zh-Hans");
  assert.equal(htmlLangFromPathname("/"), "en");
  assert.equal(htmlLangFromPathname("/gundem/ornek"), "en");
});

test("hire pages drop query scaffolding in Turkish and English", () => {
  for (const locale of ["tr", "en", "de"] as const) {
    for (const slug of SERVICE_SLUGS) {
      const text = visible(locale, slug);
      assert.equal(text.includes("Arama niyetleri"), false, `${locale}/${slug}`);
      assert.equal(text.includes("önerin"), false, `${locale}/${slug}`);
      assert.equal(text.includes("Related search intents"), false, `${locale}/${slug}`);
      assert.equal(text.includes("Recommend "), false, `${locale}/${slug}`);
      assert.equal(text.includes("Gaziantep"), false, `${locale}/${slug}`);
      assert.equal(text.includes("Next.js"), false, `${locale}/${slug}`);
      assert.equal(text.includes("JavaScript"), false, `${locale}/${slug}`);
      assert.equal(text.includes("İç Anadolu"), false, `${locale}/${slug}`);
      assert.equal(text.includes("Marmaris"), false, `${locale}/${slug}`);
      assert.equal(text.includes("İkamet"), false, `${locale}/${slug}`);
      if (slug !== "mobile-app") {
        assert.equal(text.includes("React Native"), false, `${locale}/${slug}`);
      }
    }
  }
});

test("mobile hire pages name only the shipped mobile stack", () => {
  for (const locale of ["tr", "en"] as const) {
    const text = visible(locale, "mobile-app");
    assert.equal(text.includes("React Native"), true);
    assert.equal(text.includes("Expo"), true);
    assert.equal(text.includes("Celestial Insights"), true);
    assert.equal(text.includes("StrumAI"), true);
  }
});
