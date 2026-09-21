import type { LicensedImage } from "../image-license";

export type GundemSource = {
  url: string;
  title: string;
};

export type GundemBriefing = {
  slug: string;
  title: string;
  excerpt: string;
  bodyMarkdown: string;
  publishedAt: string;
  dateModified: string;
  sources: readonly GundemSource[];
  image: LicensedImage;
  trendQuery: string;
  angle: string;
  lang: "tr";
};
