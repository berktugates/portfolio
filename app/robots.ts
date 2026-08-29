import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

export const dynamic = "force-static";

/**
 * Named AI crawlers that honor robots.txt. The wildcard already allows
 * everyone; explicit groups exist so a later restrictive `*` rule cannot
 * silently exclude citation/training bots.
 *
 * xAI does not publish a first-party crawler page. GrokBot / xAI-Grok /
 * xAI-Bot are the tokens repeated in third-party GEO references.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "Anthropic-AI",
  "Google-Extended",
  "PerplexityBot",
  "Applebot-Extended",
  "GrokBot",
  "xAI-Grok",
  "xAI-Bot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
