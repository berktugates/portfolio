import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://berktugates.com"; return { rules: { userAgent: "*", allow: "/" }, sitemap: `${base}/sitemap.xml`, host: base }; }
