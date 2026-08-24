import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { blogPosts, getBlogPage, getBlogTotalPages } from "./data/blogs";
import { SITE_LAST_MODIFIED, SITE_URL } from "./lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const totalPages = getBlogTotalPages();
  const blogIndexPages = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return {
      url: page === 1 ? `${SITE_URL}/blogs` : `${SITE_URL}/blogs/pages/${page}`,
      lastModified: getBlogPage(page)[0]?.publishedAt,
    };
  });

  return [
    {
      url: SITE_URL,
      lastModified: SITE_LAST_MODIFIED,
      alternates: { languages: { en: SITE_URL, tr: `${SITE_URL}/tr` } },
    },
    {
      url: `${SITE_URL}/tr`,
      lastModified: SITE_LAST_MODIFIED,
      alternates: { languages: { en: SITE_URL, tr: `${SITE_URL}/tr` } },
    },
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
