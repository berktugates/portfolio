import { blogPosts } from "../data/blogs";
import { projects } from "../data/projects";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "../lib/seo";

export const dynamic = "force-static";

export function GET() {
  const projectLinks = projects
    .map(
      (project) =>
        `- [${project.title}](${SITE_URL}/projects/${project.slug}): ${project.summary}`,
    )
    .join("\n");

  const articleLinks = [...blogPosts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blogs/${post.slug}): ${post.description}`,
    )
    .join("\n");

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

This is the official portfolio of Berktug Berke Ates. It covers selected software products, professional experience, and original articles about software architecture, AI product engineering, reliability, cross-platform development, and technical leadership. Content is written in English.

## Primary pages

- [Portfolio and profile](${SITE_URL}/): Professional profile, experience, education, selected products, and contact details.
- [Engineering articles](${SITE_URL}/blogs): Index of all original long-form articles.

## Selected products

${projectLinks}

## Engineering articles

${articleLinks}

## Contact and profiles

- [GitHub](https://github.com/berktugates): Public source-code profile.
- [LinkedIn](https://www.linkedin.com/in/berktugates/): Professional profile.
- [Email](mailto:contact@berktugberke.com): Direct contact.

## Optional

- [XML sitemap](${SITE_URL}/sitemap.xml): Canonical indexable URLs and verified modification dates.
- [Résumé](${SITE_URL}/BerktugBerkeAtes.pdf): Downloadable résumé in PDF format.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
