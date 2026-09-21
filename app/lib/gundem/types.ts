import type { LicensedImage } from "../image-license";
import type { GundemCategory } from "./editorial";

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
  /** Ulusal gündem şeridi; bilişim zorunlu değil. */
  category?: GundemCategory;
  lang: "tr";
};
