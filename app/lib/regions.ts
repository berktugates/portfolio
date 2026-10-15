/** Remote delivery only — no residence or regional geography on the site. */
export function buildAreaServedFromRegions() {
  return [{ "@type": "Place" as const, name: "Remote" }];
}
