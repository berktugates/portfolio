export const SITE_URL = "https://berktugberke.com";
export const SITE_NAME = "Berktug Berke Ates";
export const SITE_TITLE = "Berktug Berke Ates — Software Engineer and Product Builder";
export const SITE_DESCRIPTION =
  "Software engineer and product builder designing scalable software products, complex digital systems, infrastructure, AI-powered systems, automation, and production-ready end-to-end products.";
export const SITE_INTRO =
  "Berktuğ Berke Ates is a software engineer and product builder who designs and builds scalable software products and complex digital systems. His work covers software architecture, backend engineering, infrastructure, AI-powered systems, automation, and end-to-end product development, from technical design to production deployment.";
export const SITE_LAST_MODIFIED = "2026-08-22";

export const AUTHOR_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
