import assert from "node:assert/strict";
import test from "node:test";
import { gundemImageMatchesStory } from "./cover";

test("a stock disclaimer is not treated as the event photo", () => {
  assert.equal(
    gundemImageMatchesStory({
      title: "Altın fiyatı yükseldi",
      trendQuery: "gram altın",
      image: { alt: "Altın külçe, stok görsel, olay fotoğrafı değil", query: "gold bars" },
    }),
    false,
  );
});

test("a caption that shares the story words can stay", () => {
  assert.equal(
    gundemImageMatchesStory({
      title: "Galatasaray derbide sahada",
      trendQuery: "derbi",
      image: { alt: "Galatasaray futbol sahası", query: "galatasaray stadium" },
    }),
    true,
  );
});
