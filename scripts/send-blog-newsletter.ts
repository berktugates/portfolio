import { readFileSync } from "node:fs";
import { getBlogPost, type BlogPost } from "../app/data/blogs";

const API_BASE = "https://api.buttondown.com/v1";

function loadEnvFile(path: string) {
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://berktugberke.com").replace(/\/$/, "");
}

export function buildNewsletterSubject(post: BlogPost) {
  return `${post.title} | berktugberke.com`;
}

export function buildNewsletterBody(post: BlogPost) {
  const url = `${siteUrl()}/blogs/${post.slug}`;
  const lead =
    post.sections[0]?.paragraphs[0] ??
    post.description;

  return `<!-- buttondown-editor-mode: fancy -->
<p>${escapeHtml(post.excerpt)}</p>
<p>${escapeHtml(lead)}</p>
<p style="margin: 28px 0 8px;">
  <a href="${url}" style="display:inline-block;background:#09090b;color:#ffffff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;line-height:1;">
    Read more
  </a>
</p>
<p style="margin:0;font-size:12px;color:#71717a;">
  Or open: <a href="${url}" style="color:#71717a;">${url}</a>
</p>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function buttondown<T>(path: string, init?: RequestInit): Promise<T> {
  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    throw new Error("BUTTONDOWN_API_KEY is missing. Add it to .env.local");
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`Buttondown ${response.status} ${path}: ${text}`);
  }
  return data as T;
}

type Email = { id: string; subject: string; status: string; absolute_url?: string };

async function main() {
  const slug = process.argv[2];
  const dryRun = process.argv.includes("--dry-run");
  const draftOnly = process.argv.includes("--draft");

  if (!slug) {
    console.error("Usage: pnpm newsletter:send <blog-slug> [--dry-run] [--draft]");
    process.exit(1);
  }

  const post = getBlogPost(slug);
  if (!post) {
    console.error(`Unknown blog slug: ${slug}`);
    process.exit(1);
  }

  const subject = buildNewsletterSubject(post);
  const body = buildNewsletterBody(post);
  const canonicalUrl = `${siteUrl()}/blogs/${post.slug}`;

  console.log(`Subject: ${subject}`);
  console.log(`Canonical: ${canonicalUrl}`);
  if (dryRun) {
    console.log("\n--- body ---\n");
    console.log(body);
    return;
  }

  const email = await buttondown<Email>("/emails", {
    method: "POST",
    body: JSON.stringify({
      subject,
      body,
      email_type: "public",
      status: "draft",
      canonical_url: canonicalUrl,
      description: post.excerpt,
      slug: post.slug.slice(0, 100).replace(/[^a-zA-Z0-9_-]/g, "-"),
      metadata: {
        source: "portfolio-blog",
        blog_slug: post.slug,
      },
    }),
  });

  console.log(`Created draft: ${email.id}`);

  if (draftOnly) {
    console.log("Left as draft (--draft).");
    return;
  }

  const published = await buttondown<Email>(`/emails/${email.id}/publish`, {
    method: "POST",
    body: JSON.stringify({
      publish_date: new Date().toISOString(),
    }),
  });

  console.log(`Published: ${published.status}`);
  console.log(`URL: ${published.absolute_url ?? email.absolute_url ?? "(n/a)"}`);
  console.log("Tip: check spam if inbox is empty; analytics may lag a minute.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
