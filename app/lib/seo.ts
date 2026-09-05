import { buildAreaServedFromRegions } from "./regions";

export const SITE_URL = "https://berktugberke.com";
export const SITE_NAME = "Berktug Berke Ates";
export const SITE_TITLE = "Berktug Berke Ates — Software Engineer and Product Builder";
export const SITE_DESCRIPTION =
  "Software engineer and product builder delivering end-to-end software: web and mobile products, frontend and backend, architecture, SaaS, AI systems, DevOps, data, security, integrations, technical SEO, GEO, and staff-level engineering leadership.";
export const SITE_INTRO =
  "Based in Marmaris, Muğla, in Türkiye's Aegean (Ege) region, Berktuğ Berke Ates is a software engineer and product builder who designs and ships scalable software products and complex digital systems end-to-end. His work covers software architecture, frontend and backend engineering, infrastructure, DevOps, data, security, integrations, AI-powered systems, automation, technical SEO, GEO, and production delivery. He is available for freelance, full-time, and part-time engagements across all regions of Türkiye (Ege, Marmara, İç Anadolu, Akdeniz, Karadeniz, Doğu Anadolu, Güneydoğu Anadolu) and for remote and international work.";
/**
 * Human-edited profile metadata timestamp. Keep the timezone explicit so
 * structured-data consumers receive an unambiguous ISO 8601 DateTime.
 */
export const SITE_LAST_MODIFIED = "2026-09-05T09:00:00+03:00";

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

export const AREA_SERVED = buildAreaServedFromRegions();

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
