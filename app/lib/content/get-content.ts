import type { Locale } from "../i18n/config";
import type { BlogPost } from "../../data/blogs";
import { BLOGS_PER_PAGE } from "../../data/blogs";
import { getCatalogBlogPost, getCatalogBlogPosts } from "./blog-catalog";
import { hasBlogLocaleOverlay } from "./blog-locale-overlay";
import type { Project } from "../../data/projects";
import { getProject, projects } from "../../data/projects";
import { getLocaleContent } from "./load-locale";
import type { LocaleContentModule, LocalizedBlogPost, LocalizedProject } from "./types";
import {
  estimateReadingMinutesFromSections,
  normalizeBlogSections,
} from "./reading-minutes";

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
  const posts = await getCatalogBlogPosts();
  return posts
    .filter((post) => locale === "en" || hasBlogLocaleOverlay(locale, post.slug))
    .map((post) => mergeBlog(post, content.blogs[post.slug], locale));
}

export async function getLocalizedBlogPost(
  locale: Locale,
  slug: string,
): Promise<LocalizedBlogPost | undefined> {
  const post = await getCatalogBlogPost(slug);
  if (!post) return undefined;
  const content = await getLocaleContent(locale);
  return mergeBlog(post, content.blogs[slug], locale);
}

export async function getLocalizedBlogPage(locale: Locale, page: number) {
  const posts = await getLocalizedBlogPosts(locale);
  const start = (page - 1) * BLOGS_PER_PAGE;
  return posts.slice(start, start + BLOGS_PER_PAGE);
}

export function getBlogTotalPagesFromCount(count: number) {
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
  locale: Locale,
): LocalizedBlogPost {
  const baseSections = normalizeBlogSections(post.sections);
  if (!copy) {
    return {
      ...post,
      sections: baseSections,
      readingMinutes: estimateReadingMinutesFromSections(baseSections, locale),
    };
  }
  const sections = normalizeBlogSections(copy.sections);
  return {
    ...post,
    title: copy.title,
    excerpt: copy.excerpt,
    description: copy.description,
    sections,
    readingMinutes: estimateReadingMinutesFromSections(sections, locale),
  };
}
