import {
  classifyNewsQuery,
  licensedIllustrativeImage,
  slugifyNewsQuery,
} from "@berktug/editorial-gates/gundem/feed-compose";
import { claimsFromFeedItems, newsroomFactsForPrompt } from "@berktug/editorial-gates/gundem/news-quality";
import type { FeedStoryCluster } from "@berktug/editorial-gates/gundem/story-cluster";
import type { GundemBriefing } from "@berktug/editorial-gates/gundem/types";

const NEWS_MODEL = "@cf/meta/llama-3.2-3b-instruct";
export const NEWS_PROMPT_VERSION = "news-v2";
export const ESTIMATED_NEURONS_PER_DRAFT = 800;

type AiDraft = { title: string; excerpt: string; paragraphs: string[] };

function extractJson(value: unknown): unknown {
  if (value && typeof value === "object") {
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.title === "string" && Array.isArray(candidate.paragraphs)) return candidate;
    if ("response" in candidate) return extractJson(candidate.response);
  }
  const text = typeof value === "string" ? value : JSON.stringify(value);
  if (typeof text !== "string") return null;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
}

function isAiDraft(value: unknown): value is AiDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<AiDraft>;
  return typeof draft.title === "string" && draft.title.length >= 20 && draft.title.length <= 110 &&
    typeof draft.excerpt === "string" && draft.excerpt.length >= 120 && draft.excerpt.length <= 240 &&
    Array.isArray(draft.paragraphs) && draft.paragraphs.length >= 2 && draft.paragraphs.length <= 6 &&
    draft.paragraphs.every((paragraph) => typeof paragraph === "string" && paragraph.length >= 60);
}

const SYSTEM_PROMPT = `Sen haberler.berktugberke.com için kanıt kontrollü Türkçe haber editörüsün.
Yalnız JSON döndür: {"title":"...","excerpt":"...","paragraphs":["...","..."]}.
Kaynak metnini veya başlığını yeniden yazma; yalnız aşağıdaki kanıtlardaki olguları özgün cümlelerle sentezle.
Yeni kişi, kurum, rakam, skor, tarih, oran, alıntı, neden veya sonuç ekleme.
Başlık soru/clickbait değil, olay + sonuç olsun. Excerpt 140-220 karakterde iki somut gelişme içersin.
İlk paragraf bugün ne oldu/ne değişti sorusunu tarih ve varsa rakamla doğrudan cevaplasın.
Gövde 2-6 sıkı paragraf olsun; her paragraf yeni bilgi taşısın. Arka plan varsa yalnız son kısa paragraf olsun.
Resmî kaynak yoksa "medyada yer alan bilgilere göre" veya "iddia edildi" ayrımını koru; "kesinleşti/resmen" deme.
"Detaylar haberimizde", "bugün öne çıkan gelişmeler", doğrulama dersi, yatırım/sağlık tavsiyesi ve şablon dolgu kullanma.`;

export async function composeNewsDraftWithAi(
  env: Env,
  cluster: FeedStoryCluster,
  now = new Date(),
): Promise<GundemBriefing | null> {
  if (cluster.conflicts.length || cluster.independentPublisherGroupIds.length < 2) return null;
  const sources = cluster.items
    .filter((item) => item.link)
    .filter((item, index, all) => all.findIndex((candidate) => candidate.link === item.link) === index)
    .map((item) => ({
      url: item.link!,
      title: item.feedLabel,
      sourceId: item.feedId,
      publisherGroupId: item.publisherGroupId,
      sourceType: item.sourceType,
      publishedAt: item.pubDate,
    }));
  if (sources.length < 2) return null;

  const response = await env.AI.run(NEWS_MODEL, {
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Zaman: ${now.toISOString()}\nOlay ipucu: ${cluster.queryHint}\nKanıtlar:\n${newsroomFactsForPrompt(cluster.items)}`,
      },
    ],
    max_tokens: 1100,
    temperature: 0.2,
  });
  const parsed = extractJson(response);
  if (!isAiDraft(parsed)) return null;

  const category = classifyNewsQuery(`${cluster.queryHint} ${parsed.title}`);
  const iso = now.toISOString();
  const image = licensedIllustrativeImage(category);
  return {
    storyId: cluster.clusterId,
    slug: slugifyNewsQuery(`${cluster.queryHint}-${cluster.clusterId}`),
    title: parsed.title.trim(),
    excerpt: parsed.excerpt.trim(),
    bodyMarkdown: parsed.paragraphs.map((paragraph) => paragraph.trim()).join("\n\n"),
    publishedAt: iso,
    dateModified: iso,
    sources,
    image,
    cover: "type",
    trendQuery: `feed:${cluster.clusterId}`,
    angle: parsed.title.trim(),
    category,
    lang: "tr",
    editorialSource: "headlines",
    status: "DRAFTED",
    claims: claimsFromFeedItems(cluster.items),
    illustrativeImage: true,
    syndication: {
      mode: "rss-headline-synthesis",
      clusterId: cluster.clusterId,
      outlets: cluster.items.map((item) => ({
        feedId: item.feedId,
        itemId: item.dedupKey,
        publisherGroupId: item.publisherGroupId,
        sourceType: item.sourceType,
        label: item.feedLabel,
        title: item.title,
        url: item.link,
        pubDate: item.pubDate,
      })),
    },
  };
}
