export const SITE_URL = "https://berktugberke.com";
export const SITE_NAME = "Berktug Berke Ates";
export const SITE_TITLE = "Berktug Berke Ates — Software Engineer and Product Builder";
export const SITE_DESCRIPTION =
  "Software engineer and product builder designing scalable software products, complex digital systems, infrastructure, AI-powered systems, automation, and production-ready end-to-end products.";
export const SITE_INTRO =
  "Based in Marmaris, Muğla, in Türkiye's Aegean (Ege) region, Berktuğ Berke Ates is a software engineer and product builder who designs and builds scalable software products and complex digital systems. His work covers software architecture, backend engineering, infrastructure, AI-powered systems, automation, and end-to-end product development, from technical design to production deployment. He is available for freelance, full-time, and part-time software engineering engagements across the Aegean (Ege), Central Anatolia (İç Anadolu), and Marmara regions and for remote and international work.";
/**
 * Human-edited profile metadata timestamp. Keep the timezone explicit so
 * structured-data consumers receive an unambiguous ISO 8601 DateTime.
 */
export const SITE_LAST_MODIFIED = "2026-09-04T23:30:00+03:00";

export const CONTACT_EMAIL = "contact@berktugberke.com";
export const GITHUB_PROFILE = "https://github.com/berktugates";
export const LINKEDIN_PROFILE = "https://www.linkedin.com/in/berktugates/";
export const FIRAT_UNIVERSITY_URL = "https://www.firat.edu.tr";

export const AUTHOR_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FIRAT_UNIVERSITY_ID = `${SITE_URL}/#firat-university`;
export const PROFESSIONAL_SERVICE_ID = `${SITE_URL}/#professional-service`;
export const OFFER_CATALOG_ID = `${SITE_URL}/#offer-catalog`;
export const OFFER_FREELANCE_ID = `${SITE_URL}/#offer-freelance`;
export const OFFER_FULL_TIME_ID = `${SITE_URL}/#offer-full-time`;
export const OFFER_PART_TIME_ID = `${SITE_URL}/#offer-part-time`;

export const AREA_SERVED = [
  { "@type": "Country", name: "Türkiye" },
  { "@type": "AdministrativeArea", name: "Ege Bölgesi / Aegean Region (Türkiye)" },
  { "@type": "City", name: "Marmaris" },
  { "@type": "City", name: "Muğla" },
  { "@type": "City", name: "İzmir" },
  { "@type": "City", name: "Aydın" },
  { "@type": "City", name: "Denizli" },
  { "@type": "Place", name: "Bodrum" },
  { "@type": "Place", name: "Fethiye" },
  {
    "@type": "AdministrativeArea",
    name: "İç Anadolu Bölgesi / Central Anatolia Region (Türkiye)",
  },
  { "@type": "City", name: "Ankara" },
  { "@type": "City", name: "Konya" },
  { "@type": "City", name: "Kayseri" },
  { "@type": "City", name: "Eskişehir" },
  { "@type": "City", name: "Sivas" },
  { "@type": "City", name: "Aksaray" },
  { "@type": "Place", name: "Nevşehir" },
  {
    "@type": "AdministrativeArea",
    name: "Marmara Bölgesi / Marmara Region (Türkiye)",
  },
  { "@type": "City", name: "İstanbul" },
  { "@type": "City", name: "Bursa" },
  { "@type": "City", name: "Kocaeli" },
  { "@type": "City", name: "Tekirdağ" },
  { "@type": "City", name: "Balıkesir" },
  { "@type": "City", name: "Sakarya" },
  { "@type": "Place", name: "Çanakkale" },
  { "@type": "Place", name: "Yalova" },
  { "@type": "Place", name: "Remote" },
  { "@type": "AdministrativeArea", name: "Worldwide" },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
