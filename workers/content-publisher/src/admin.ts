import { authenticatedEditor } from "./access-auth";
import { listReviewStories, recordReviewAction, updateStoryStatus } from "./d1";
import { getReviewDraft } from "./r2";
import { publishBriefing } from "./haber-cron";

function json(value: unknown, status = 200): Response {
  return Response.json(value, { status, headers: { "Cache-Control": "no-store" } });
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

function panelHtml(): string {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Haber editör kuyruğu</title><style>body{font:15px system-ui;max-width:1100px;margin:40px auto;padding:0 20px;background:#09090b;color:#fafafa}article{border:1px solid #3f3f46;border-radius:12px;padding:16px;margin:14px 0}button{margin-right:8px;padding:8px 12px}pre{white-space:pre-wrap;color:#d4d4d8}.evidence{padding:10px;background:#18181b;border-radius:8px}.muted{color:#a1a1aa}</style></head><body><h1>Haber editör kuyruğu</h1><p id="status">Yükleniyor…</p><main id="list"></main><script>
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function act(id,action){const r=await fetch('/admin/stories/'+encodeURIComponent(id)+'/'+action,{method:'POST',headers:{'Idempotency-Key':crypto.randomUUID()}});if(!r.ok)alert(await r.text());load()}
async function load(){const r=await fetch('/admin/api/stories');const data=await r.json();status.textContent=data.length+' inceleme bekliyor';list.innerHTML=data.map(s=>{const d=s.draft||{};const sources=(d.sources||[]).map(x=>'<li><a href="'+esc(x.url)+'" target="_blank" rel="noreferrer">'+esc(x.title)+'</a> · '+esc(x.publisherGroupId||'')+' · '+esc(x.sourceType||'')+'</li>').join('');return '<article data-id="'+esc(s.story_id)+'"><h2>'+esc(d.title||s.slug)+'</h2><p>Risk: '+esc(s.risk_level)+' · '+esc(s.category)+'</p><p>'+esc(d.excerpt||'')+'</p><pre>'+esc(d.bodyMarkdown||'')+'</pre><div class="evidence"><b>Kanıt matrisi</b><ul>'+sources+'</ul><span class="muted">Claim: '+esc((d.claims||[]).length)+' · revizyon: '+esc((d.revisions||[]).length)+'</span></div><p><button data-action="approve">Onayla</button><button data-action="reject">Reddet</button><button data-action="retract">Geri çek</button></p></article>'}).join('')}
list.addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b)return;act(b.closest('article').dataset.id,b.dataset.action)});load();</script></body></html>`;
}

export async function handleAdminRequest(request: Request, env: Env): Promise<Response> {
  const actor = await authenticatedEditor(request, env);
  if (!actor) return new Response("unauthorized", { status: 401 });
  const url = new URL(request.url);
  if (request.method === "GET" && url.pathname === "/admin") {
    return new Response(panelHtml(), { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
  }
  if (request.method === "GET" && url.pathname === "/admin/api/stories") {
    const stories = await listReviewStories(env) as Array<{ story_id: string }>;
    return json(await Promise.all(stories.map(async (story) => ({
      ...story,
      draft: await getReviewDraft(env.CONTENT_BUCKET, story.story_id),
    }))));
  }
  const match = url.pathname.match(/^\/admin\/stories\/([^/]+)\/(approve|reject|correct|retract)$/);
  if (!match || request.method !== "POST") return new Response("not found", { status: 404 });
  if (!sameOrigin(request)) return new Response("csrf", { status: 403 });
  const storyId = decodeURIComponent(match[1]);
  const action = match[2];
  const idempotencyKey = request.headers.get("idempotency-key");
  if (!idempotencyKey || idempotencyKey.length > 100) return json({ error: "idempotency-key-required" }, 400);
  const inserted = await recordReviewAction(env, { storyId, action, actor, idempotencyKey });
  if (!inserted) return json({ ok: true, replay: true });

  if (action === "approve") {
    if (env.PUBLICATION_LEGAL_READY !== "true") return json({ error: "publication-legal-not-ready" }, 409);
    const draft = await getReviewDraft(env.CONTENT_BUCKET, storyId);
    if (!draft || draft.riskLevel === "prohibited") return json({ error: "draft-not-publishable" }, 409);
    const published = await publishBriefing(env, { ...draft, status: "AUTO_APPROVED" });
    return json({ ok: published });
  }
  await updateStoryStatus(env, storyId, action === "reject" ? "EVIDENCE_PENDING" : action === "retract" ? "RETRACTED" : "CORRECTED");
  return json({ ok: true });
}
