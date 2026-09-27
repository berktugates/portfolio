import { getAllGundemBriefings } from "../lib/gundem/catalog";
import { haberlerArticlePath, haberlerUrl } from "../lib/gundem/hosts";

export const revalidate = 1800;
const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const posts = (await getAllGundemBriefings()).filter((post) => post.status !== "RETRACTED");
  const fixed = ["/", "/kunye", "/editorial-policy", "/duzeltme-talebi", "/yazar/berktug-berke-ates"];
  const urls = [
    ...fixed.map((path) => `<url><loc>${escapeXml(haberlerUrl(path))}</loc></url>`),
    ...posts.map((post) => `<url><loc>${escapeXml(haberlerUrl(haberlerArticlePath(post.slug)))}</loc><lastmod>${escapeXml(post.dateModified)}</lastmod></url>`),
  ];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
  });
}
