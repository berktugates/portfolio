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

export const blogPosts: readonly BlogPost[] = [
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

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
