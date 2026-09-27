import { assessContentSafety } from "@berktug/editorial-gates/content-safety";
import { validateBlogPostDraft } from "@berktug/editorial-gates/blog/schema";
import {
  blogSlugPublished,
  markBlogTopicPublished,
  nextBlogTopic,
  recordBlogPublish,
  seedBlogTopicsIfEmpty,
} from "./d1";
import { mergeBlogIndex, putJson, type BlogPostRecord } from "./r2";
import { revalidateOrQueue } from "./revalidate";
import blogTopicsSeed from "../../../content/blog-topics.json";

const BLOG_MODEL = "@cf/meta/llama-3.2-3b-instruct";

function draftBodyText(sections: BlogPostRecord["sections"]): string {
  return sections.flatMap((s) => s.paragraphs).join("\n\n");
}

function estimateReadingMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(4, Math.min(14, Math.round(words / 220)));
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1));
  } catch {
    return null;
  }
}

function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /quota|limit|429|exceeded/i.test(msg);
}

const SYSTEM_PROMPT = `You are a staff engineer writing for berktugberke.com.
Return ONLY valid JSON matching this shape:
{"slug":"kebab-case","title":"...","excerpt":"...","description":"...","keywords":["a","b","c"],"sections":[{"heading":"...","paragraphs":["40+ chars..."]}]}
Rules: technical depth, portfolio tone, no news agency voice, no "search volume rose" template spam, no Trends references, min 3 sections, slug must match topic hint when possible.`;

export async function runBlogCron(env: Env): Promise<{ published: boolean; reason?: string }> {
  await seedBlogTopicsIfEmpty(env, blogTopicsSeed.topics);

  const topic = await nextBlogTopic(env);
  if (!topic) {
    console.log("blog-cron: no-pending-topics");
    return { published: false, reason: "no-pending-topics" };
  }

  const today = new Date().toISOString().slice(0, 10);
  let aiText: string;
  try {
    const result = await env.AI.run(BLOG_MODEL, {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Topic hint slug: ${topic.slug_hint}\nBrief: ${topic.prompt}\nWrite the JSON article now.`,
        },
      ],
      max_tokens: 4096,
    });
    aiText =
      typeof result === "string"
        ? result
        : ((result as { response?: string }).response ?? JSON.stringify(result));
  } catch (e) {
    if (isQuotaError(e)) {
      console.log("blog-cron: skipped-quota");
      return { published: false, reason: "skipped-quota" };
    }
    console.log("blog-cron: ai-failed", e instanceof Error ? e.message : e);
    return { published: false, reason: "ai-failed" };
  }

  const parsed = extractJsonObject(aiText);
  if (!validateBlogPostDraft(parsed)) {
    console.log("blog-cron: invalid-schema");
    return { published: false, reason: "invalid-schema" };
  }

  const slug = parsed.slug || topic.slug_hint;
  if (await blogSlugPublished(env, slug)) {
    await markBlogTopicPublished(env, topic.id, today);
    console.log("blog-cron: slug-already-published");
    return { published: false, reason: "slug-already-published" };
  }

  const body = draftBodyText(parsed.sections);
  const safety = assessContentSafety({
    title: parsed.title,
    body,
    excerpt: parsed.excerpt,
    channel: "blog",
  });
  if (!safety.ok) {
    console.log(`blog-cron: safety-fail ${safety.code}`);
    return { published: false, reason: safety.code };
  }

  const post: BlogPostRecord = {
    ...parsed,
    slug,
    publishedAt: today,
    dateModified: today,
    readingMinutes: estimateReadingMinutes(body),
  };

  await putJson(env.CONTENT_BUCKET, `blogs/${post.slug}.json`, post);
  await mergeBlogIndex(env.CONTENT_BUCKET, post);
  await recordBlogPublish(env, post.slug, today);
  await markBlogTopicPublished(env, topic.id, today);

  await revalidateOrQueue(
    env,
    [
      "/blogs",
      "/tr/blogs",
      `/blogs/${post.slug}`,
      `/tr/blogs/${post.slug}`,
      "/blogs/rss.xml",
      "/tr/blogs/rss.xml",
    ],
    ["blogs"],
  );

  console.log(`blog-cron: published slug=${post.slug}`);
  return { published: true };
}
