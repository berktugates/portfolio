export type GrowthDailyPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  contentHtml: string;
  status: "draft" | "published";
  publishedAt: string | null;
  updatedAt: string | null;
  readingTimeMinutes: number | null;
  qualityBand: "premium" | "standard" | "review" | null;
  reviewStatus?: string | null;
  language: string | null;
  sourcePostId: string | null;
  seo?: {
    metaDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    keywords?: string[];
  } | null;
  faqJsonLd?: unknown;
};

export type ArticleReadyPayload = {
  event: string;
  siteId: string;
  postId: string;
  slug: string;
  title?: string;
  qualityBand?: string | null;
  language?: string | null;
  sourcePostId?: string | null;
  status?: string;
  at?: string;
};

export type GrowthDailyBlogRecord = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  publishedAt: string;
  dateModified?: string;
  readingMinutes: number;
  keywords: readonly string[];
  sections: readonly [];
  contentHtml: string;
  faqJsonLd?: unknown;
  source: "growthdaily";
  locales: readonly string[];
  growthDailyPostId: string;
};
