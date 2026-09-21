import { getAllGundemBriefings } from "../lib/gundem/catalog";
import { haberlerArticlePath, haberlerUrl } from "../lib/gundem/hosts";

export const revalidate = 1800;

export async function GET() {
  const posts = await getAllGundemBriefings();
  const urls = [
    `<url><loc>${haberlerUrl("/")}</loc></url>`,
    ...posts.map(
      (post) =>
        `<url><loc>${haberlerUrl(haberlerArticlePath(post.slug))}</loc><lastmod>${post.dateModified}</lastmod></url>`,
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
