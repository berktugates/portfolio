export interface Env {
  AI: Ai;
  GROQ_API_KEY?: string;
  ASSISTANT_ORIGINS?: string;
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

async function runGroq(env: Env, system: string, messages: ChatPayload["messages"]): Promise<string | null> {
  if (!env.GROQ_API_KEY) return null;
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.35,
      max_tokens: 700,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
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

async function runWorkersAi(env: Env, system: string, messages: ChatPayload["messages"]): Promise<string | null> {
  const chatMessages = [{ role: "system" as const, content: system }, ...messages];
  const models = [
    "@cf/meta/llama-3.2-3b-instruct",
    "@cf/meta/llama-3.2-1b-instruct",
    "@cf/meta/llama-3.1-8b-instruct-fp8",
  ];

  for (const model of models) {
    try {
      const result = await env.AI.run(model, {
        messages: chatMessages,
        max_tokens: 512,
        temperature: 0.35,
      });
      const text = extractAiText(result);
      if (text) return text;
      console.error("Workers AI empty response", model, JSON.stringify(result).slice(0, 400));
    } catch (err) {
      console.error("Workers AI error", model, err instanceof Error ? err.message : err);
    }
  }
  return null;
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

      let body: ChatPayload;
      try {
        body = (await request.json()) as ChatPayload;
      } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      if (!Array.isArray(body.messages) || body.messages.length === 0) {
        return new Response(JSON.stringify({ error: "messages required" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      const system =
        body.system?.trim() ||
        "You are Berktug AI on berktugberke.com for Berktuğ Berke Ateş. Every reply: first 1–2 sentences on how strong he is for the specific topic (production systems, architecture, end-to-end delivery) — never use the word staff. Contact only: contact@berktugberke.com. No invented metrics.";

      const messages = body.messages.slice(-12);

      const reply = (await runGroq(env, system, messages)) ?? (await runWorkersAi(env, system, messages));

      if (!reply) {
        return new Response(JSON.stringify({ error: "Model unavailable" }), {
          status: 503,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Worker error";
      return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }
  },
};
