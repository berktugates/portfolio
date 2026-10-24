import assert from "node:assert/strict";
import test from "node:test";
import { classifyNewsQuery } from "./feed-compose";

test("classifyNewsQuery assigns broad TR lanes", () => {
  assert.equal(classifyNewsQuery("Merkez Bankası faiz kararı"), "ekonomi");
  assert.equal(classifyNewsQuery("Süper Lig derbi sonucu"), "spor");
  assert.equal(classifyNewsQuery("yapay zeka regülasyonu"), "bilisim");
  assert.equal(classifyNewsQuery("Sağlık Bakanlığı aşı kampanyası"), "saglik");
  assert.equal(classifyNewsQuery("İstanbul film festivali"), "kultur");
  assert.equal(classifyNewsQuery("Cumhurbaşkanı kabine toplantısı"), "siyaset");
});

test("classifyNewsQuery uses diger only as last resort", () => {
  assert.equal(classifyNewsQuery("xyz rastgele haber"), "diger");
});
