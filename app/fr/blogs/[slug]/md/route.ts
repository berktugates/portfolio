import { blogMarkdownResponse } from "../../../../lib/content/blog-markdown";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, props: Props) {
  return blogMarkdownResponse("fr", (await props.params).slug);
}
