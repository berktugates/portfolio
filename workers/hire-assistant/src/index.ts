import { checkAssistantRateLimit, isQuotaExhaustedError } from "./rate-limit";
import { isBlockedUserMessage, refusalReply } from "./moderation";

export interface Env {
  AI: Ai;
  GROQ_API_KEY?: string;
  ASSISTANT_ORIGINS?: string;
  ASSISTANT_USE_GROQ?: string;
  ASSISTANT_DAILY_IP_LIMIT?: string;
  ASSISTANT_HOURLY_IP_LIMIT?: string;
}

type ChatPayload = {
  locale?: string;
  system?: string;
  messages: { role: "user" | "assistant"; content: string }[];
};

const DEFAULT_ORIGINS = [
  "https://berktugberke.com",
  "https://www.berktugberke.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 1500;
const MAX_SYSTEM_CHARS = 12_000;
const PRIMARY_MODEL = "@cf/meta/llama-3.2-3b-instruct";
const FALLBACK_MODEL = "@cf/meta/llama-3.2-1b-instruct";

function corsHeaders(origin: string | null, env: Env): HeadersInit {
  const allowed = (env.ASSISTANT_ORIGINS?.split(",") ?? DEFAULT_ORIGINS).map((o) => o.trim());
  const ok = origin && allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(body: unknown, status: number, headers: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

function parseLimits(env: Env) {
  const daily = Number.parseInt(env.ASSISTANT_DAILY_IP_LIMIT ?? "30", 10);
  const hourly = Number.parseInt(env.ASSISTANT_HOURLY_IP_LIMIT ?? "8", 10);
  return {
    daily: Number.isFinite(daily) && daily > 0 ? daily : 30,
    hourly: Number.isFinite(hourly) && hourly > 0 ? hourly : 8,
  };
}

function validatePayload(body: ChatPayload): string | null {
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return "messages required";
  }
  if (body.messages.length > MAX_MESSAGES) {
    return "too many messages";
  }
  if ((body.system?.length ?? 0) > MAX_SYSTEM_CHARS) {
    return "system prompt too long";
  }
  for (const msg of body.messages) {
    if (msg.role !== "user" && msg.role !== "assistant") return "invalid role";
    if (!msg.content || typeof msg.content !== "string") return "invalid content";
    if (msg.content.length > MAX_MESSAGE_CHARS) return "message too long";
  }
  return null;
}

async function runGroq(env: Env, system: string, messages: ChatPayload["messages"]): Promise<string | null> {
  if (env.ASSISTANT_USE_GROQ !== "true" || !env.GROQ_API_KEY) return null;
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.25,
      max_tokens: 700,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (res.status === 429) return null;
  if (!res.ok) return null;
  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return json.choices?.[0]?.message?.content?.trim() ?? null;
}

function extractAiText(result: unknown): string | null {
  if (typeof result === "string") return result.trim();
  if (result && typeof result === "object") {
    const r = result as Record<string, unknown>;
    if (typeof r.response === "string") return r.response.trim();
    if (r.result && typeof r.result === "object") {
      const inner = r.result as Record<string, unknown>;
      if (typeof inner.response === "string") return inner.response.trim();
    }
  }
  return null;
}

async function runWorkersAiModel(
  env: Env,
  model: string,
  system: string,
  messages: ChatPayload["messages"],
): Promise<string | null> {
  const chatMessages = [{ role: "system" as const, content: system }, ...messages];
  const result = await env.AI.run(model, {
    messages: chatMessages,
    max_tokens: 512,
    temperature: 0.25,
  });
  return extractAiText(result);
}

async function runWorkersAi(env: Env, system: string, messages: ChatPayload["messages"]): Promise<string | null> {
  try {
    const primary = await runWorkersAiModel(env, PRIMARY_MODEL, system, messages);
    if (primary) return primary;
  } catch (err) {
    if (isQuotaExhaustedError(err)) {
      console.error("Workers AI quota/limit hit — no fallback models", PRIMARY_MODEL);
      return null;
    }
    console.error("Workers AI error", PRIMARY_MODEL, err instanceof Error ? err.message : err);
  }

  try {
    return await runWorkersAiModel(env, FALLBACK_MODEL, system, messages);
  } catch (err) {
    if (isQuotaExhaustedError(err)) {
      console.error("Workers AI quota/limit hit", FALLBACK_MODEL);
      return null;
    }
    console.error("Workers AI error", FALLBACK_MODEL, err instanceof Error ? err.message : err);
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const headers = corsHeaders(origin, env);

    try {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
      }

      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405, headers });
      }

      const contentLength = Number.parseInt(request.headers.get("Content-Length") ?? "0", 10);
      if (contentLength > 32_000) {
        return jsonResponse({ error: "payload too large" }, 413, headers);
      }

      let body: ChatPayload;
      try {
        body = (await request.json()) as ChatPayload;
      } catch {
        return jsonResponse({ error: "Invalid JSON" }, 400, headers);
      }

      const validationError = validatePayload(body);
      if (validationError) {
        return jsonResponse({ error: validationError }, 400, headers);
      }

      const lastUser = [...body.messages].reverse().find((m) => m.role === "user")?.content ?? "";
      if (isBlockedUserMessage(lastUser)) {
        return jsonResponse({ reply: refusalReply(body.locale), refused: true }, 200, headers);
      }

      const rate = await checkAssistantRateLimit(request, parseLimits(env));
      if (!rate.allowed) {
        return jsonResponse({ error: "rate_limited", reason: rate.reason }, 429, headers);
      }

      const system =
        body.system?.trim() ||
        "You are Berktug AI on berktugberke.com. Reply professionally in passive/neutral tone; do not repeat the full name every time. Contact: contact@berktugberke.com.";

      const messages = body.messages.slice(-12);

      const reply =
        (env.ASSISTANT_USE_GROQ === "true" ? await runGroq(env, system, messages) : null) ??
        (await runWorkersAi(env, system, messages));

      if (!reply) {
        return jsonResponse({ error: "Model unavailable" }, 503, headers);
      }

      return jsonResponse({ reply }, 200, headers);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Worker error";
      return jsonResponse({ error: message }, 500, headers);
    }
  },
};
