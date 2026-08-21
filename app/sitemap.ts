import type { MetadataRoute } from "next";
import { projects } from "./data/projects";
import { blogPosts } from "./data/blogs";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://berktugberke.com"; return [{ url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }, ...projects.map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })), { url: `${base}/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 }, ...blogPosts.map((post) => ({ url: `${base}/blogs/${post.slug}`, lastModified: new Date(post.publishedAt), changeFrequency: "yearly" as const, priority: 0.75 }))]; }
