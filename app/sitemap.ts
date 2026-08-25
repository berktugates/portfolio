import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { blogPosts, getBlogPage, getBlogTotalPages } from "./data/blogs";
import { LOCALES, hreflangLanguages, localeUrl } from "./lib/i18n";
import { SITE_LAST_MODIFIED, SITE_URL } from "./lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = hreflangLanguages();
  const totalPages = getBlogTotalPages();
  const blogIndexPages = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return {
      url: page === 1 ? `${SITE_URL}/blogs` : `${SITE_URL}/blogs/pages/${page}`,
      lastModified: getBlogPage(page)[0]?.publishedAt,
    };
  });

  const localeHomes = LOCALES.map((locale) => ({
    url: localeUrl(locale),
    lastModified: SITE_LAST_MODIFIED,
    alternates: { languages },
  }));

  return [
    ...localeHomes,
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: SITE_LAST_MODIFIED,
    })),
    ...blogIndexPages,
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blogs/${post.slug}`,
      lastModified: post.publishedAt,
    })),
  ];
}
