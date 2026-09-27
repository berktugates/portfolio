import { test } from "node:test";
import assert from "node:assert/strict";
import {
  bodyHasCurrentEventSignals,
  headlineFactScore,
  headlineToNewsSentence,
} from "./headline-facts";

test("headlineFactScore prefers event + number headlines", () => {
  const high = headlineFactScore("Dolar 49,80 TL oldu, rekor kırıldı");
  const low = headlineFactScore("Dolar hakkında bilmeniz gerekenler");
  assert.ok(high > low);
});

test("headlineToNewsSentence keeps claim and source tag", () => {
  const s = headlineToNewsSentence(
    { title: "Beşiktaş yeni transferi duyurdu", source: "NTV" },
    "light",
  );
  assert.match(s, /Beşiktaş/i);
  assert.match(s, /NTV/i);
  assert.match(s, /gündeme yansıdı/i);
});

test("bodyHasCurrentEventSignals detects news body", () => {
  assert.equal(
    bodyHasCurrentEventSignals(
      "Dolar 49 TL oldu. Beşiktaş transferi açıklandı. Kulüp resmi duyuru bekleniyor.",
    ),
    true,
  );
  assert.equal(
    bodyHasCurrentEventSignals("Kira sözleşmesi nedir ve nasıl okunur? Usul şu şekildedir."),
    false,
  );
});
