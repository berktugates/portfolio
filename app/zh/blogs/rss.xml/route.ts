import { blogRssResponse } from "../../../lib/content/blog-rss";

export const revalidate = 3600;

export async function GET() {
  return blogRssResponse("zh");
}
