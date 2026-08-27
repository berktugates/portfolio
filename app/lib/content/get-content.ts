import type { Locale } from "../i18n/config";
import type { BlogPost } from "../../data/blogs";
import { BLOGS_PER_PAGE, blogPosts, sortedBlogPosts } from "../../data/blogs";
import type { Project } from "../../data/projects";
import { getProject, projects } from "../../data/projects";
import { getLocaleContent } from "./load-locale";
import type { LocaleContentModule, LocalizedBlogPost, LocalizedProject } from "./types";

export { getLocaleContent };

export async function getLocalizedProjects(locale: Locale): Promise<readonly LocalizedProject[]> {
  const content = await getLocaleContent(locale);
  return projects.map((project) => mergeProject(project, content.projects[project.slug]));
}

export async function getLocalizedProject(
  locale: Locale,
  slug: string,
): Promise<LocalizedProject | undefined> {
  const project = getProject(slug);
  if (!project) return undefined;
  const content = await getLocaleContent(locale);
  return mergeProject(project, content.projects[slug]);
}

export async function getLocalizedBlogPosts(locale: Locale): Promise<readonly LocalizedBlogPost[]> {
  const content = await getLocaleContent(locale);
  return sortedBlogPosts.map((post) => mergeBlog(post, content.blogs[post.slug]));
}

export async function getLocalizedBlogPost(
  locale: Locale,
  slug: string,
): Promise<LocalizedBlogPost | undefined> {
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return undefined;
  const content = await getLocaleContent(locale);
  return mergeBlog(post, content.blogs[slug]);
}

export async function getLocalizedBlogPage(locale: Locale, page: number) {
  const posts = await getLocalizedBlogPosts(locale);
  const start = (page - 1) * BLOGS_PER_PAGE;
  return posts.slice(start, start + BLOGS_PER_PAGE);
}

export function getBlogTotalPagesFromCount(count = sortedBlogPosts.length) {
  return Math.max(1, Math.ceil(count / BLOGS_PER_PAGE));
}

function mergeProject(
  project: Project,
  copy: LocaleContentModule["projects"][string] | undefined,
): LocalizedProject {
  if (!copy) return project;
  return {
    ...project,
    summary: copy.summary,
    description: copy.description,
    details: [...copy.details],
    highlights: [...copy.highlights],
    period: copy.period,
    imageAlt: copy.imageAlt,
  };
}

function mergeBlog(
  post: BlogPost,
  copy: LocaleContentModule["blogs"][string] | undefined,
): LocalizedBlogPost {
  if (!copy) return post;
  return {
    ...post,
    title: copy.title,
    excerpt: copy.excerpt,
    description: copy.description,
    sections: copy.sections.map((section) => ({
      heading: section.heading,
      paragraphs: [...section.paragraphs],
      ...(section.points ? { points: [...section.points] } : {}),
      ...(section.links ? { links: section.links.map((link) => ({ ...link })) } : {}),
    })),
  };
}
