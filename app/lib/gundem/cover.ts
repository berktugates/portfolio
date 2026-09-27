const DISCLAIMER = /stok görsel|olay fotoğrafı değil/i;

const STOP = new Set([
  "için",
  "olan",
  "olarak",
  "gibi",
  "daha",
  "çok",
  "ile",
  "veya",
  "ama",
  "bir",
  "bu",
  "şu",
  "the",
  "and",
  "türkiye",
  "gündem",
]);

function tokens(value: string): Set<string> {
  return new Set(
    value
      .toLocaleLowerCase("tr")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 4 && !STOP.has(word)),
  );
}

export function gundemImageMatchesStory(input: {
  title: string;
  excerpt?: string;
  trendQuery?: string;
  image?: { alt?: string; query?: string };
}): boolean {
  const alt = input.image?.alt ?? "";
  const query = input.image?.query ?? "";
  if (!alt && !query) return false;
  if (DISCLAIMER.test(alt) || DISCLAIMER.test(query)) return false;
  const story = tokens(`${input.title} ${input.excerpt ?? ""} ${input.trendQuery ?? ""}`);
  const picture = tokens(`${alt} ${query}`);
  for (const word of picture) {
    if (story.has(word)) return true;
  }
  return false;
}
