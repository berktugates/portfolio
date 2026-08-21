import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { blogPosts, getBlogTotalPages } from "./data/blogs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://berktugberke.com";
  const totalPages = getBlogTotalPages();
  const blogIndexPages = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return {
      url: page === 1 ? `${base}/blogs` : `${base}/blogs/pages/${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: page === 1 ? 0.9 : 0.7,
    };
  });

  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogIndexPages,
    ...blogPosts.map((post) => ({
      url: `${base}/blogs/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.75,
    })),
  ];
}
