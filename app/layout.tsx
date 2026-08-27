import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import {
  AUTHOR_ID,
  SITE_DESCRIPTION,
  SITE_INTRO,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  WEBSITE_ID,
  jsonLd,
} from "./lib/seo";
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
      "@type": "Person",
      "@id": AUTHOR_ID,
      name: SITE_NAME,
      alternateName: ["Berktuğ Berke Ateş", "Berktug Berke Ates", "Berktug Ates"],
      description: SITE_INTRO,
      url: SITE_URL,
      image: { "@type": "ImageObject", url: `${SITE_URL}/me.png` },
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
      },
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
        "Backend engineering",
        "Infrastructure",
        "AI-powered systems",
        "Automation",
        "End-to-end product development",
        "Production deployment",
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
  alternates: {
    canonical: SITE_URL,
    languages: hreflangLanguages(),
  },
  openGraph: { type: "website", locale: "en_US", url: SITE_URL, siteName: SITE_NAME, title: SITE_TITLE, description: SITE_DESCRIPTION, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_TITLE }] },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: ["/opengraph-image"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "technology",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#09090b" }] };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
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
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <div id="main-content">{children}</div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
