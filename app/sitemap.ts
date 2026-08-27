import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { blogPosts, getBlogPage, getBlogTotalPages } from "./data/blogs";
import { blogPostPath, blogsIndexPath, projectPath } from "./lib/content/paths";
import { LOCALES, hreflangLanguages, localeUrl } from "./lib/i18n";
import { SITE_LAST_MODIFIED, absoluteUrl } from "./lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = hreflangLanguages();
  const totalPages = getBlogTotalPages();

  const localeHomes = LOCALES.map((locale) => ({
    url: localeUrl(locale),
    lastModified: SITE_LAST_MODIFIED,
    alternates: { languages },
  }));

  const projectEntries = projects.flatMap((project) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(projectPath(locale, project.slug)),
      lastModified: SITE_LAST_MODIFIED,
    })),
  );
  const legalEntries = projects.flatMap((project) =>
    project.legal
      ? [project.legal.privacy, project.legal.terms].map((path) => ({ url: absoluteUrl(path), lastModified: SITE_LAST_MODIFIED }))
      : [],
  );

  const blogIndexEntries = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return LOCALES.map((locale) => ({
      url: absoluteUrl(blogsIndexPath(locale, page)),
      lastModified: getBlogPage(page)[0]?.publishedAt,
    }));
  }).flat();

  const blogPostEntries = blogPosts.flatMap((post) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(blogPostPath(locale, post.slug)),
      lastModified: post.publishedAt,
    })),
  );

  return [...localeHomes, ...projectEntries, ...legalEntries, ...blogIndexEntries, ...blogPostEntries];
}
