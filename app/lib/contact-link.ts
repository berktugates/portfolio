/** Published contact form URLs in user-facing copy (with or without https). */
export const CONTACT_IN_TEXT_SOURCE = String.raw`(?:https:\/\/)?berktugberke\.com\/contact`;
export const CONTACT_IN_TEXT = new RegExp(CONTACT_IN_TEXT_SOURCE, "g");

export const CONTACT_FORM_HREF = "/contact";

export const contactFormLinkClassName =
  "font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-950 dark:text-zinc-50 dark:decoration-zinc-600 dark:hover:decoration-zinc-300";

export function isContactFormReference(token: string): boolean {
  return /(?:https:\/\/)?berktugberke\.com\/contact/.test(token);
}
