import { getAllGundemBriefings } from "../lib/gundem/catalog";
import { absoluteUrl } from "../lib/seo";

export const revalidate = 1800;

export async function GET() {
  const posts = await getAllGundemBriefings();
  const urls = [
    `<url><loc>${absoluteUrl("/gundem")}</loc></url>`,
    ...posts.map(
      (post) =>
        `<url><loc>${absoluteUrl(`/gundem/${post.slug}`)}</loc><lastmod>${post.dateModified}</lastmod></url>`,
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
}
