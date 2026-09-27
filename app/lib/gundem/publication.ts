import { CONTACT_EMAIL } from "../seo";

export const NEWS_PUBLICATION_NAME = "Berktuğ Berke Ateş — Gündem";

export type PublicationIdentity = {
  owner: string;
  responsibleManager: string | null;
  publicationType: string;
  workplaceAddress: string | null;
  phone: string | null;
  email: string;
  electronicNotificationAddress: string | null;
  hostingProvider: string;
  complete: boolean;
};

export function publicationIdentity(): PublicationIdentity {
  const responsibleManager = process.env.NEWS_RESPONSIBLE_MANAGER?.trim() || null;
  const workplaceAddress = process.env.NEWS_WORKPLACE_ADDRESS?.trim() || null;
  const phone = process.env.NEWS_CONTACT_PHONE?.trim() || null;
  const electronicNotificationAddress = process.env.NEWS_E_NOTIFICATION_ADDRESS?.trim() || null;
  return {
    owner: process.env.NEWS_PUBLICATION_OWNER?.trim() || "Berktuğ Berke Ateş",
    responsibleManager,
    publicationType: process.env.NEWS_PUBLICATION_TYPE?.trim() || "İnternet haber sitesi",
    workplaceAddress,
    phone,
    email: process.env.NEWS_CONTACT_EMAIL?.trim() || CONTACT_EMAIL,
    electronicNotificationAddress,
    hostingProvider: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA",
    complete: Boolean(responsibleManager && workplaceAddress && phone && electronicNotificationAddress),
  };
}

export function newsPublisherJsonLd() {
  const identity = publicationIdentity();
  return {
    "@type": "NewsMediaOrganization",
    "@id": "https://haberler.berktugberke.com/#publisher",
    name: NEWS_PUBLICATION_NAME,
    url: "https://haberler.berktugberke.com/",
    email: identity.email,
    logo: {
      "@type": "ImageObject",
      url: "https://haberler.berktugberke.com/apple-icon.png",
    },
    publishingPrinciples: "https://haberler.berktugberke.com/editorial-policy",
    correctionsPolicy: "https://haberler.berktugberke.com/duzeltme-talebi",
  };
}
