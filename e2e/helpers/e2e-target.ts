/** Playwright base URL from `E2E_BASE_URL` or local dev (see playwright.config.ts). */
export const remoteBaseURL = process.env.E2E_BASE_URL?.replace(/\/$/, "");

/** True when tests hit a deployed host (not localhost). */
export const isRemoteE2E = Boolean(
  remoteBaseURL && !/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(remoteBaseURL),
);

/** Portfolio serves `/gundem` on localhost; production apex redirects to haberler. */
export const isLocalGundemSurface = !isRemoteE2E;

export const PROD_APEX = "https://berktugberke.com";
export const HABERLER_ORIGIN = "https://haberler.berktugberke.com";
