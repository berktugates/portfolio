import type { LicensedImage } from "../image-license";
import type { GundemCategory } from "./categories";

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
  cover?: "photo" | "type";
  trendQuery: string;
  angle: string;
  category?: GundemCategory;
  lang: "tr";
};
