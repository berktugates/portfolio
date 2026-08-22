export const SITE_URL = "https://berktugberke.com";
export const SITE_NAME = "Berktug Berke Ates";
export const SITE_TITLE = "Berktug Berke Ates — Software Engineer";
export const SITE_DESCRIPTION =
  "Software engineer building reliable web, mobile, and AI products—from technical architecture to production systems.";
export const SITE_LAST_MODIFIED = "2026-08-22";

export const AUTHOR_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
