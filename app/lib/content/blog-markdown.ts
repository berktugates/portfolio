import type { Locale } from "../i18n/config";
import { hasBlogLocale } from "./blog-locale-overlay";
import { getLocalizedBlogPost } from "./get-content";
import { htmlToMarkdown } from "./html-to-markdown";

export async function blogMarkdownResponse(locale: Locale, slug: string) {
  if (locale !== "en" && !(await hasBlogLocale(locale, slug))) {
    return new Response("Not found", { status: 404 });
  }
  const post = await getLocalizedBlogPost(locale, slug);
  if (!post) return new Response("Not found", { status: 404 });

  const sections = post.contentHtml
    ? htmlToMarkdown(post.contentHtml)
    : post.sections
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
