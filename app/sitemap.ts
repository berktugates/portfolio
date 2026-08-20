import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://berktugates.com"; return [{ url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }, { url: `${base}/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 }, { url: `${base}/blogs/hello-world`, lastModified: new Date("2026-08-21"), changeFrequency: "yearly", priority: 0.7 }]; }
