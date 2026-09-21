import { blogPosts, type BlogPost } from "../../data/blogs";
import { listBlobBlogPosts } from "./load-blob";

export async function getCatalogBlogPosts(): Promise<readonly BlogPost[]> {
  const blobPosts = await listBlobBlogPosts();
  const bySlug = new Map<string, BlogPost>();
  for (const post of blogPosts) bySlug.set(post.slug, post);
  for (const post of blobPosts) bySlug.set(post.slug, post);
  return [...bySlug.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getCatalogBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getCatalogBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getCatalogBlogSlugs(): Promise<string[]> {
  const posts = await getCatalogBlogPosts();
  return posts.map((post) => post.slug);
}
