/**
 * Geographic coverage for Türkiye hire/GEO signals.
 * Home base remains Marmaris, Muğla (Ege) — other places are served regions, not claimed residences.
 */
export type TurkeyRegion = {
  id:
    | "ege"
    | "marmara"
    | "ic-anadolu"
    | "akdeniz"
    | "karadeniz"
    | "dogu-anadolu"
    | "guneydogu-anadolu";
  nameTr: string;
  nameEn: string;
  schemaName: string;
  cities: readonly string[];
};

export const TURKEY_REGIONS: readonly TurkeyRegion[] = [
  {
    id: "ege",
    nameTr: "Ege Bölgesi",
    nameEn: "Aegean Region",
    schemaName: "Ege Bölgesi / Aegean Region (Türkiye)",
    cities: ["Marmaris", "Muğla", "İzmir", "Aydın", "Denizli", "Bodrum", "Fethiye"],
  },
  {
    id: "marmara",
    nameTr: "Marmara Bölgesi",
    nameEn: "Marmara Region",
    schemaName: "Marmara Bölgesi / Marmara Region (Türkiye)",
    cities: ["İstanbul", "Bursa", "Kocaeli", "Tekirdağ", "Balıkesir", "Sakarya", "Çanakkale", "Yalova"],
  },
  {
    id: "ic-anadolu",
    nameTr: "İç Anadolu Bölgesi",
    nameEn: "Central Anatolia Region",
    schemaName: "İç Anadolu Bölgesi / Central Anatolia Region (Türkiye)",
    cities: ["Ankara", "Konya", "Kayseri", "Eskişehir", "Sivas", "Aksaray", "Nevşehir"],
  },
  {
    id: "akdeniz",
    nameTr: "Akdeniz Bölgesi",
    nameEn: "Mediterranean Region",
    schemaName: "Akdeniz Bölgesi / Mediterranean Region (Türkiye)",
    cities: ["Antalya", "Adana", "Mersin", "Hatay", "Isparta", "Burdur"],
  },
  {
    id: "karadeniz",
    nameTr: "Karadeniz Bölgesi",
    nameEn: "Black Sea Region",
    schemaName: "Karadeniz Bölgesi / Black Sea Region (Türkiye)",
    cities: ["Samsun", "Trabzon", "Ordu", "Giresun", "Rize", "Zonguldak"],
  },
  {
    id: "dogu-anadolu",
    nameTr: "Doğu Anadolu Bölgesi",
    nameEn: "Eastern Anatolia Region",
    schemaName: "Doğu Anadolu Bölgesi / Eastern Anatolia Region (Türkiye)",
    cities: ["Erzurum", "Malatya", "Van", "Elazığ", "Erzincan"],
  },
  {
    id: "guneydogu-anadolu",
    nameTr: "Güneydoğu Anadolu Bölgesi",
    nameEn: "Southeastern Anatolia Region",
    schemaName: "Güneydoğu Anadolu Bölgesi / Southeastern Anatolia Region (Türkiye)",
    cities: ["Gaziantep", "Şanlıurfa", "Diyarbakır", "Mardin", "Kahramanmaraş"],
  },
] as const;

/** Place-typed localities (not always City in schema.org usage here). */
const PLACE_LOCALITIES = new Set([
  "Bodrum",
  "Fethiye",
  "Nevşehir",
  "Çanakkale",
  "Yalova",
]);

export function turkeyRegionsPlainList(locale: "tr" | "en" = "en"): string {
  return TURKEY_REGIONS.map((region) =>
    locale === "tr"
      ? `${region.nameTr} (${region.cities.join(", ")})`
      : `${region.nameEn} / ${region.nameTr} (${region.cities.join(", ")})`,
  ).join("; ");
}

export function turkeyRegionNamesForLlms(): string {
  return TURKEY_REGIONS.map((region) => `${region.nameTr} (${region.cities.join(", ")})`).join("; ");
}

export function buildAreaServedFromRegions() {
  const places: Array<{ "@type": "Country" | "AdministrativeArea" | "City" | "Place"; name: string }> = [
    { "@type": "Country", name: "Türkiye" },
  ];
  for (const region of TURKEY_REGIONS) {
    places.push({ "@type": "AdministrativeArea", name: region.schemaName });
    for (const city of region.cities) {
      places.push({
        "@type": PLACE_LOCALITIES.has(city) ? "Place" : "City",
        name: city,
      });
    }
  }
  places.push({ "@type": "Place", name: "Remote" });
  places.push({ "@type": "AdministrativeArea", name: "Worldwide" });
  return places;
}
