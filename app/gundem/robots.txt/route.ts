export const dynamic = "force-static";

export function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /draft/
Disallow: /review/

Sitemap: https://haberler.berktugberke.com/sitemap.xml
Sitemap: https://haberler.berktugberke.com/sitemap-news.xml
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
