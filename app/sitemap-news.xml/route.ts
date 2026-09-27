import { renderNewsSitemap, xmlResponse } from "../lib/gundem/news-sitemap";

export const revalidate = 900;
export async function GET() { return xmlResponse(await renderNewsSitemap()); }
