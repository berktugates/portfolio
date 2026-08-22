import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import {
  AUTHOR_ID,
  SITE_DESCRIPTION,
  SITE_LAST_MODIFIED,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  WEBSITE_ID,
  jsonLd,
} from "./lib/seo";
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
      inLanguage: "en",
      publisher: { "@id": AUTHOR_ID },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profile-page`,
      url: SITE_URL,
      name: SITE_TITLE,
      dateModified: SITE_LAST_MODIFIED,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: { "@id": AUTHOR_ID },
    },
    {
      "@type": "Person",
      "@id": AUTHOR_ID,
      name: SITE_NAME,
      url: SITE_URL,
      image: { "@type": "ImageObject", url: `${SITE_URL}/me.png` },
      jobTitle: ["Co-Founder", "Software Engineer"],
      alumniOf: { "@type": "CollegeOrUniversity", name: "Fırat University" },
      worksFor: [
        { "@type": "Organization", name: "Figtures", url: "https://figtures.com" },
        { "@type": "Organization", name: "bradi.tech", url: "https://www.bradi.tech" },
      ],
      sameAs: [
        "https://github.com/berktugates",
        "https://www.linkedin.com/in/berktugates/",
      ],
      knowsAbout: [
        "Software architecture",
        "TypeScript",
        "Next.js",
        "React",
        "React Native",
        "Node.js",
        "AI product engineering",
      ],
    },
  ],
};
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: SITE_URL },
  openGraph: { type: "website", locale: "en_US", url: SITE_URL, siteName: SITE_NAME, title: SITE_TITLE, description: SITE_DESCRIPTION, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_TITLE }] },
  twitter: { card: "summary_large_image", creator: "@plazadilberi", title: SITE_TITLE, description: SITE_DESCRIPTION, images: ["/opengraph-image"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "technology",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#09090b" }] };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth"><head><script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.classList.toggle('dark',localStorage.theme==='dark'||(!('theme'in localStorage)&&matchMedia('(prefers-color-scheme:dark)').matches))}catch(e){}` }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} /></head><body className={`${geistMono.className} tracking-tight`}><a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a><div id="main-content">{children}</div><Analytics /><SpeedInsights /></body></html>; }
