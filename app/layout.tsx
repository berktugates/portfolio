import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ContentGroupBeacon } from "./components/content-group-beacon";
import { GoogleAnalytics, GoogleTagManager } from "./components/google-tags";
import { SiteAssistantRoot } from "./components/site-assistant-shell";
import {
  AUTHOR_ID,
  CONTACT_EMAIL,
  FIRAT_UNIVERSITY_ID,
  FIRAT_UNIVERSITY_URL,
  GITHUB_PROFILE,
  LINKEDIN_PROFILE,
  SITE_NAME,
  SITE_URL,
  visibleAuthorMeta,
  WEBSITE_ID,
  jsonLd,
} from "./lib/seo";
import { documentLang } from "./lib/document-lang";
import { LOCALE_REDIRECT_SCRIPT, getDictionary, hreflangLanguages, localeMeta, type Locale } from "./lib/i18n";
import { shareImageMeta } from "./lib/share-image";
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap" });
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
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
      alternateName: ["Berktuğ Berke Ateş", "Berktuğ Berke", "Berktug Berke Ates", "Berktug Berke", "Berktug Ates", "berktugates"],
      url: SITE_URL,
      email: CONTACT_EMAIL,
      image: { "@type": "ImageObject", url: `${SITE_URL}/me.webp` },
      jobTitle: ["Software Engineer", "Product Builder"],
      alumniOf: { "@id": FIRAT_UNIVERSITY_ID },
      knowsLanguage: [
        { "@type": "Language", name: "Turkish", alternateName: "tr" },
        { "@type": "Language", name: "English", alternateName: "en" },
      ],
      worksFor: [{ "@type": "Organization", name: "bradi.tech", url: "https://www.bradi.tech" }],
      sameAs: [GITHUB_PROFILE, LINKEDIN_PROFILE],
    },
  ],
};
function localeFromDocumentLang(lang: string): Locale {
  const found = (Object.entries(localeMeta) as [Locale, { htmlLang: string }][]).find(
    ([, meta]) => meta.htmlLang === lang,
  );
  return found?.[0] ?? "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = localeFromDocumentLang(documentLang());
  const dict = await getDictionary(locale);
  const image = shareImageMeta(locale, dict.headerName);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: dict.metaTitle, template: `%s | ${dict.headerName}` },
    description: dict.metaDescription,
    ...visibleAuthorMeta(dict.headerName),
    alternates: {
      canonical: SITE_URL,
      languages: hreflangLanguages(),
    },
    openGraph: {
      type: "website",
      locale: localeMeta[locale].ogLocale,
      url: SITE_URL,
      siteName: dict.headerName,
      title: dict.metaTitle,
      description: dict.metaDescription,
      images: image.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metaTitle,
      description: dict.metaDescription,
      images: image.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    category: "technology",
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#09090b" }] };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = documentLang();
  return (
    <html lang={lang} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
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
        <ContentGroupBeacon />
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <div id="main-content">{children}</div>
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
        <SiteAssistantRoot />
      </body>
    </html>
  );
}
