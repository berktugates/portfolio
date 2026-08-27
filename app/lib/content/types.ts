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

export type LegalDocument = {
  title: string;
  effectiveDate: string;
  introduction: string;
  sections: readonly {
    title: string;
    paragraphs?: readonly string[];
    items?: readonly string[];
  }[];
};

export type ProjectLegalDocuments = {
  privacy: LegalDocument;
  terms: LegalDocument;
};

export type ProjectLegalLocaleMap = Record<string, ProjectLegalDocuments>;

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
  privacyPolicy: string;
  termsOfService: string;
  /** Template with `{{title}}`. */
  legalDocumentsAria: string;
  /** Template with `{{title}}`. */
  appStoreScreenshotsAria: string;
  /** Template with `{{title}}` and `{{index}}`. */
  appStoreScreenshotAlt: string;
  previousScreenshots: string;
  nextScreenshots: string;
  subscribe: {
    title: string;
    body: string;
    emailLabel: string;
    emailPlaceholder: string;
    skip: string;
    submit: string;
    submitting: string;
    footnote: string;
    successTitle: string;
    successBody: string;
    dismissAria: string;
  };
};

export type LocaleContentModule = {
  projects: ProjectLocaleMap;
  blogs: BlogLocaleMap;
  legal: ProjectLegalLocaleMap;
  ui: ContentUi;
};

export type { Locale };
