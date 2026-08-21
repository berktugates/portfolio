import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
const geistMono = Geist_Mono({ subsets: ["latin"], display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://berktugberke.com";
const structuredData = { "@context": "https://schema.org", "@type": "Person", name: "Berktug Berke Ates", url: siteUrl, image: `${siteUrl}/me.png`, jobTitle: ["Co-Founder", "Software Engineer"], hasOccupation: [{ "@type": "Occupation", name: "Co-Founder", occupationLocation: { "@type": "City", name: "Istanbul" } }, { "@type": "Occupation", name: "Software Engineer", occupationLocation: { "@type": "City", name: "London" } }], alumniOf: { "@type": "CollegeOrUniversity", name: "Fırat University" }, worksFor: [{ "@type": "Organization", name: "Figtures", url: "https://figtures.com", location: "Istanbul" }, { "@type": "Organization", name: "bradi.tech", url: "https://www.bradi.tech", location: "London" }], sameAs: ["https://github.com/berktugates", "https://www.linkedin.com/in/berktugates/"], knowsAbout: ["TypeScript", "Next.js", "React", "Node.js", "AI", "Health Tech"] };
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl), title: { default: "Berktug Berke Ates — Software Engineer", template: "%s | Berktug Berke Ates" },
  description: "Software engineer building reliable web and cross-platform mobile products, from technical architecture to production systems.",
  keywords: ["Berktug Berke Ates", "Software Engineer", "Full-stack Developer", "Mobile Developer", "Cross-platform Mobile", "Next.js", "React", "React Native", "TypeScript", "Node.js", "AI", "Health Tech"],
  authors: [{ name: "Berktug Berke Ates", url: siteUrl }], creator: "Berktug Berke Ates", publisher: "Berktug Berke Ates", alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", url: "/", siteName: "Berktug Berke Ates", title: "Berktug Berke Ates — Software Engineer", description: "Full-stack software engineer focused on modern web products, AI and health tech.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Berktug Berke Ates — Software Engineer" }] },
  twitter: { card: "summary_large_image", creator: "@plazadilberi", title: "Berktug Berke Ates — Software Engineer", description: "Full-stack software engineer focused on modern web products, AI and health tech.", images: ["/opengraph-image"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }, category: "technology",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }, { media: "(prefers-color-scheme: dark)", color: "#09090b" }] };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth"><head><script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.classList.toggle('dark',localStorage.theme==='dark'||(!('theme'in localStorage)&&matchMedia('(prefers-color-scheme:dark)').matches))}catch(e){}` }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /></head><body className={`${geistMono.className} tracking-tight`}><a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a><div id="main-content">{children}</div><Analytics /><SpeedInsights /></body></html>; }
