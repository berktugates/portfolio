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

async function runWorkersAi(env: Env, system: string, messages: ChatPayload["messages"]): Promise<string | null> {
  const transcript = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n\n");
  const prompt = `${system}\n\n---\nConversation:\n${transcript}\n\nAssistant:`;
  const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    prompt,
    max_tokens: 700,
  });
  const text = typeof result === "string" ? result : (result as { response?: string }).response;
  return text?.trim() ?? null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const headers = corsHeaders(origin, env);

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
      "You are Berktug AI on berktugberke.com. Only verified contact: contact@berktugberke.com. No invented phone numbers or metrics.";

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
  },
};
