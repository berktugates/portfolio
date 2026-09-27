import type { LicensedImage } from "../image-license";
import type { GundemCategory } from "./categories";

export type GundemSource = {
  url: string;
  title: string;
  sourceId?: string;
  publisherGroupId?: string;
  sourceType?: NewsSourceType;
  publishedAt?: string;
};

export type NewsSourceType = "official" | "media" | "licensed-wire";
export type NewsRiskLevel = "low" | "medium" | "high" | "prohibited";
export type NewsStoryStatus =
  | "DETECTED"
  | "CLUSTERED"
  | "EVIDENCE_PENDING"
  | "DRAFTED"
  | "GATED"
  | "AUTO_APPROVED"
  | "REVIEW_REQUIRED"
  | "PUBLISHED"
  | "UPDATED"
  | "CORRECTED"
  | "RETRACTED";

export type EvidenceClaim = {
  claimId: string;
  subject: string;
  predicate: string;
  valueText?: string;
  unit?: string;
  occurredAt?: string;
  officialStatus: "official" | "media-reported" | "disputed";
  confidence: number;
  evidenceItemIds: readonly string[];
};

export type GundemRevision = {
  revisionId: string;
  kind: "publish" | "update" | "correction" | "retraction";
  createdAt: string;
  note?: string;
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
  storyId?: string;
  status?: NewsStoryStatus;
  riskLevel?: NewsRiskLevel;
  claims?: readonly EvidenceClaim[];
  revisions?: readonly GundemRevision[];
  correctionNotice?: string;
  illustrativeImage?: boolean;
  /** headlines = Trends olay özeti; curated/catalog = elle veya fallback. */
  editorialSource?: "headlines" | "curated" | "catalog";
  /** RSS çok kaynaklı küme — HTML scrape yok (docs/gundem-syndication.md). */
  syndication?: {
    mode: "rss-headline-synthesis";
    clusterId: string;
    outlets: readonly {
      feedId: string;
      itemId?: string;
      publisherGroupId?: string;
      sourceType?: NewsSourceType;
      label: string;
      title: string;
      url?: string;
      pubDate?: string;
    }[];
  };
};
