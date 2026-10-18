#!/usr/bin/env python3
"""Extra EN paragraphs per queue slug — matches legacy long-form depth (~6–9 min at 80 wpm)."""

# section_index -> additional paragraphs to append after the base two
EN_EXTRA_PARAS = {
    "reducing-flaky-e2e-tests-in-expo-apps": {
        0: [
            "Treat the suite as product infrastructure: when flakes exceed a threshold, freeze feature work on new specs until ownership and root-cause tickets exist.",
        ],
        1: [
            "Record video and network HAR on failure once, not on every retry—artifacts should explain the flake, not recreate it probabilistically.",
        ],
        2: [
            "Review quarantine weekly with release managers; items past SLA should block the train or force deletion of the spec.",
        ],
        3: [
            "Publish flake rate beside build time so product feels the cost of ignoring mobile CI health.",
        ],
    },
    "logging-llm-interactions-without-hoarding-pii": {
        0: [
            "Document which fields are never logged—government IDs, payment instruments, raw audio—and enforce via schema tests on your logging pipeline.",
        ],
        1: [
            "Pair retention with deletion jobs that are tested in staging; expiry without verification is a compliance placebo.",
        ],
        2: [
            "Give security and legal dashboards on export volume, not only on authentication failures.",
        ],
        3: [
            "When in doubt, log identifiers and outcomes, not verbatim user content.",
        ],
    },
    "performance-budgets-for-marketing-and-app-routes": {
        0: [
            "Marketing hero assets and authenticated dashboards rarely share the same bottleneck—split budgets so one team cannot spend another's latency.",
        ],
        1: [
            "Attach budget regressions to the same rollback conversation as error-rate spikes.",
        ],
        2: [
            "Synthetic checks from three regions catch CDN and DNS issues that lab Wi-Fi hides.",
        ],
        3: [
            "Perf is a feature: publish weekly trends to product leads, not only to frontend guild channels.",
        ],
    },
    "seo-for-editorial-briefings-not-wire-copy": {
        0: [
            "Editorial briefings earn links when they explain tradeoffs readers can act on—not when they recap headlines.",
        ],
        1: [
            "Structured data should reflect the page type you actually ship; fake FAQ blocks hurt more than they help.",
        ],
        2: [
            "Measure engagement on briefing pages separately from app conversion funnels.",
        ],
        3: [
            "Refresh evergreen sections on a schedule; stale authority pages decay quietly in Search Console.",
        ],
    },
    "llm-eval-gates-in-ci-not-slide-decks": {
        0: [
            "Eval datasets are code: review them in PRs with the same rigor as migration scripts.",
        ],
        1: [
            "Gate on regressions against a frozen golden set, not on absolute scores that drift with model upgrades.",
        ],
        2: [
            "Human spot checks calibrate automated graders weekly, not only after incidents.",
        ],
        3: [
            "Failed eval gates should block deploy; waivers need named owners and expiry dates.",
        ],
    },
    "on-call-runbooks-for-ai-product-incidents": {
        0: [
            "Runbooks must distinguish model outages, retrieval failures, policy refusals, and client bugs—each has different customer messaging.",
        ],
        1: [
            "Keep kill switches for model routes tested monthly; discovering they fail during an outage is expensive.",
        ],
        2: [
            "Post-incident reviews should update eval cases, not only Confluence pages.",
        ],
        3: [
            "On-call load for AI features includes cost spikes—wire billing alerts into the same rotation.",
        ],
    },
    "idempotency-keys-for-agent-tool-side-effects": {
        0: [
            "Agents retry aggressively; without idempotency, a successful payment or ticket creation can duplicate silently.",
        ],
        1: [
            "Keys should survive process restarts—persist them with the tool invocation record, not only in memory.",
        ],
        2: [
            "Document which tools are safe to retry and which require human confirmation in the runbook.",
        ],
        3: [
            "Integration tests should simulate duplicate deliveries, not only happy paths.",
        ],
    },
    "synthetic-probes-for-llm-gateways": {
        0: [
            "Probes should hit the same auth, routing, and rate-limit path as production clients—not a bypass admin URL.",
        ],
        1: [
            "Alert on rising time-to-first-token before user complaints arrive on social channels.",
        ],
        2: [
            "Rotate probe prompts to detect subtle quality drift, not only hard 500s.",
        ],
        3: [
            "Store probe results separately from customer traffic to avoid feedback loops.",
        ],
    },
    "data-retention-policies-that-enable-product-analytics": {
        0: [
            "Analytics without retention policy becomes an accidental data lake of sensitive events.",
        ],
        1: [
            "Define lawful basis per event type before instrumenting new AI or payment flows.",
        ],
        2: [
            "Deletion jobs need metrics: rows removed, failures, and backlog age.",
        ],
        3: [
            "Product analytics and security logging can share schemas, but not retention classes.",
        ],
    },
}

# (heading, [paragraphs]) optional fifth section
EN_CLOSING = {
    "reducing-flaky-e2e-tests-in-expo-apps": (
        "Make reliability visible",
        [
            "Pick one flake metric, one quarantine SLA, and one real-device tier to improve this sprint—then ask release managers whether confidence actually moved.",
            "Staff ownership turns E2E from a lottery into an instrument the team trusts when shipping Expo apps weekly.",
        ],
    ),
}
