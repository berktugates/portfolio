import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { GoogleAnalytics, GoogleTagManager } from "./components/google-tags";
import {
  AREA_SERVED,
  AUTHOR_ID,
  CONTACT_EMAIL,
  FIRAT_UNIVERSITY_ID,
  FIRAT_UNIVERSITY_URL,
  GITHUB_PROFILE,
  LINKEDIN_PROFILE,
  OFFER_CATALOG_ID,
  OFFER_FREELANCE_ID,
  OFFER_FULL_TIME_ID,
  OFFER_PART_TIME_ID,
  PROFESSIONAL_SERVICE_ID,
  SITE_DESCRIPTION,
  SITE_INTRO,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  WEBSITE_ID,
  jsonLd,
} from "./lib/seo";
import {
  SERVICE_CATALOG_ID,
  SERVICE_OFFERS,
  serviceOfferCatalogJsonLd,
  serviceOfferId,
  serviceTypesForProfessionalService,
} from "./lib/services";
import { LOCALE_REDIRECT_SCRIPT, hreflangLanguages } from "./lib/i18n";
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap" });
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: ["en", "tr", "de", "fr", "it", "zh-Hans", "ja"],
      publisher: { "@id": AUTHOR_ID },
    },
    {
      "@type": "CollegeOrUniversity",
      "@id": FIRAT_UNIVERSITY_ID,
      name: "Fırat University",
      alternateName: ["Fırat Üniversitesi", "Firat University"],
      url: FIRAT_UNIVERSITY_URL,
    },
    {
      "@type": "Person",
      "@id": AUTHOR_ID,
      name: SITE_NAME,
      alternateName: ["Berktuğ Berke Ateş", "Berktug Berke Ates", "Berktug Ates"],
      description: SITE_INTRO,
      url: SITE_URL,
      email: CONTACT_EMAIL,
      image: { "@type": "ImageObject", url: `${SITE_URL}/me.webp` },
      jobTitle: ["Software Engineer", "Product Builder"],
      homeLocation: {
        "@type": "Place",
        name: "Marmaris, Muğla, Türkiye",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Marmaris",
          addressRegion: "Muğla",
          addressCountry: "TR",
        },
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Ege Bölgesi / Aegean Region (Türkiye)",
        },
      },
      alumniOf: { "@id": FIRAT_UNIVERSITY_ID },
      knowsLanguage: [
        { "@type": "Language", name: "Turkish", alternateName: "tr" },
        { "@type": "Language", name: "English", alternateName: "en" },
      ],
      worksFor: [
        { "@type": "Organization", name: "Figtures", url: "https://figtures.com" },
        { "@type": "Organization", name: "bradi.tech", url: "https://www.bradi.tech" },
      ],
      sameAs: [GITHUB_PROFILE, LINKEDIN_PROFILE],
      knowsAbout: [
        "Software architecture",
        "Backend engineering",
        "Infrastructure",
        "AI-powered systems",
        "Automation",
        "End-to-end product development",
        "Production deployment",
        "AI product engineering",
        "Freelance software engineering",
        "Remote software engineering",
        ...serviceTypesForProfessionalService(),
      ],
      hasOfferCatalog: [{ "@id": OFFER_CATALOG_ID }, { "@id": SERVICE_CATALOG_ID }],
      makesOffer: [
        { "@id": OFFER_FREELANCE_ID },
        { "@id": OFFER_FULL_TIME_ID },
        { "@id": OFFER_PART_TIME_ID },
        ...SERVICE_OFFERS.map((service) => ({ "@id": serviceOfferId(service.slug) })),
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": PROFESSIONAL_SERVICE_ID,
      name: "End-to-end software engineering by Berktug Berke Ates",
      url: `${SITE_URL}/hire`,
      description:
        "Freelance, full-time, and part-time software engineering across product, platform, and growth work — web, mobile, architecture, AI, DevOps, data, security, integrations, SEO, and GEO.",
      provider: { "@id": AUTHOR_ID },
      areaServed: AREA_SERVED,
      serviceType: [
        "Freelance software engineering",
        "Full-time software engineering",
        "Part-time software engineering",
        ...serviceTypesForProfessionalService(),
      ],
      hasOfferCatalog: [{ "@id": OFFER_CATALOG_ID }, { "@id": SERVICE_CATALOG_ID }],
    },
    {
      "@type": "OfferCatalog",
      "@id": OFFER_CATALOG_ID,
      name: "Software engineering engagements",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Offer",
            "@id": OFFER_FREELANCE_ID,
            name: "Freelance software engineering",
            url: `${SITE_URL}/hire`,
            offeredBy: { "@id": AUTHOR_ID },
            itemOffered: {
              "@type": "Service",
              name: "Freelance software engineering",
              serviceType: "Freelance software engineering",
              provider: { "@id": AUTHOR_ID },
              areaServed: AREA_SERVED,
            },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Offer",
            "@id": OFFER_FULL_TIME_ID,
            name: "Full-time software engineering",
            url: `${SITE_URL}/hire`,
            offeredBy: { "@id": AUTHOR_ID },
            itemOffered: {
              "@type": "Service",
              name: "Full-time software engineering",
              serviceType: "Full-time software engineering",
              provider: { "@id": AUTHOR_ID },
              areaServed: AREA_SERVED,
            },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "Offer",
            "@id": OFFER_PART_TIME_ID,
            name: "Part-time software engineering",
            url: `${SITE_URL}/hire`,
            offeredBy: { "@id": AUTHOR_ID },
            itemOffered: {
              "@type": "Service",
              name: "Part-time software engineering",
              serviceType: "Part-time software engineering",
              provider: { "@id": AUTHOR_ID },
              areaServed: AREA_SERVED,
            },
          },
        },
      ],
    },
    serviceOfferCatalogJsonLd(),
  ],
};
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
    languages: hreflangLanguages(),
  },
  openGraph: { type: "website", locale: "en_US", url: SITE_URL, siteName: SITE_NAME, title: SITE_TITLE, description: SITE_DESCRIPTION, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_TITLE }] },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: ["/opengraph-image"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "technology",
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#09090b" }] };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{const s=location.pathname.split('/')[1];const l=['tr','de','fr','it','zh','ja'].includes(s)?s:'en';document.documentElement.lang=l==='zh'?'zh-Hans':l;document.documentElement.dir='ltr'})()`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.toggle('dark',localStorage.theme==='dark'||(!('theme'in localStorage)&&matchMedia('(prefers-color-scheme:dark)').matches))}catch(e){}`,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: LOCALE_REDIRECT_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      </head>
      <body className={`${geistMono.className} tracking-tight`}>
        <GoogleTagManager />
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <div id="main-content">{children}</div>
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
