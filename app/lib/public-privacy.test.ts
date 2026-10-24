import assert from "node:assert/strict";
import test from "node:test";
import {
  sanitizePublicationField,
  stripForbiddenPublicText,
  textContainsForbiddenPublicEmail,
} from "./public-privacy";

test("stripForbiddenPublicText removes contact email and geo tokens", () => {
  const out = stripForbiddenPublicText(
    "Write to contact@berktugberke.com from Marmaris, Muğla or İstanbul, Türkiye.",
  );
  assert.equal(textContainsForbiddenPublicEmail(out), false);
  assert.match(out, /Write to/);
  assert.doesNotMatch(out, /contact@|Marmaris|Muğla|İstanbul|Türkiye/);
});

test("sanitizePublicationField drops forbidden values", () => {
  assert.equal(sanitizePublicationField("Beldibi Mah. Marmaris/Muğla"), null);
  assert.equal(sanitizePublicationField("contact@berktugberke.com"), null);
  assert.equal(sanitizePublicationField("Berktuğ Berke Ateş"), "Berktuğ Berke Ateş");
});
