import type { Locale } from "../i18n/config";
import { hasBlogLocaleOverlay } from "./blog-locale-overlay";
import { getLocalizedBlogPost } from "./get-content";

export async function blogMarkdownResponse(locale: Locale, slug: string) {
  if (locale !== "en" && !hasBlogLocaleOverlay(locale, slug)) {
    return new Response("Not found", { status: 404 });
  }
  const post = await getLocalizedBlogPost(locale, slug);
  if (!post) return new Response("Not found", { status: 404 });

  const sections = post.sections
    .map((section) => {
      const body = section.paragraphs.join("\n\n");
      const points = section.points?.map((point) => `- ${point}`).join("\n") ?? "";
      return `## ${section.heading}\n\n${body}${points ? `\n\n${points}` : ""}`;
    })
    .join("\n\n");

  const markdown = `# ${post.title}

${post.excerpt}

Published: ${post.publishedAt}

${sections}
`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
