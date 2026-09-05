import assert from "node:assert/strict";
import { localAssistantReply } from "../app/lib/site-assistant/knowledge";
import {
  sanitizeAssistantReply,
  usesCuratedProjectReply,
  usesCuratedStartReply,
} from "../app/lib/site-assistant/moderation";

function assertNoFullName(text: string) {
  assert.ok(!/Berktu[gğ]\s*Berke\s*Ate/i.test(text), `full name leaked: ${text}`);
}

function assertFirstPersonTr(text: string) {
  assert.ok(
    /\b(yapıyorum|çalıştım|teslim|yer aldım|birlikte|yazın|yazarsanız)\b/i.test(text) ||
      text.includes("contact@"),
    `expected conversational TR first person: ${text}`,
  );
}

function assertNoProjectDump(text: string) {
  assert.ok(!/Celestial|Medula|StrumAI/i.test(text), `project name dump: ${text}`);
}

// Curated TR paths
const trProject = localAssistantReply("tr", "Hangi projelerde çalıştın?");
assertNoFullName(trProject);
assertNoProjectDump(trProject);
assert.ok(/birçok projede/i.test(trProject));

const trStart = localAssistantReply("tr", "Projeye nasıl başlarız?");
assertNoFullName(trStart);
assert.ok(/birlikte|yazmanız/i.test(trStart));

const trHire = localAssistantReply("tr", "Web veya mobil projeme nasıl başlarız?");
assertNoFullName(trHire);
assertNoProjectDump(trHire);
assertFirstPersonTr(trHire);

// Curated EN paths
const enStart = localAssistantReply("en", "How do I start a project?");
assertNoFullName(enStart);
assert.ok(/\bI\b|we'll|Email/i.test(enStart));

const enExp = localAssistantReply("en", "What's your experience with projects?");
assertNoFullName(enExp);
assertNoProjectDump(enExp);

// Triggers
assert.equal(usesCuratedProjectReply("Hangi projelerde çalıştın?"), true);
assert.equal(usesCuratedStartReply("İlk adım ne olmalı?"), true);
assert.equal(usesCuratedStartReply("Web veya mobil projeme nasıl başlarız?"), false);

// Sanitize bad LLM-style reply
const bad =
  "Evet, Berktuğ Berke Ateş, Türkiye'de birçok web ve mobil projeyi geliştirmiştir. Örnek olarak Celestial Insights, Medula Eczane ve StrumAI gibi projeleri geliştirmiştim. Bu projeler, Berktuğ Berke Ateş'in uzmanlığımız temelinde geliştirilmiştir.";
const cleaned = sanitizeAssistantReply(bad, "Hangi projelerde çalıştın?", "tr");
assertNoFullName(cleaned);
assertNoProjectDump(cleaned);
assert.ok(!/uzmanlığımız/i.test(cleaned));

console.log("site-assistant reply validation: OK");
