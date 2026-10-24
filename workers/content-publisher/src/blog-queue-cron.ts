import { assessContentSafety } from "@berktug/editorial-gates/content-safety";
import { mergeBlogIndex, putJson, type BlogPostRecord } from "./r2";
import { blogSlugPublished, recordBlogPublish } from "./d1";
import { revalidateOrQueue } from "./revalidate";
import { istanbulCalendarDay } from "./growthdaily/daily-cap";

const QUEUE_PREFIX = "queue/blog/";
const LOCALE_CODES = ["tr", "de", "fr", "it", "zh", "ja"] as const;

type QueueSection = {
  heading: string;
  paragraphs: readonly string[];
  points?: readonly string[];
};

type QueueLocaleCopy = {
  title: string;
  excerpt: string;
  description: string;
  sections: QueueSection[];
};

type QueuePost = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  readingMinutes: number;
  keywords: readonly string[];
  sections: QueueSection[];
  socialThreadTr?: readonly [string, string];
  locales: Record<(typeof LOCALE_CODES)[number], QueueLocaleCopy>;
};

function isoPublishAt(istanbulDay: string): string {
  return `${istanbulDay}T09:00:00.000Z`;
}

function bodyPlain(sections: QueueSection[]): string {
  return sections.flatMap((s) => s.paragraphs).join("\n\n");
}

function isQueuePost(value: unknown): value is QueuePost {
  if (!value || typeof value !== "object") return false;
  const v = value as QueuePost;
  if (!v.slug || !v.title || !Array.isArray(v.sections)) return false;
  for (const code of LOCALE_CODES) {
    if (!v.locales?.[code]?.title) return false;
  }
  return true;
}

export async function runBlogQueueCron(env: Env): Promise<{ published: boolean; slug?: string; reason?: string }> {
  const listed = await env.CONTENT_BUCKET.list({ prefix: QUEUE_PREFIX, limit: 200 });
  const keys = listed.objects
    .map((o) => o.key)
    .filter((k): k is string => Boolean(k?.endsWith(".json")))
    .sort();
  if (keys.length === 0) {
    console.log("blog-queue-cron: empty-queue");
    return { published: false, reason: "empty-queue" };
  }

  const key = keys[0]!;
  const raw = await env.CONTENT_BUCKET.get(key);
  if (!raw) {
    console.log(`blog-queue-cron: missing-object ${key}`);
    return { published: false, reason: "missing-object" };
  }

  let parsed: unknown;
  try {
    parsed = await raw.json();
  } catch {
    console.log(`blog-queue-cron: invalid-json ${key}`);
    return { published: false, reason: "invalid-json" };
  }

  if (!isQueuePost(parsed)) {
    console.log(`blog-queue-cron: invalid-schema ${key}`);
    return { published: false, reason: "invalid-schema" };
  }

  const slug = parsed.slug;
  if (await blogSlugPublished(env, slug)) {
    await env.CONTENT_BUCKET.delete(key);
    console.log(`blog-queue-cron: dedupe-delete ${key} slug=${slug}`);
    return { published: false, reason: "slug-already-published" };
  }

  const safety = assessContentSafety({
    title: parsed.title,
    body: bodyPlain(parsed.sections),
    excerpt: parsed.excerpt,
    channel: "blog",
  });
  if (!safety.ok) {
    console.log(`blog-queue-cron: safety-fail ${safety.code}`);
    return { published: false, reason: safety.code };
  }

  const istanbulDay = istanbulCalendarDay();
  const publishedAt = isoPublishAt(istanbulDay);

  const enRecord: BlogPostRecord & { source: "queue"; locales: string[]; socialThreadTr?: readonly [string, string] } = {
    slug,
    title: parsed.title,
    excerpt: parsed.excerpt,
    description: parsed.description,
    publishedAt,
    dateModified: publishedAt,
    readingMinutes: parsed.readingMinutes,
    keywords: [...parsed.keywords],
    sections: parsed.sections,
    socialThreadTr: parsed.socialThreadTr,
    source: "queue",
    locales: ["en", ...LOCALE_CODES],
  };

  await putJson(env.CONTENT_BUCKET, `blogs/${slug}.json`, enRecord);

  for (const locale of LOCALE_CODES) {
    const copy = parsed.locales[locale];
    await putJson(env.CONTENT_BUCKET, `blogs/${locale}/${slug}.json`, {
      slug,
      title: copy.title,
      excerpt: copy.excerpt,
      description: copy.description,
      publishedAt,
      dateModified: publishedAt,
      readingMinutes: parsed.readingMinutes,
      keywords: [...parsed.keywords],
      sections: copy.sections,
      source: "queue",
    });
  }

  await mergeBlogIndex(env.CONTENT_BUCKET, enRecord);
  await recordBlogPublish(env, slug, istanbulDay);
  await env.CONTENT_BUCKET.delete(key);

  const paths = [
    "/blogs",
    "/tr/blogs",
    "/de/blogs",
    "/fr/blogs",
    "/it/blogs",
    "/zh/blogs",
    "/ja/blogs",
    `/blogs/${slug}`,
    `/tr/blogs/${slug}`,
    `/de/blogs/${slug}`,
    `/fr/blogs/${slug}`,
    `/it/blogs/${slug}`,
    `/zh/blogs/${slug}`,
    `/ja/blogs/${slug}`,
    "/blogs/rss.xml",
    "/tr/blogs/rss.xml",
    "/sitemap.xml",
  ];

  await revalidateOrQueue(env, paths, ["blogs"]);

  console.log(`blog-queue-cron: published slug=${slug} from ${key}`);
  return { published: true, slug };
}
