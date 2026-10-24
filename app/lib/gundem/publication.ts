import { sanitizePublicationField } from "../public-privacy";
import { CONTACT_PAGE_URL } from "../seo";

export const NEWS_PUBLICATION_NAME = "Berktuğ Berke Ateş — Gündem";

export type PublicationIdentity = {
  owner: string;
  responsibleManager: string | null;
  publicationType: string;
  contactFormUrl: string;
  hostingProvider: string;
};

export function publicationIdentity(): PublicationIdentity {
  const responsibleManager = sanitizePublicationField(process.env.NEWS_RESPONSIBLE_MANAGER);
  return {
    owner: process.env.NEWS_PUBLICATION_OWNER?.trim() || "Berktuğ Berke Ateş",
    responsibleManager,
    publicationType: process.env.NEWS_PUBLICATION_TYPE?.trim() || "İnternet haber sitesi",
    contactFormUrl: CONTACT_PAGE_URL,
    hostingProvider: "Vercel Inc.",
  };
}

export function newsPublisherJsonLd() {
  return {
    "@type": "NewsMediaOrganization",
    "@id": "https://haberler.berktugberke.com/id/publisher",
    name: NEWS_PUBLICATION_NAME,
    url: "https://haberler.berktugberke.com/",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: CONTACT_PAGE_URL,
    },
    logo: {
      "@type": "ImageObject",
      url: "https://haberler.berktugberke.com/apple-icon.png",
    },
    publishingPrinciples: "https://haberler.berktugberke.com/editorial-policy",
    correctionsPolicy: "https://haberler.berktugberke.com/duzeltme-talebi",
  };
}
