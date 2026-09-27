import { test } from "node:test";
import assert from "node:assert/strict";
import { assessNewsQuality, classifyNewsRisk } from "./news-quality";
import type { GundemBriefing } from "./types";

const base: GundemBriefing = {
  slug: "ornek-haber",
  title: "Kurul bugün yeni düzenlemeyi kabul etti",
  excerpt: "Kurul yeni düzenlemeyi bugün kabul etti. Uygulama takvimi, karar metninin resmî olarak yayımlanmasının ardından ayrıca netleşecek.",
  bodyMarkdown: "Kurul bugün yapılan toplantıda yeni düzenlemeyi kabul etti. Kararın uygulama takvimi henüz açıklanmadı.\n\nMedyada yer alan bilgilere göre karar metni yayımlandığında ayrıntılar netleşecek.",
  publishedAt: "2026-09-28T10:00:00Z",
  dateModified: "2026-09-28T10:00:00Z",
  sources: [
    { url: "https://a.example/item", title: "A", sourceType: "media", publisherGroupId: "a" },
    { url: "https://b.example/item", title: "B", sourceType: "media", publisherGroupId: "b" },
  ],
  image: { src: "https://images.pexels.com/photos/518543/image.jpeg", alt: "Haber masasında temsili çalışma görüntüsü", creditName: "Pexels", creditUrl: "https://www.pexels.com", license: "pexels", query: "newsroom" },
  trendQuery: "kurul düzenleme", angle: "Karar", lang: "tr",
};

test("quality gate rejects question headlines", () => {
  const result = assessNewsQuality({ ...base, title: "Kurul hangi kararı aldı?" }, []);
  assert.equal(result.ok, false);
  assert.equal(result.code, "headline-quality");
});

test("high-risk subjects always require review", () => {
  assert.equal(classifyNewsRisk("Çocuk mağdurun kimliği açıklandı", false), "high");
  assert.equal(classifyNewsRisk("Dolar için doğrulanmamış piyasa iddiası", false), "high");
});
