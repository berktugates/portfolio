import { test } from "node:test";
import assert from "node:assert/strict";
import { lightParaphraseTurkish, textSimilarity } from "./paraphrase-tr";

test("light paraphrase keeps high similarity but changes wording", () => {
  const raw = "Son dakika: Merkez Bankası faiz kararını açıkladı ve piyasada tartışma yükseldi.";
  const out = lightParaphraseTurkish(raw, "light");
  const sim = textSimilarity(raw, out);
  assert.ok(sim >= 0.45 && sim <= 0.95, `similarity=${sim}`);
  assert.notEqual(raw, out);
});

test("paraphrase preserves proper nouns roughly", () => {
  const raw = "Merkez Bankası faiz kararını açıkladı.";
  const out = lightParaphraseTurkish(raw, "light");
  assert.match(out, /Merkez Bankası/i);
});
