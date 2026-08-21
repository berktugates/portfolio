export type BlogSection = {
  heading: string;
  paragraphs: readonly string[];
  points?: readonly string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  publishedAt: string;
  readingMinutes: number;
  keywords: readonly string[];
  sections: readonly BlogSection[];
};

export const BLOGS_PER_PAGE = 10;

export const blogPosts: readonly BlogPost[] = [
  {
    slug: "failure-modes-of-ai-feature-rollouts",
    title: "Failure Modes of AI Feature Rollouts",
    excerpt: "Most AI launches fail in the gaps between demos, dashboards, and real user workflows.",
    description: "Anticipate the common failure modes of AI feature rollouts: silent quality drift, cost spikes, incomplete fallbacks, and release criteria that ignore production risk.",
    publishedAt: "2026-08-22",
    readingMinutes: 8,
    keywords: ["AI feature rollout", "production AI", "release engineering", "LLM reliability", "AI product engineering"],
    sections: [
      { heading: "Demos hide the operational surface", paragraphs: [
        "A polished demo proves that a model can produce useful output under curated conditions. A rollout proves that the same system stays useful when traffic is messy, latency budgets are tight, and the organization must recover from bad answers without melting support.",
        "Treat the first production week as a systems test. You are validating retrieval freshness, tool reliability, fallback paths, cost ceilings, and the human workflows that catch what automation misses. If those pieces are undefined, the feature is not ready—only the demo is."
      ]},
      { heading: "Quality drifts without an owner", paragraphs: [
        "Model providers change defaults. Prompts accumulate exceptions. Retrieval indexes rot. None of this announces itself with a red deploy. Teams that ship AI without an explicit quality owner discover regressions through customer complaints weeks later.",
        "Assign ownership the same way you would for an availability SLO. Define the properties that matter, sample production traffic, and require a named reviewer when those properties move. Drift is inevitable; unowned drift is a product failure."
      ], points: ["Version prompts, retrieval config, and evaluation suites together", "Alert on refusal rate, escalation rate, and correction rate—not only errors", "Keep a rollback path that disables AI without disabling the product", "Budget time for post-launch triage before declaring success"]},
      { heading: "Fallbacks are part of the feature", paragraphs: [
        "When the model is unavailable, slow, or low-confidence, users still need a path to complete the job. A blank state or a polite apology is not a fallback. A fallback is the deterministic flow, cached answer, search result, or human handoff that preserves progress.",
        "Design fallbacks before launch and exercise them in staging. Measure how often they fire. If fallbacks are rare in testing but common in production, your confidence thresholds or dependency assumptions are wrong."
      ]},
      { heading: "Release criteria must include cost and risk", paragraphs: [
        "Passing a handful of golden prompts is necessary and insufficient. Gate releases on critical property regressions, cost per successful outcome, latency at p95, and the readiness of support and trust teams. High-stakes actions need stricter bars than low-stakes drafting aids.",
        "A healthy AI rollout looks boring: gradual exposure, clear kill switches, observed quality, and a team that can explain what changed when something goes wrong. That boredom is the signal that engineering owned the risk instead of hoping the model would."
      ]}
    ]
  },
  {
    slug: "context-engineering-for-reliable-ai-features",
    title: "Context Engineering for Reliable AI Features",
    excerpt: "Most AI product failures are context failures. Design retrieval, memory, and instructions as a system.",
    description: "Learn how context engineering improves production AI reliability through retrieval design, memory boundaries, instruction hierarchy, and measurable grounding.",
    publishedAt: "2026-08-05",
    readingMinutes: 8,
    keywords: ["context engineering", "production AI", "RAG architecture", "LLM reliability", "AI product engineering"],
    sections: [
      { heading: "Prompts are not the whole system", paragraphs: [
        "When an AI feature hallucinates, teams often rewrite the system prompt. That can help, but it rarely addresses the root cause. The model can only reason over what it is given. If retrieval is weak, memory is noisy, or tool results are incomplete, no amount of wording will create dependable behavior.",
        "Context engineering treats the assembled input as a product surface. It asks which facts must be present, which instructions take priority, how much history is useful, and what should be excluded. The goal is a bounded, inspectable packet of information that makes the intended answer possible."
      ]},
      { heading: "Separate instructions, facts, and tools", paragraphs: [
        "A durable context packet has layers with clear ownership. Policy and product instructions define what the model may do. Retrieved facts provide grounded evidence. Tool outputs describe the current world. Conversation history captures user intent. Mixing these layers into one undifferentiated blob makes debugging almost impossible.",
        "Give each layer a stable format and a size budget. Prefer structured facts over long prose dumps. When evidence conflicts, preserve provenance so the system can prefer authoritative sources or ask a clarifying question instead of inventing reconciliation."
      ], points: ["Rank context by decision value, not by token count", "Keep authorization decisions outside the model", "Cap history with summarization that preserves commitments", "Log which sources entered the final prompt"]},
      { heading: "Retrieval quality is product quality", paragraphs: [
        "Retrieval-augmented generation fails quietly when the wrong documents are fetched with high confidence. Measure recall on the questions that matter, not only embedding similarity. Include hard cases: synonyms, partial identifiers, multilingual queries, and requests that should retrieve nothing.",
        "Chunking strategy, metadata filters, and reranking belong in the same review as the model choice. A smaller model with excellent context often outperforms a larger model with polluted context, especially under latency and cost constraints."
      ]},
      { heading: "Make context observable", paragraphs: [
        "When users report a bad answer, engineers need to reconstruct the context that produced it. Store prompt and retrieval versions, source identifiers, token budgets, and validation outcomes with privacy controls. Without that trail, every incident becomes anecdotal.",
        "Context engineering is successful when the system can explain what it knew, what it did not know, and why it answered the way it did. That transparency is the foundation of trust in AI products."
      ]}
    ]
  },
  {
    slug: "cost-aware-ai-product-architecture",
    title: "Cost-Aware Architecture for AI Products",
    excerpt: "Treat model spend as a product constraint, not an after-the-fact finance surprise.",
    description: "Design AI features with explicit cost budgets, caching, model routing, evaluation tradeoffs, and unit economics that survive real traffic.",
    publishedAt: "2026-05-21",
    readingMinutes: 7,
    keywords: ["AI cost optimization", "LLM architecture", "AI product design", "model routing", "software economics"],
    sections: [
      { heading: "Unit economics belong in the design doc", paragraphs: [
        "An AI feature that delights ten users and bankrupts the company at ten thousand users is not a finished design. Estimate tokens per request, expected concurrency, cache hit rate, evaluation overhead, and the willingness of customers to pay for the outcome. These numbers should influence model choice and interaction design before launch.",
        "Cost awareness is not the same as cheapness. Some workflows deserve an expensive model because the alternative is human labor or lost revenue. The engineering task is to spend deliberately where quality creates leverage and refuse spend where it does not."
      ]},
      { heading: "Route work by difficulty", paragraphs: [
        "Not every request needs the strongest available model. Classify tasks by risk and ambiguity. Deterministic extraction, classification, and formatting can often use smaller models or classical software. Open-ended synthesis, planning, and high-stakes advice may justify a stronger model with tighter guardrails.",
        "Routing should be explicit and measurable. Track quality, latency, and cost by route. A cascade that escalates only when confidence is low preserves experience while keeping the average request affordable."
      ], points: ["Cache stable retrieval and repeated prompts", "Prefer structured outputs that reduce retries", "Budget evaluation runs like production traffic", "Expose cost alarms before invoices arrive"]},
      { heading: "Product shape changes the bill", paragraphs: [
        "Streaming long essays is expensive. Asking for concise structured recommendations is cheaper and often more useful. Interface decisions—when to call a model, how much history to send, whether to regenerate—are cost controls as much as UX choices.",
        "Batch offline work, precompute frequent answers, and avoid sending the entire account history when a small relevant slice will do. The cheapest token is the one the system never sends."
      ]},
      { heading: "Make spend a health signal", paragraphs: [
        "Track cost per successful outcome, not only cost per request. A cheap endpoint that users retry five times is not cheap. Connect finance metrics to product analytics so teams can see whether spend is buying retention, conversion, or support deflection.",
        "Sustainable AI products treat model spend as an architectural parameter. When the budget is visible, teams invent better systems instead of hoping traffic stays small."
      ]}
    ]
  },
  {
    slug: "evaluating-llm-outputs-in-production",
    title: "Evaluating LLM Outputs Without Guesswork",
    excerpt: "Replace vibes-based shipping with evaluation suites that reflect real product risk.",
    description: "Build production LLM evaluation with golden datasets, automated graders, human review loops, regression gates, and risk-based release criteria.",
    publishedAt: "2026-01-28",
    readingMinutes: 8,
    keywords: ["LLM evaluation", "AI quality assurance", "prompt regression testing", "production AI", "machine learning ops"],
    sections: [
      { heading: "Define the properties that matter", paragraphs: [
        "Generic accuracy scores rarely protect a product. Decide which properties users and the business cannot compromise: factual grounding, schema validity, tone, refusal quality, latency, citation presence, or policy compliance. Different features need different scorecards.",
        "Write these properties as measurable checks. A grounded answer should cite allowed sources. A booking assistant should never invent inventory. A support helper should refuse account takeover requests. Evaluation starts with product promises, not model leaderboards."
      ]},
      { heading: "Build a living dataset", paragraphs: [
        "Collect examples from production issues, support tickets, adversarial prompts, and edge cases discovered in research. Keep personally identifiable information out of the suite or replace it with realistic synthetic substitutes. Version the dataset alongside prompts and model settings.",
        "Include cases that should fail gracefully. Evaluation that only covers happy paths will greenlight regressions in the moments that damage trust the most."
      ], points: ["Separate offline suites from online sampling", "Calibrate automated graders with periodic human review", "Block releases on critical property regressions", "Track evaluation coverage by user journey"]},
      { heading: "Automate the boring, review the subtle", paragraphs: [
        "Schema checks, forbidden phrase detection, citation presence, and deterministic fixtures can run on every change. Nuanced qualities such as helpfulness or empathy still need sampled human judgment. Use automation to widen coverage and humans to keep the graders honest.",
        "When a model or prompt changes, compare against the previous baseline rather than an absolute fantasy of perfection. The question is whether the product got safer and more useful for the users you serve."
      ]},
      { heading: "Close the loop after launch", paragraphs: [
        "Production will invent cases your suite never imagined. Feed high-severity failures back into evaluation quickly. Pair this with telemetry: thumbs-down rates, edit distance on user corrections, escalation to humans, and task completion.",
        "Evaluation is not a ceremony before launch. It is the continuous immune system of an AI product."
      ]}
    ]
  },
  {
    slug: "designing-agentic-workflows-that-stay-controllable",
    title: "Designing Agentic Workflows That Stay Controllable",
    excerpt: "Autonomy is useful only when every tool call has a clear boundary and an audit trail.",
    description: "Learn how to design controllable AI agents with scoped tools, human approval gates, deterministic state machines, and safe recovery paths.",
    publishedAt: "2025-12-09",
    readingMinutes: 9,
    keywords: ["AI agents", "agentic workflows", "tool calling", "AI safety", "software architecture"],
    sections: [
      { heading: "Autonomy needs a state machine", paragraphs: [
        "Free-form agents that invent their own plans are exciting in demos and fragile in production. Prefer an explicit workflow: gather context, propose actions, request approval when needed, execute tools, verify outcomes, and stop. The model can fill flexible steps inside that machine; it should not own the machine.",
        "State machines make timeouts, retries, and audits possible. They also make product promises enforceable: an agent cannot refund money, delete data, or message customers unless the workflow reaches an approved state."
      ]},
      { heading: "Tools are capabilities with contracts", paragraphs: [
        "Each tool should expose a narrow capability with typed inputs, authorization checks, idempotency, and clear side effects. Broad tools that can do anything through a shell or raw database invite irreversible mistakes.",
        "Return structured results the workflow can validate. Ambiguous tool failures should not become invented successes. If a payment API times out, the agent must query status rather than assume completion."
      ], points: ["Require confirmation for irreversible side effects", "Bound loops with step and cost limits", "Persist plans and tool transcripts", "Prefer least-privilege credentials per tool"]},
      { heading: "Keep humans in the right places", paragraphs: [
        "Human approval is not a confession of failure. It is a product control for actions with legal, financial, or reputational impact. Design review interfaces that show the proposed action, evidence, and alternatives in seconds, not a raw chain-of-thought dump.",
        "Over time, promote repeatedly approved patterns into automated paths with monitoring. Controllability improves when the organization learns which decisions are safe to accelerate."
      ]},
      { heading: "Recover like software, not like magic", paragraphs: [
        "Agents will stall, loop, or partially complete work. Provide compensating actions, dead-letter states, and operator tools to resume or unwind. Users should never be told the system finished when the underlying operations are unresolved.",
        "The winning agentic systems feel calm. They use models for judgment inside carefully owned software boundaries."
      ]}
    ]
  },
  {
    slug: "typed-boundaries-in-modern-typescript-systems",
    title: "Typed Boundaries in Modern TypeScript Systems",
    excerpt: "TypeScript pays off when types protect the seams between modules, APIs, and runtime data.",
    description: "Use TypeScript effectively at system boundaries with schema validation, shared contracts, branded types, and practical patterns that reduce production bugs.",
    publishedAt: "2025-09-30",
    readingMinutes: 7,
    keywords: ["TypeScript architecture", "API contracts", "runtime validation", "full-stack TypeScript", "software engineering"],
    sections: [
      { heading: "Types are strongest at the edges", paragraphs: [
        "Internal function annotations help, but the expensive bugs usually cross process, network, storage, or team boundaries. Invest typing effort where untrusted or independently deployed data enters the system: HTTP payloads, queue messages, environment configuration, and third-party webhooks.",
        "At those edges, compile-time types are not enough. Pair them with runtime schemas so invalid data fails in a controlled way before it corrupts domain logic."
      ]},
      { heading: "Share contracts, not implementations", paragraphs: [
        "Generate or publish shared types for clients and servers from a single source of truth. Keep transport details and UI concerns out of the domain model. A change to a field's nullability should be deliberate and visible to every consumer.",
        "Branded types for identifiers prevent accidental mixing of user IDs, organization IDs, and external references. Small nominal distinctions catch an entire class of integration mistakes."
      ], points: ["Validate on read at trust boundaries", "Make illegal states unrepresentable where cheap", "Prefer explicit result types over thrown ambiguity", "Keep DTOs separate from persistence models"]},
      { heading: "Avoid type theater", paragraphs: [
        "Overfitting types to every temporary UI state creates churn without safety. Escape hatches such as any, broad casts, and overly clever conditional types should be rare and justified. Readable types that teammates can change are more valuable than ingenious ones nobody understands.",
        "Measure success by fewer production parsing errors and safer refactors, not by the density of generics."
      ]},
      { heading: "Let types document decisions", paragraphs: [
        "A good type system captures product rules: which fields exist after onboarding, which statuses allow refunds, which payloads are versioned. That documentation stays honest because the compiler enforces it.",
        "TypeScript is most effective when it encodes the architecture you already believe in, then prevents the team from accidentally abandoning it."
      ]}
    ]
  },
  {
    slug: "caching-strategies-for-product-facing-apis",
    title: "Caching Strategies for Product-Facing APIs",
    excerpt: "A cache is a correctness decision first and a performance optimization second.",
    description: "Design API caching with explicit freshness rules, invalidation strategies, stampede protection, and product-aware tradeoffs for web and mobile clients.",
    publishedAt: "2025-06-18",
    readingMinutes: 8,
    keywords: ["API caching", "HTTP cache", "Redis caching", "backend performance", "system design"],
    sections: [
      { heading: "Name the freshness contract", paragraphs: [
        "Before choosing Redis, CDN rules, or HTTP headers, decide how stale a response may be and what happens when it is wrong. Profile pages, inventory counts, prices, and permissions have different tolerance for delay. A single global TTL is usually a product mistake.",
        "Write the contract in engineering language clients can rely on: absolute expiry, event-driven invalidation, or explicit revalidation. Ambiguous freshness creates duplicate caching layers that fight each other."
      ]},
      { heading: "Cache where the audience is", paragraphs: [
        "Public content benefits from edge caches. Per-user dashboards often need application-level caches keyed by identity and tenant. Expensive computed aggregations may need materialization rather than a short-lived key-value entry.",
        "Avoid caching unauthorized responses or responses that embed secrets. Cache keys must include every dimension that changes meaning: locale, plan, feature flag, and representation version."
      ], points: ["Protect against thundering herds on expiry", "Prefer idempotent recomputation paths", "Observe hit rate alongside wrong-data incidents", "Invalidate on meaningful domain events"]},
      { heading: "Invalidation is the hard part", paragraphs: [
        "Time-based expiry is simple and often wrong for collaborative data. Event-based invalidation is precise and easy to miss a producer. Many systems combine a modest TTL with explicit purge on write paths for critical entities.",
        "Design delete and update flows to emit the signals caches need. If writers do not know about readers' caches, stale data becomes a recurring incident theme."
      ]},
      { heading: "Measure user-visible outcomes", paragraphs: [
        "A high hit rate with rising support tickets about outdated information is not a win. Track latency percentiles, origin load, and correctness complaints together. Caching strategy should make the product feel fast and trustworthy at the same time.",
        "The best cache is invisible: users get timely answers, origins stay calm, and engineers can explain exactly when data is allowed to lag."
      ]}
    ]
  },
  {
    slug: "feature-flags-as-engineering-infrastructure",
    title: "Feature Flags as Engineering Infrastructure",
    excerpt: "Flags are not temporary hacks. They are how modern teams separate deploy from release.",
    description: "Use feature flags as reliable engineering infrastructure with ownership, cleanup, targeting rules, experiment hygiene, and operational safety.",
    publishedAt: "2025-02-14",
    readingMinutes: 7,
    keywords: ["feature flags", "progressive delivery", "release engineering", "A/B testing", "continuous deployment"],
    sections: [
      { heading: "Deploy should be boring", paragraphs: [
        "Shipping code to production and exposing a feature to users are different decisions. Feature flags let teams merge continuously while controlling blast radius. Combined with observability, they turn releases into reversible experiments rather than binary events.",
        "This only works when flags are treated as infrastructure: named clearly, owned by a team, defaulted safely, and removable on a schedule."
      ]},
      { heading: "Design for operability", paragraphs: [
        "Every flag needs a default for when the management service is unavailable. Critical paths should fail closed or open intentionally, never randomly. Targeting rules must be testable and auditable, especially for enterprise customers and regulated workflows.",
        "Avoid wrapping unrelated behavior in one flag. Coarse flags create tangled cleanup. Fine flags create combinatorial testing cost. Group by user-visible capability."
      ], points: ["Record who changed a flag and why", "Set removal dates when flags are created", "Keep flag evaluation out of tight loops when possible", "Test both enabled and disabled paths"]},
      { heading: "Experiments need hygiene", paragraphs: [
        "When flags power experiments, define the hypothesis, primary metric, and end criteria before launch. Do not leave half-finished experiments running indefinitely; they pollute analytics and increase cognitive load.",
        "Segment carefully. Overlapping experiments on the same journey can invalidate conclusions and create confusing user experiences."
      ]},
      { heading: "Cleanup is part of delivery", paragraphs: [
        "A flag that survives long after a feature is fully released becomes dead configuration and hidden branching. Schedule cleanup work with the same seriousness as the launch. Delete unused paths so the codebase reflects reality.",
        "Mature teams win with flags not because they have more toggles, but because they can release safely and leave the system simpler afterward."
      ]}
    ]
  },
  {
    slug: "using-ai-coding-tools-without-losing-architecture",
    title: "Using AI Coding Tools Without Losing Architecture",
    excerpt: "Speed is free only when the system boundaries remain intentional.",
    description: "Adopt AI coding assistants effectively while preserving architecture, code review quality, security review, and long-term maintainability.",
    publishedAt: "2024-11-05",
    readingMinutes: 8,
    keywords: ["AI coding tools", "developer productivity", "software architecture", "code review", "AI pair programming"],
    sections: [
      { heading: "Start from the constraint, not the autocomplete", paragraphs: [
        "AI coding tools excel when the task is bounded: implement this interface, add this test, migrate this call site. They struggle when asked to invent an architecture the repository does not yet express. Provide the invariant first—ownership boundaries, naming conventions, error model, and forbidden shortcuts.",
        "The engineer remains responsible for framing. A vague prompt yields plausible code that quietly duplicates existing modules or bypasses shared utilities."
      ]},
      { heading: "Review generated changes as architecture", paragraphs: [
        "Look beyond syntax. Does the change respect module boundaries? Does it introduce a new persistence path? Does it handle authorization and failure? Large generated diffs invite skim reading; insist on small commits that a human can truly understand.",
        "Ask the tool for alternatives when a decision is expensive to reverse. Comparing two approaches is often more valuable than accepting the first draft."
      ], points: ["Require tests for behavior you cannot visually verify", "Search for existing helpers before adding new ones", "Keep secrets and production data out of prompts", "Prefer repository docs over generic framework folklore"]},
      { heading: "Protect the feedback loop", paragraphs: [
        "Typechecks, lint rules, contract tests, and preview environments are what make high-speed generation safe. If the suite is weak, AI simply helps you produce unverified complexity faster.",
        "Invest a portion of the time saved into better fixtures, clearer module README files, and examples of preferred patterns. Those artifacts improve both human and AI contributors."
      ]},
      { heading: "Keep taste in the loop", paragraphs: [
        "Architecture is accumulated taste under constraints. AI can propose implementations; it cannot own the product's future. Use the tools to accelerate verified work, not to outsource judgment about what the system should become.",
        "Teams that thrive with AI coding tools are disciplined about boundaries. The code moves faster because the rails are clear."
      ]}
    ]
  },
  {
    slug: "event-driven-design-for-product-backends",
    title: "Event-Driven Design for Product Backends",
    excerpt: "Events help products scale workflows—if you treat them as contracts, not firehoses.",
    description: "Apply event-driven architecture to product backends with clear domain events, consumer isolation, idempotency, ordering tradeoffs, and operational visibility.",
    publishedAt: "2024-07-24",
    readingMinutes: 8,
    keywords: ["event-driven architecture", "domain events", "message queues", "backend architecture", "distributed systems"],
    sections: [
      { heading: "Emit facts about the business", paragraphs: [
        "Useful events describe something meaningful that happened: order placed, recording processed, membership upgraded. They are not a dump of database rows or a remote procedure call in disguise. Name events in the past tense and include enough context for consumers to act without chatty callbacks.",
        "Version the payload. Consumers evolve on different schedules, and a breaking field rename can cascade into silent failures across teams."
      ]},
      { heading: "Isolate consumers on purpose", paragraphs: [
        "Each consumer should own a specific outcome: send email, update search index, provision entitlements, or notify analytics. Sharing one giant worker for unrelated side effects recreates a monolith with worse failure modes.",
        "Backpressure, retries, and dead-letter queues belong per consumer. A poison message in notifications should not block search indexing."
      ], points: ["Make handlers idempotent by default", "Prefer at-least-once delivery with deduplication keys", "Document ordering guarantees honestly", "Trace production flows across publish and consume"]},
      { heading: "Accept the consistency tradeoff", paragraphs: [
        "Event-driven systems often embrace eventual consistency. Product copy and UI must acknowledge that some states catch up asynchronously. Showing a processing state is better than pretending every side effect is instantaneous.",
        "Where strong consistency is required—balances, inventory reservations, unique constraints—keep that logic in a transactional boundary and emit events after commit."
      ]},
      { heading: "Operate the choreography", paragraphs: [
        "Without correlation IDs, lag metrics, and replay tools, event systems become mysterious. Build the ability to reprocess a window of events safely after a bug fix. Measure consumer lag as a user-facing reliability signal.",
        "Event-driven design pays off when teams can extend product behavior by adding consumers without destabilizing the core transaction path."
      ]}
    ]
  },
  {
    slug: "testing-strategies-for-ai-powered-features",
    title: "Testing Strategies for AI-Powered Features",
    excerpt: "Deterministic tests still matter. Pair them with evaluation for the parts that are probabilistic.",
    description: "Create a practical testing strategy for AI features covering schema contracts, golden evaluations, integration stubs, and release gates for nondeterministic systems.",
    publishedAt: "2024-04-16",
    readingMinutes: 7,
    keywords: ["AI feature testing", "software testing", "LLM testing", "quality engineering", "continuous integration"],
    sections: [
      { heading: "Split deterministic from probabilistic", paragraphs: [
        "Much of an AI feature is still ordinary software: authentication, input validation, retrieval queries, rate limits, persistence, and UI rendering. Those layers deserve classic unit and integration tests with fixed fixtures. Do not weaken them because a model sits in the middle.",
        "The generative step needs a different approach. Exact string matching on free-form answers creates flaky suites. Test the contract around the model and evaluate the model outputs against product properties."
      ]},
      { heading: "Stub wisely in continuous integration", paragraphs: [
        "Calling live models on every pull request is slow, expensive, and nondeterministic. Use recorded fixtures or deterministic stubs for pull request pipelines, and run broader evaluation suites on a schedule or when prompts, models, or retrieval logic change.",
        "When stubbing, preserve realistic latency and failure modes. Tests that only see perfect model responses will not protect timeout handling or malformed output paths."
      ], points: ["Assert output schema before rendering", "Golden-file critical grounded answers", "Simulate empty retrieval and tool failures", "Gate merges on contract tests, not on model creativity"]},
      { heading: "Add journey-level confidence", paragraphs: [
        "End-to-end tests should verify that a user can complete the AI-assisted journey: enter a request, see a validated response, recover from a refusal, and escalate when needed. Keep these journeys few and stable.",
        "Pair automated journeys with periodic human review of sampled production outputs. Quality engineering for AI is a blend of software discipline and product taste."
      ]},
      { heading: "Make failure actionable", paragraphs: [
        "A failing AI test should tell you whether the schema broke, retrieval missed, policy refused incorrectly, or evaluation scores dropped. Vague red builds train teams to ignore them.",
        "The purpose of testing AI features is not to pretend models are deterministic. It is to keep probabilistic components inside a system that remains operable, reviewable, and safe to change."
      ]}
    ]
  },
  {
    slug: "engineering-ai-products-that-earn-trust",
    title: "Engineering AI Products That Earn Trust",
    excerpt: "A practical architecture for useful, observable, and dependable AI features in production.",
    description: "Learn how to design production AI systems with explicit contracts, evaluation, observability, fallbacks, and human-centered product boundaries.",
    publishedAt: "2026-07-14",
    readingMinutes: 8,
    keywords: ["AI product engineering", "production AI", "LLM architecture", "AI observability", "software engineering"],
    sections: [
      { heading: "The model is only one component", paragraphs: [
        "A convincing prototype can be built around a single model call. A dependable product cannot. Production AI sits inside a larger system of input validation, context assembly, policy enforcement, retrieval, generation, post-processing, persistence, analytics, and recovery. The model may be the most visible component, but product quality is determined by the contracts between all of them.",
        "This changes the engineering question. Instead of asking which prompt produces the most impressive answer, ask what the system promises, how that promise is measured, and what happens when confidence is low. A strong architecture makes uncertainty explicit. It treats generated output as untrusted data, validates its shape, and keeps deterministic business rules outside the model boundary."
      ]},
      { heading: "Design the contract before the prompt", paragraphs: [
        "Start with the user outcome and work backward. Define the inputs the feature truly needs, the output schema the interface can safely render, latency and cost budgets, prohibited behavior, and the fallback experience. A typed response with bounded fields is easier to test than a block of prose whose meaning changes between runs.",
        "The contract should also separate facts from interpretation. Retrieved account data, product records, or medical references need provenance. Generated suggestions need clear language that reflects their confidence and purpose. When these categories are mixed, users cannot tell which part of the response is grounded and engineers cannot diagnose why an answer failed."
      ], points: ["Validate model output at runtime", "Version prompts, schemas, and evaluation datasets together", "Keep authorization and pricing rules deterministic", "Provide a useful non-AI fallback"]},
      { heading: "Evaluation is part of delivery", paragraphs: [
        "AI quality cannot be reduced to a unit test, but that does not make it untestable. Build a representative evaluation set from real product scenarios: common requests, ambiguous inputs, adversarial phrasing, multilingual cases, missing context, and high-risk edge conditions. Score the properties users care about, such as correctness, relevance, tone, groundedness, and refusal behavior.",
        "Run this suite whenever the model, system prompt, retrieval strategy, or output schema changes. Automated graders can accelerate feedback, while targeted human review calibrates the graders and catches subtle product regressions. The goal is not a magical universal score. It is a repeatable decision process that prevents a locally impressive change from silently degrading the wider experience."
      ]},
      { heading: "Operate the feature as a system", paragraphs: [
        "Observability should follow a request across the full pipeline without storing unnecessary sensitive content. Track model and prompt versions, retrieval results, schema validation, latency, token usage, fallback rates, user corrections, and downstream actions. Product analytics tells you whether the feature is valuable; operational telemetry tells you whether it is healthy.",
        "Rate limits, circuit breakers, timeouts, caching, and graceful degradation are not secondary concerns. They are what keep a model outage or cost spike from becoming a product outage. Mature AI engineering is less about hiding uncertainty and more about containing it."
      ]},
      { heading: "Trust compounds", paragraphs: [
        "Users learn whether a product deserves trust through repeated small interactions. Clear boundaries, predictable behavior, fast recovery, and honest explanations matter more than occasional brilliance. The best AI experience often feels restrained: it uses intelligence where ambiguity benefits from it and conventional software where precision is required.",
        "That restraint is also a competitive advantage. Models will change quickly; a well-designed evaluation and operations layer lets the product adopt better models without rebuilding its identity each time."
      ]}
    ]
  },
  {
    slug: "staff-level-engineering-without-the-title",
    title: "Staff-Level Engineering Is a Way of Working",
    excerpt: "How senior engineers create leverage through decisions, systems, and clarity—not heroics.",
    description: "A field guide to staff-level software engineering: technical strategy, cross-team influence, decision quality, system ownership, and sustainable delivery.",
    publishedAt: "2026-03-03",
    readingMinutes: 7,
    keywords: ["staff engineer", "technical leadership", "software architecture", "engineering strategy", "senior software engineer"],
    sections: [
      { heading: "Scope is the real difference", paragraphs: [
        "Staff-level work is often described as writing less code and attending more meetings. That description misses the point. The meaningful change is scope: the engineer becomes accountable for the quality of decisions that span systems, teams, and time. Code remains important, but it is one instrument among architecture, communication, sequencing, mentoring, and risk management.",
        "The strongest engineers do not manufacture complexity to demonstrate depth. They find the smallest coherent model that multiple teams can share. They make constraints visible, identify the decisions that are expensive to reverse, and keep reversible choices lightweight."
      ]},
      { heading: "Create leverage, not dependency", paragraphs: [
        "Heroic delivery can look valuable while making an organization fragile. If every difficult migration, incident, or architectural decision requires the same person, knowledge has not been converted into leverage. Staff-level impact leaves behind clearer interfaces, useful documentation, better defaults, and people who can make the next decision independently.",
        "This means investing in paved roads: shared observability, deployment patterns, API conventions, testing strategies, and examples that make the correct path easier than the accidental one. A platform or abstraction is worthwhile only when it removes repeated cognitive load without hiding essential behavior."
      ], points: ["Write decisions for future readers", "Measure adoption, not the existence of a platform", "Teach the reasoning behind standards", "Delete abstractions that no longer earn their cost"]},
      { heading: "Technical strategy is sequencing", paragraphs: [
        "A strategy is not a diagram of the final architecture. It is an ordered set of moves that delivers value while reducing risk. Good strategy names the current constraints, the target capabilities, and the intermediate states the organization can safely operate. It acknowledges staffing, product commitments, and migration cost rather than treating them as implementation details.",
        "The best plan usually contains checkpoints where evidence can change the direction. This makes strategy robust without making it vague. Teams know what they are optimizing for, what must remain stable, and which assumptions should be tested first."
      ]},
      { heading: "Influence starts with understanding", paragraphs: [
        "Cross-team leadership is not winning architectural arguments. It begins by understanding the incentives and constraints of the people who must adopt the decision. Product teams may value speed, operations may value diagnosability, security may value control, and finance may care about unit economics. A durable proposal incorporates these realities instead of dismissing them.",
        "Strong technical writing is a force multiplier here. A concise document with context, options, tradeoffs, a recommendation, and an explicit decision date creates a shared surface for disagreement. It lets quiet experts contribute and prevents the loudest meeting from becoming the architecture."
      ]},
      { heading: "Leave the system calmer", paragraphs: [
        "Staff-level engineering is visible in the condition left behind: fewer unknown failure modes, clearer ownership, shorter feedback loops, and teams that can move with more confidence. The work is not always dramatic. Often it is the steady removal of ambiguity before ambiguity turns into incidents and rewrites.",
        "Titles vary between organizations. The practice is consistent: improve the quality and reach of engineering decisions while helping others do their best work."
      ]}
    ]
  },
  {
    slug: "cross-platform-mobile-architecture-that-scales",
    title: "Cross-Platform Mobile Architecture That Scales",
    excerpt: "A pragmatic approach to shared product logic without sacrificing native quality.",
    description: "Explore scalable React Native and Expo architecture for cross-platform apps, including state boundaries, native capabilities, offline behavior, testing, and releases.",
    publishedAt: "2025-11-19",
    readingMinutes: 9,
    keywords: ["cross-platform mobile development", "React Native architecture", "Expo app", "mobile software engineering", "iOS Android development"],
    sections: [
      { heading: "Share intent, not every implementation detail", paragraphs: [
        "Cross-platform development succeeds when teams share product behavior and domain rules while preserving room for platform-specific interaction. A single codebase is not valuable because every line is identical. It is valuable because important concepts—identity, permissions, pricing, synchronization, analytics, and business workflows—have one source of truth.",
        "Forcing visual or native behavior through an abstraction that fits neither platform creates a different kind of duplication: workarounds. Keep shared boundaries deliberate. Navigation intent, data contracts, validation, and state transitions usually belong in common code. Widgets, background execution, purchases, notifications, and accessibility details may require native-aware adapters."
      ]},
      { heading: "Split state by responsibility", paragraphs: [
        "Mobile applications become difficult to reason about when all state is placed in one global store. Server state has caching, freshness, retry, and invalidation semantics. Local product state has interaction and persistence semantics. Ephemeral view state belongs close to the component. Treating these as separate categories reduces accidental coupling.",
        "A query layer should own remote resources and mutations. A focused client store can coordinate durable local workflows such as onboarding or a draft recording. Secure credentials belong in platform-protected storage. This model makes offline behavior explicit because the team can decide which resources may be stale, queued, or unavailable."
      ], points: ["Model network status as product state", "Persist only data that has a clear restoration purpose", "Make optimistic updates reversible", "Keep authentication refresh outside screens"]},
      { heading: "Native capability is a boundary", paragraphs: [
        "Microphones, cameras, push notifications, subscriptions, health data, and background tasks are not ordinary libraries. They cross permission, privacy, lifecycle, and store-policy boundaries. Wrap each capability in a small domain-facing interface and keep platform details behind it. This makes simulators and tests useful without pretending the native layer does not exist.",
        "Permission requests should be triggered by understandable user intent, not at application startup. Failure paths deserve first-class design: denied permissions, interrupted recordings, restored purchases, expired notification tokens, and operating-system restrictions are normal states, not exceptional bugs."
      ]},
      { heading: "Performance is an architectural property", paragraphs: [
        "A smooth interface begins with data flow. Avoid rerendering large trees for unrelated state, virtualize long collections, resize media before transfer, and move heavy audio or image work away from the JavaScript thread. Measure startup, navigation, and interaction latency on representative devices rather than relying on a development simulator.",
        "Perceived performance matters too. Preserve navigation continuity, show stable skeletons, and make optimistic actions feel immediate when they can be safely reconciled. The fastest request is often the one the interface does not need to wait for."
      ]},
      { heading: "Release engineering is part of the app", paragraphs: [
        "A scalable mobile architecture includes signed builds, environment separation, staged rollout, crash reporting, over-the-air update policy, and store metadata. Every release should be traceable to code, configuration, backend compatibility, and feature flags. Mobile clients remain in the wild long after a backend deploy, so APIs must tolerate version overlap.",
        "The outcome is not maximum code sharing. It is a product that behaves coherently on iOS and Android, can use native capabilities responsibly, and remains operable as the team and feature set grow."
      ]}
    ]
  },
  {
    slug: "designing-resilient-full-stack-systems",
    title: "Designing Resilient Full-Stack Systems",
    excerpt: "Reliability begins at product boundaries long before infrastructure fails.",
    description: "A practical guide to resilient full-stack architecture using explicit contracts, idempotency, observability, graceful degradation, and recovery-first design.",
    publishedAt: "2025-08-07",
    readingMinutes: 8,
    keywords: ["full-stack architecture", "resilient systems", "software reliability", "API design", "system design"],
    sections: [
      { heading: "Reliability is end-to-end", paragraphs: ["A healthy database does not guarantee a reliable product. Users experience a chain that includes device state, network conditions, edge infrastructure, application code, queues, third-party services, and human operations. Resilience comes from understanding that chain and choosing where failures should be absorbed.", "Begin with critical user journeys. Identify what must succeed synchronously, what can be delayed, what can be retried, and what must never occur twice. This produces a more useful architecture than applying generic availability patterns to every endpoint."]},
      { heading: "Contracts prevent cascading ambiguity", paragraphs: ["Typed APIs help, but a resilient contract also defines timeouts, error categories, idempotency, pagination, version compatibility, and authorization behavior. Clients should be able to distinguish a validation problem from a temporary dependency failure and a permission denial.", "Idempotency keys are essential for payments, orders, messages, and any mutation a client may retry. A request timeout does not tell the client whether the server completed the operation. Without a stable key and retrievable operation state, retries become data corruption."], points: ["Use stable machine-readable error codes", "Make mutation outcomes queryable", "Bound every network call with a timeout", "Design backward compatibility for mobile clients"]},
      { heading: "Degrade by capability", paragraphs: ["Graceful degradation should preserve the useful core of a product. If recommendations fail, search may still work. If real-time updates disconnect, a timestamped snapshot may remain readable. If media processing is delayed, the upload can be accepted and completed asynchronously.", "Feature boundaries make this possible. When one dependency is embedded across every route and render path, its outage becomes universal. Isolate optional capabilities behind clear interfaces, cache safe results, and ensure the interface communicates freshness rather than silently presenting stale data as current."]},
      { heading: "Observe decisions, not only machines", paragraphs: ["Infrastructure metrics reveal resource pressure. Product-level telemetry reveals broken outcomes. Trace a user operation with correlation identifiers across the client, API, queue, and worker. Record meaningful transitions such as order accepted, payment authorized, asset processed, and notification delivered.", "Logs should be structured, privacy-aware, and connected to an operational question. Dashboards need service-level indicators tied to journeys, while alerts should identify conditions that require action. An alert that fires frequently and changes no decision is noise that weakens the entire response system."]},
      { heading: "Practice recovery", paragraphs: ["Backups are intentions until restoration is tested. Queues are durable until poison messages block progress. Runbooks are useful until they assume access or knowledge responders do not have. Regular recovery exercises expose these gaps while the system is calm.", "Resilience is ultimately the ability to make failure unsurprising. Teams cannot remove every incident, but they can create bounded failures, visible state, safe retries, and practiced recovery paths that protect both users and engineers."]}
    ]
  },
  {
    slug: "practical-software-observability-for-product-teams",
    title: "Practical Observability for Product Teams",
    excerpt: "Build telemetry that shortens decisions instead of producing another wall of dashboards.",
    description: "Learn a product-centered observability strategy covering traces, logs, metrics, frontend telemetry, SLOs, privacy, and incident learning.",
    publishedAt: "2025-04-22",
    readingMinutes: 6,
    keywords: ["software observability", "OpenTelemetry", "frontend monitoring", "SLO", "incident response"],
    sections: [
      { heading: "Start with questions", paragraphs: ["Observability is the ability to explain unfamiliar system behavior using the evidence the system emits. Collecting every available metric does not guarantee that ability. Start with the questions people need to answer: Are users completing checkout? Which release increased startup time? Where is this request waiting? How many operations are being retried?", "These questions connect telemetry to decisions. They also prevent expensive instrumentation that nobody can interpret. A compact set of reliable signals is more valuable than a large dashboard whose definitions vary between teams."]},
      { heading: "Connect the browser to the backend", paragraphs: ["Product failures often begin on the client and disappear at the API boundary. Carry a correlation identifier from the browser or mobile application through the gateway, services, queues, and workers. Add release version, route, operation, and safe account context so a trace can be connected to the experience that produced it.", "Frontend telemetry should include real user performance, navigation errors, failed resources, and important interaction timings. Avoid indiscriminate session capture. Privacy-aware instrumentation collects the minimum context needed to diagnose behavior and establishes retention and access rules before sensitive data arrives."], points: ["Use consistent operation names", "Attach deploy versions to every signal", "Redact at collection time", "Sample routine traffic while retaining errors"]},
      { heading: "Define service around outcomes", paragraphs: ["A service-level indicator should represent something users can perceive: successful request rate, processing completion, freshness, or interaction latency. A service-level objective creates a shared reliability target and an error budget for making delivery decisions.", "Averages hide the experiences that need attention. Use percentiles for latency and segment critical signals by platform, region, release, and journey. Segmentation should remain bounded; uncontrolled labels create cost and make queries unreliable."]},
      { heading: "Alert on action", paragraphs: ["An alert should indicate a meaningful threat to an objective and have an expected response. Route low-urgency anomalies to review instead of waking someone. Include relevant dashboards, recent deploys, ownership, and a short diagnostic path in the notification.", "After an incident, improve the system that shaped the response. Add missing context, remove noisy alerts, automate a safe recovery step, or clarify ownership. The best post-incident work reduces both the chance of recurrence and the cognitive load of the next event."]},
      { heading: "Treat telemetry as a product", paragraphs: ["Instrumentation has users, interfaces, quality problems, and maintenance cost. Give important events owners and definitions. Test that critical traces survive releases. Review dashboards when architecture changes. Delete signals that no longer support a decision.", "Observability becomes valuable when it changes engineering behavior: experiments are safer, regressions are found earlier, incidents are shorter, and tradeoffs are made with evidence rather than intuition."]}
    ]
  },
  {
    slug: "ai-assisted-development-with-engineering-judgment",
    title: "AI-Assisted Development Still Requires Judgment",
    excerpt: "A disciplined workflow for using coding agents without outsourcing engineering responsibility.",
    description: "Use AI coding tools effectively with scoped tasks, repository context, verification, security review, and human ownership of architectural decisions.",
    publishedAt: "2024-12-11",
    readingMinutes: 7,
    keywords: ["AI coding assistant", "AI software development", "coding agents", "developer productivity", "software engineering judgment"],
    sections: [
      { heading: "Acceleration changes the bottleneck", paragraphs: ["AI can produce implementation options, tests, migrations, documentation, and investigations at remarkable speed. That speed moves the bottleneck from typing to judgment. Engineers must define the problem, select constraints, recognize plausible mistakes, and decide whether the result fits the system that will own it.", "A generated change can be syntactically correct and architecturally wrong. It may duplicate an existing abstraction, bypass authorization, ignore deployment constraints, or optimize a local function while weakening the product boundary. Repository understanding remains the difference between code generation and engineering."]},
      { heading: "Give the agent a bounded outcome", paragraphs: ["Strong tasks describe the user-visible outcome, relevant files or modules, invariants that must remain true, and how success will be verified. They avoid prescribing every line while preventing the agent from expanding into unrelated refactors.", "Before editing, inspect local conventions, framework documentation, and the current dependency versions. AI systems are trained on historical patterns; fast-moving frameworks frequently invalidate familiar APIs. Grounding the work in the actual repository is part of correctness, not ceremony."], points: ["State non-negotiable behavior", "Name the tests and environments that matter", "Preserve unrelated user changes", "Ask for alternatives when a decision is expensive to reverse"]},
      { heading: "Review the diff as a design", paragraphs: ["Review generated work at multiple levels. Does the user flow make sense? Are boundaries and data ownership clear? Are failure states handled? Is the code readable in the repository's language? Then inspect security, accessibility, performance, and operational behavior.", "Large generated diffs reduce the quality of review. Prefer small coherent increments with verification between them. When a change is mechanical, automation can be broad; when it contains architectural judgment, keep the surface compact enough that a human can genuinely understand it."]},
      { heading: "Verification is not optional", paragraphs: ["Run static analysis, type checks, tests, and production builds. For interface work, inspect real browser behavior at relevant breakpoints and interaction states. For migrations, test both forward execution and recovery. For APIs, verify authorization and malformed inputs, not only the happy path.", "AI can help design this verification, but it cannot make responsibility disappear. If the test suite is weak, the generated confidence is weak too. Add the smallest high-value test that protects the behavior being changed."]},
      { heading: "Keep ownership human", paragraphs: ["Coding agents are powerful collaborators when the engineer remains accountable for intent and consequences. Record important decisions, disclose generated dependencies, and avoid sending secrets or sensitive production data into tools without an approved boundary.", "The durable advantage is not producing more code. It is shortening the path from a well-framed problem to a verified outcome while maintaining system coherence."
      ]}
    ]
  },
  {
    slug: "api-design-for-evolving-products",
    title: "API Design for Products That Keep Evolving",
    excerpt: "Build interfaces that support change without turning every release into a coordinated migration.",
    description: "Design evolvable APIs with resource models, compatibility, idempotency, pagination, authorization, and consumer-focused contracts.",
    publishedAt: "2024-09-18",
    readingMinutes: 8,
    keywords: ["API design", "REST API best practices", "API versioning", "backend architecture", "software contracts"],
    sections: [
      { heading: "Model the domain, not the screen", paragraphs: ["Interfaces change faster than the concepts behind them. An API built around a specific screen tends to expose presentation state and force duplicate endpoints as new clients appear. Start with stable domain resources, their lifecycle, and the operations the business recognizes.", "This does not require theoretical purity. A product-facing API can aggregate data for a journey, but the aggregation should have a clear purpose and ownership. Avoid leaking database tables directly; storage structure is an implementation detail that will eventually need to change."]},
      { heading: "Compatibility is a feature", paragraphs: ["Consumers deploy on different schedules, especially mobile applications and external integrations. Additive changes are usually safer: new optional fields, new resources, and new enum values with tolerant readers. Removing or redefining existing behavior requires a migration plan, telemetry, and a published end date.", "Versioning is useful when semantics genuinely diverge, but version numbers do not replace compatibility discipline. A versioned API can still surprise consumers through changed ordering, error behavior, limits, or authorization. Maintain a machine-readable schema and test representative consumers against it."], points: ["Treat unknown enum values safely", "Document nullability and defaults", "Use contract tests for critical consumers", "Measure deprecated-field usage before removal"]},
      { heading: "Mutations need identity", paragraphs: ["Retries are unavoidable across unreliable networks. For important mutations, accept an idempotency key scoped to the caller and operation. Store the result so a repeated request returns the original outcome rather than performing the action again.", "Long-running work should return an operation resource with explicit states. Clients can poll or subscribe without holding a fragile request open. This also improves support: the system can explain whether work is queued, active, completed, or failed and why."]},
      { heading: "Authorization belongs in the contract", paragraphs: ["Authentication establishes identity; authorization decides whether that identity may perform an operation on a resource. Enforce this on the server at the narrowest meaningful boundary. Hiding a button in the client is interface behavior, not access control.", "Multi-tenant systems need tenant context that cannot be freely supplied and trusted by the client. Derive scope from verified membership, validate ownership on every resource access, and log administrative actions with enough context for audit and investigation."]},
      { heading: "Optimize for consumer understanding", paragraphs: ["Consistent naming, predictable pagination, useful errors, examples, and a clear change log reduce integration time more than clever protocol choices. An API is successful when consumers can use it correctly without learning its internal history.", "Design reviews should include client engineers and operational scenarios. The interface will live longer than the first implementation, so spend precision on the parts that are hardest to change: identifiers, semantics, authorization, and lifecycle."
      ]}
    ]
  },
  {
    slug: "zero-downtime-database-migrations",
    title: "Zero-Downtime Database Migrations in Practice",
    excerpt: "Use expand-and-contract delivery to change schemas safely under real traffic.",
    description: "A practical guide to zero-downtime database migrations with expand-and-contract changes, backfills, dual reads, observability, and rollback planning.",
    publishedAt: "2024-06-05",
    readingMinutes: 6,
    keywords: ["database migration", "zero downtime deployment", "PostgreSQL migration", "expand and contract", "backend engineering"],
    sections: [
      { heading: "Deployments overlap", paragraphs: ["A schema migration rarely runs in isolation. Old and new application instances may serve traffic simultaneously, workers may process delayed jobs, and mobile clients may remain active for months. A safe migration assumes this overlap and keeps each intermediate state compatible.", "The expand-and-contract pattern separates a risky replacement into reversible stages. First expand the schema or interface, then migrate behavior and data, observe the result, and only later remove the old path. The extra steps buy control at the moment it matters."]},
      { heading: "Expand without changing meaning", paragraphs: ["Add new nullable columns, tables, indexes, or endpoints in a way existing code can ignore. Avoid defaults or constraints that rewrite a large table under lock without understanding database behavior. Build large indexes concurrently when the engine supports it and monitor replication lag and lock duration.", "Deploy code that can write both representations or populate the new model for newly created data. Dual writes introduce consistency risk, so keep the transition bounded, instrument divergence, and prefer a single transaction when both records share a database."], points: ["Measure table size and lock behavior first", "Make migration commands restartable", "Throttle backfills under production load", "Record progress with stable checkpoints"]},
      { heading: "Backfill as an operation", paragraphs: ["A production backfill is a workload, not a one-off script. Process deterministic batches, persist checkpoints, limit concurrency, and expose progress and failures. The job should be safe to stop and resume without duplicating effects.", "Validate the new representation continuously. Compare counts, checksums, invariants, and sampled records rather than waiting until the end. If the migration transforms meaning, encode the expected mapping in executable checks reviewed by domain owners."]},
      { heading: "Move reads deliberately", paragraphs: ["Once new writes and historical data are ready, shift reads behind a feature flag or controlled rollout. Shadow reads can compare old and new results without changing the user response. Segment errors and latency by path so the decision to advance is based on evidence.", "Rollback during this stage should usually mean switching reads back, not reversing the schema. Destructive rollback scripts can make a recoverable deployment much worse. Preserve the expanded state until confidence is high."]},
      { heading: "Contract only after evidence", paragraphs: ["Stop writing the old representation, wait for overlapping application versions and queued work to clear, then remove unused code. Confirm through telemetry that the old field or table is no longer read before dropping it in a separate deployment.", "Zero downtime is not the absence of risk. It is a delivery shape that makes risk observable, limits blast radius, and preserves a safe decision at every stage."
      ]}
    ]
  },
  {
    slug: "building-accessible-interfaces-by-default",
    title: "Building Accessible Interfaces by Default",
    excerpt: "Accessibility becomes sustainable when semantics and interaction are architectural defaults.",
    description: "Build accessible web and mobile interfaces with semantic structure, keyboard behavior, focus management, contrast, reduced motion, and automated plus manual testing.",
    publishedAt: "2024-03-27",
    readingMinutes: 7,
    keywords: ["web accessibility", "WCAG", "accessible React", "keyboard navigation", "inclusive design"],
    sections: [
      { heading: "Accessibility is product quality", paragraphs: ["Accessibility is often treated as a final compliance pass. By then, foundational choices—component semantics, focus order, color systems, navigation structure, and motion—are expensive to repair. Treat accessibility as a constraint during design and component development, where the correct default can be reused everywhere.", "The goal is not a separate simplified experience. It is an interface whose information and actions remain available across different input methods, vision, hearing, cognition, language, and device conditions. These improvements frequently benefit every user, especially under stress or imperfect environments."]},
      { heading: "Start with native semantics", paragraphs: ["Use headings for structure, buttons for actions, links for navigation, labels for controls, and lists for related items. Native elements bring keyboard behavior, accessibility roles, and platform expectations that custom containers must otherwise recreate.", "ARIA can clarify relationships and dynamic state, but it cannot repair an interaction whose underlying behavior is wrong. Build a predictable tab order, maintain visible focus, and ensure every pointer interaction has a keyboard equivalent. On mobile, provide meaningful accessibility labels and group content according to the way it should be announced."], points: ["Preserve a logical heading hierarchy", "Give icon-only controls an accessible name", "Do not encode meaning through color alone", "Keep touch targets comfortably sized"]},
      { heading: "Manage focus during change", paragraphs: ["Single-page navigation, dialogs, drawers, and animated transitions change the interface without a full document load. Move focus intentionally so keyboard and screen-reader users understand where the new context begins. Restore focus to the triggering control when a temporary surface closes.", "Avoid trapping focus except inside a true modal interaction. Announce important asynchronous outcomes with restrained live regions, and do not flood assistive technology with routine visual updates. The announcement should answer what changed and whether the user needs to act."]},
      { heading: "Respect visual and motion preferences", paragraphs: ["Text and interactive controls need sufficient contrast in every theme and state, including placeholders, disabled controls, borders, and hover indicators. Support zoom and text resizing without clipping or hiding actions. Responsive design should adapt to content, not assume fixed labels.", "Motion can communicate continuity, but it can also cause discomfort. Honor reduced-motion preferences and provide a simpler transition that preserves orientation. Never make critical information available only during an animation or hover state."]},
      { heading: "Test with humans and tools", paragraphs: ["Automated checks catch missing names, invalid relationships, and many contrast problems, making them valuable in continuous integration. They cannot judge whether focus movement is understandable, screen-reader phrasing is useful, or a workflow is cognitively exhausting.", "Regularly navigate key journeys using only a keyboard, a screen reader, zoom, and high-contrast settings. Include disabled users in research and testing. Accessibility matures when findings improve shared components and design rules, not only the page where a problem was discovered."
      ]}
    ]
  },
  {
    slug: "from-prototype-to-production-software",
    title: "From Prototype to Production Software",
    excerpt: "The engineering work that turns a promising demo into a product people can depend on.",
    description: "Move software from prototype to production by defining product boundaries, operational requirements, security, delivery workflows, and measurable readiness.",
    publishedAt: "2024-01-16",
    readingMinutes: 8,
    keywords: ["production software", "software prototype", "MVP engineering", "software architecture", "product development"],
    sections: [
      { heading: "A prototype answers a different question", paragraphs: ["A prototype asks whether an idea can work and whether the experience is worth pursuing. Production software asks whether the idea can keep working for real users, real data, changing requirements, and an on-call engineer at an inconvenient hour. Confusing these goals either slows discovery or ships hidden risk.", "Preserve the learning from the prototype, but review every shortcut explicitly. Identify hard-coded assumptions, shared credentials, manual steps, missing ownership, unbounded costs, and data that cannot be recovered. The prototype is evidence, not automatically the first production architecture."]},
      { heading: "Define the operating boundary", paragraphs: ["Write down who uses the product, what data it handles, which actions are irreversible, and which external services it depends on. Define acceptable latency, availability, support expectations, retention, and recovery. These constraints guide architecture more effectively than choosing technologies by popularity.", "Keep the first production system as simple as the constraints allow. A modular monolith with a clear data model is often easier to operate than prematurely distributed services. Distribution should solve a measured scaling, ownership, isolation, or deployment problem."], points: ["Separate environments and credentials", "Automate repeatable deployments", "Create backups and test restoration", "Set budgets for latency, errors, and third-party cost"]},
      { heading: "Make unsafe states difficult", paragraphs: ["Validate data at every trust boundary, enforce authorization on the server, protect secrets, and minimize collected personal information. Use least-privilege service identities and rotate credentials without rebuilding the application. Security is strongest when the normal development path is also the safe path.", "Administrative tools deserve the same care as customer interfaces. Sensitive actions need explicit permissions, audit records, confirmation where appropriate, and bounded batch operations. Many damaging incidents happen through legitimate capabilities used with the wrong scope."]},
      { heading: "Build a delivery system", paragraphs: ["A production repository needs fast feedback: formatting, static analysis, type checking, tests around critical behavior, and a reproducible build. Deployments should be small, observable, and reversible. Feature flags can separate release from exposure when they have ownership and removal dates.", "Instrument important user outcomes before launch. Error reporting without release identifiers or request context produces reports that are difficult to act on. Combine technical health with product signals so the team can distinguish a successful deployment from a successful experience."]},
      { heading: "Readiness is continuous", paragraphs: ["There is no single moment when software becomes permanently production-ready. Traffic grows, integrations change, teams reorganize, and assumptions expire. Use incidents, support requests, performance data, and product behavior to refine the system.", "The shift from demo to durable product is mostly the addition of explicit responsibility: for data, failure, cost, security, releases, and users. That responsibility is what allows a small piece of software to become dependable."
      ]}
    ]
  }
];

export const sortedBlogPosts = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getBlogTotalPages() {
  return Math.max(1, Math.ceil(sortedBlogPosts.length / BLOGS_PER_PAGE));
}

export function getBlogPage(page: number) {
  const start = (page - 1) * BLOGS_PER_PAGE;
  return sortedBlogPosts.slice(start, start + BLOGS_PER_PAGE);
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
