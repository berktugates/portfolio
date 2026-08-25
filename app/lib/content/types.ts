import type { Locale } from "../i18n/config";
import type { BlogPost, BlogSection } from "../../data/blogs";
import type { Project } from "../../data/projects";

/** Localizable project fields (identity/media stay on the EN base). */
export type ProjectCopy = {
  summary: string;
  description: string;
  details: readonly string[];
  highlights: readonly string[];
  period: string;
  imageAlt: string;
};

export type ProjectLocaleMap = Record<string, ProjectCopy>;

export type LocalizedProject = Project;

/** Full blog body overlay keyed by slug. */
export type BlogCopy = {
  title: string;
  excerpt: string;
  description: string;
  sections: readonly BlogSection[];
};

export type BlogLocaleMap = Record<string, BlogCopy>;

export type LocalizedBlogPost = BlogPost;

export type ContentUi = {
  back: string;
  blogs: string;
  blogsIntro: string;
  blogsMetaTitle: string;
  blogsMetaDescription: string;
  blogsMetaTitlePaged: string;
  minRead: string;
  publishedBy: string;
  previous: string;
  next: string;
  paginationAria: string;
  productScope: string;
  techStack: string;
  /** Official App Store badge alt text */
  downloadOnAppStore: string;
  /** Template with `{{title}}` */
  downloadOnAppStoreAria: string;
};

export type LocaleContentModule = {
  projects: ProjectLocaleMap;
  blogs: BlogLocaleMap;
  ui: ContentUi;
};

export type { Locale };
