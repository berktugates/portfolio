import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { getBlogPost, type BlogPost } from "../app/data/blogs";

const API_BASE = "https://api.buttondown.com/v1";
const ZERO_SHA = "0000000000000000000000000000000000000000";

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

function buildNewsletterSubject(post: BlogPost) {
  return `${post.title} | berktugberke.com`;
}

function buildNewsletterBody(post: BlogPost) {
  const url = `${siteUrl()}/blogs/${post.slug}`;
  const lead = post.sections[0]?.paragraphs[0] ?? post.description;

  // Table-based CTA: right-aligned, white label with !important (some clients restyle <a>).
  return `<!-- buttondown-editor-mode: fancy -->
<p>${escapeHtml(post.excerpt)}</p>
<p>${escapeHtml(lead)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;border-collapse:collapse;">
  <tr>
    <td align="right" style="text-align:right;">
      <a href="${url}" style="display:inline-block;background-color:#09090b;background:#09090b;color:#ffffff !important;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;line-height:1;mso-padding-alt:0;">
        <!--[if mso]><i style="letter-spacing:18px;mso-font-width:-100%;mso-text-raise:18pt;">&nbsp;</i><![endif]-->
        <span style="color:#ffffff !important;text-decoration:none;">Read more</span>
        <!--[if mso]><i style="letter-spacing:18px;mso-font-width:-100%;">&nbsp;</i><![endif]-->
      </a>
    </td>
  </tr>
</table>
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
    throw new Error("BUTTONDOWN_API_KEY is missing. Add it to GitHub Actions secrets / .env.local");
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

type Email = {
  id: string;
  subject: string;
  status: string;
  absolute_url?: string;
  metadata?: { blog_slug?: string; source?: string };
};

type EmailList = { results: Email[]; next: string | null };

async function listAllEmails(): Promise<Email[]> {
  const emails: Email[] = [];
  let path: string | null = "/emails?page_size=100&ordering=-creation_date";

  while (path) {
    const requestPath = path.startsWith("http")
      ? path.replace(/^https?:\/\/api\.buttondown\.com\/v1/, "")
      : path;
    const page = await buttondown<EmailList>(requestPath);
    emails.push(...page.results);
    path = page.next;
  }

  return emails;
}

function alreadyAnnounced(emails: Email[], slug: string) {
  const active = new Set(["draft", "scheduled", "about_to_send", "in_flight", "sent", "throttled", "resending"]);
  return emails.some(
    (email) => email.metadata?.blog_slug === slug && email.metadata?.source === "portfolio-blog" && active.has(email.status),
  );
}

function newSlugsFromGitDiff(): string[] {
  const before = process.env.GITHUB_EVENT_BEFORE;
  const range =
    before && before !== ZERO_SHA
      ? `${before}...HEAD`
      : "HEAD~1...HEAD";

  let diff = "";
  try {
    diff = execSync(`git diff ${range} -- app/data/blogs.ts`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    console.warn(`Could not diff ${range}; falling back to empty set.`, error instanceof Error ? error.message : error);
    return [];
  }

  const matches = [...diff.matchAll(/^\+\s*slug:\s*"([^"]+)"/gm)].map((match) => match[1]);
  return [...new Set(matches)].filter((slug) => Boolean(getBlogPost(slug)));
}

async function waitUntilLive(url: string) {
  const attempts = Number(process.env.NEWSLETTER_LIVE_ATTEMPTS ?? 24);
  const delayMs = Number(process.env.NEWSLETTER_LIVE_DELAY_MS ?? 15_000);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { method: "GET", redirect: "follow" });
      if (response.ok) {
        console.log(`Live check passed (${response.status}) on attempt ${attempt}: ${url}`);
        return;
      }
      console.log(`Live check ${response.status} on attempt ${attempt}; retrying…`);
    } catch (error) {
      console.log(`Live check failed on attempt ${attempt}; retrying…`, error instanceof Error ? error.message : error);
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  console.warn(`Continuing without confirmed live URL after ${attempts} attempts: ${url}`);
}

async function sendBlogNewsletter(slug: string, options: { dryRun?: boolean; draftOnly?: boolean; skipLiveWait?: boolean } = {}) {
  const post = getBlogPost(slug);
  if (!post) {
    throw new Error(`Unknown blog slug: ${slug}`);
  }

  const subject = buildNewsletterSubject(post);
  const body = buildNewsletterBody(post);
  const canonicalUrl = `${siteUrl()}/blogs/${post.slug}`;

  console.log(`Subject: ${subject}`);
  console.log(`Canonical: ${canonicalUrl}`);

  if (options.dryRun) {
    console.log("\n--- body ---\n");
    console.log(body);
    return null;
  }

  if (!options.skipLiveWait) {
    await waitUntilLive(canonicalUrl);
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

  if (options.draftOnly) {
    console.log("Left as draft (--draft).");
    return email;
  }

  const published = await buttondown<Email>(`/emails/${email.id}/publish`, {
    method: "POST",
    body: JSON.stringify({
      publish_date: new Date().toISOString(),
    }),
  });

  console.log(`Published: ${published.status}`);
  return published;
}

async function syncFromDiff(options: { dryRun?: boolean; draftOnly?: boolean }) {
  const slugs = newSlugsFromGitDiff();
  if (slugs.length === 0) {
    console.log("No new blog slugs in this commit diff. Nothing to send.");
    return;
  }

  console.log(`New blog slug(s): ${slugs.join(", ")}`);
  const emails = options.dryRun ? [] : await listAllEmails();

  for (const slug of slugs) {
    if (!options.dryRun && alreadyAnnounced(emails, slug)) {
      console.log(`Skip ${slug}: already announced.`);
      continue;
    }
    await sendBlogNewsletter(slug, options);
  }
}

async function main() {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  const sync = process.argv.includes("--sync");
  const dryRun = process.argv.includes("--dry-run");
  const draftOnly = process.argv.includes("--draft");
  const skipLiveWait = process.argv.includes("--skip-live-wait");

  if (sync) {
    await syncFromDiff({ dryRun, draftOnly });
    return;
  }

  const slug = args[0];
  if (!slug) {
    console.error("Usage:");
    console.error("  pnpm newsletter:send <blog-slug> [--dry-run] [--draft] [--skip-live-wait]");
    console.error("  pnpm newsletter:sync [--dry-run] [--draft]");
    process.exit(1);
  }

  // Manual single-slug sends skip the deploy wait by default for local testing.
  await sendBlogNewsletter(slug, {
    dryRun,
    draftOnly,
    skipLiveWait: skipLiveWait || !process.env.CI,
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
