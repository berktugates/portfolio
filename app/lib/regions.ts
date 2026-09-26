/** Matches the visible sentence: work across Türkiye, mostly remote. No city list and no residence. */
export function buildAreaServedFromRegions() {
  return [
    { "@type": "Country" as const, name: "Türkiye" },
    { "@type": "Place" as const, name: "Remote" },
  ];
}
