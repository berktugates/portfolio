import assert from "node:assert/strict";
import test from "node:test";
import type { BlogSection } from "../../data/blogs";
import {
  estimateReadingMinutesFromSections,
  normalizeParagraphs,
  normalizeBlogSections,
} from "./reading-minutes";

const sampleSections: BlogSection[] = [
  {
    heading: "Intro",
    paragraphs: [
      "One ".repeat(40).trim(),
      "Two ".repeat(40).trim(),
    ],
    points: ["Bullet one", "Bullet two"],
  },
  {
    heading: "Outro",
    paragraphs: ["Three ".repeat(50).trim()],
  },
];

test("normalizeParagraphs flattens nested queue paragraphs", () => {
  assert.deepEqual(
    normalizeParagraphs([["First line.", "Second line."]]),
    ["First line.", "Second line."],
  );
});

test("normalizeBlogSections preserves points and links", () => {
  const normalized = normalizeBlogSections([
    {
      heading: "H",
      paragraphs: [["A", "B"]] as unknown as string[],
      points: ["p1"],
      links: [{ label: "L", url: "https://example.com" }],
    },
  ]);
  assert.deepEqual(normalized[0]?.paragraphs, ["A", "B"]);
  assert.equal(normalized[0]?.points?.[0], "p1");
});

test("estimateReadingMinutesFromSections uses locale pace", () => {
  const en = estimateReadingMinutesFromSections(sampleSections, "en");
  const zh = estimateReadingMinutesFromSections(
    [{ heading: "标题", paragraphs: ["中文".repeat(200)] }],
    "zh",
  );
  assert.ok(en >= 4 && en <= 15);
  assert.ok(zh >= 4);
});

test("short TR overlay yields lower minutes than hardcoded seven", () => {
  const trSections: BlogSection[] = [
    {
      heading: "Mobil gecikme",
      paragraphs: [
        "Mağaza incelemesi ve güncellemeyi yok sayan kullanıcılar çoklu istemci nesli gerektirir.",
        "En eski desteklenen sürüm birinci sınıf tüketicidir.",
      ],
    },
  ];
  const minutes = estimateReadingMinutesFromSections(trSections, "tr");
  assert.equal(minutes, 4);
});
