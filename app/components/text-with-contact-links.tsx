import Link from "next/link";
import type { ReactNode } from "react";
import { CONTACT_FORM_HREF, CONTACT_IN_TEXT, contactFormLinkClassName } from "../lib/contact-link";
import { CONTACT_FORM_PATH_LABEL } from "../lib/i18n/hire-engagement";

export function TextWithContactLinks({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(CONTACT_IN_TEXT)) {
    const index = match.index ?? 0;
    if (index > last) {
      nodes.push(text.slice(last, index));
    }
    nodes.push(
      <Link key={key++} href={CONTACT_FORM_HREF} className={contactFormLinkClassName}>
        {CONTACT_FORM_PATH_LABEL}
      </Link>,
    );
    last = index + match[0].length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return nodes.length ? <>{nodes}</> : text;
}
