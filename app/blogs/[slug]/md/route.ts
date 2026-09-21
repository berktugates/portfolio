import { getLocalizedBlogPost } from "../../../lib/content/get-content";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

export async function GET(_request: Request, props: Props) {
  const slug = (await props.params).slug;
  const post = await getLocalizedBlogPost("en", slug);
  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const sections = post.sections
    .map((section) => {
      const body = section.paragraphs.map((p) => p).join("\n\n");
      const points = section.points?.map((p) => `- ${p}`).join("\n") ?? "";
      return `## ${section.heading}\n\n${body}${points ? `\n\n${points}` : ""}`;
    })
    .join("\n\n");

  const md = `# ${post.title}

${post.excerpt}

Published: ${post.publishedAt}

${sections}
`;

  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
