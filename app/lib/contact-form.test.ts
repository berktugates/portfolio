import assert from "node:assert/strict";
import test from "node:test";
import {
  contactSubmissionUserMessage,
  parseContactSubmission,
  validateContactFieldsClient,
} from "./contact-form";

function validForm(now: number) {
  const form = new FormData();
  form.set("projectType", "saas-mvp");
  form.set("name", "Ada Lovelace");
  form.set("email", "ADA@EXAMPLE.COM");
  form.set("details", "Üretime hazır bir SaaS ürünü için görüşmek istiyorum.");
  form.set("cf-turnstile-response", "verified-token");
  form.set("startedAt", String(now - 5_000));
  return form;
}

test("valid contact submission is normalized", () => {
  const now = Date.now();
  const result = parseContactSubmission(validForm(now), now);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.email, "ada@example.com");
});

test("honeypot submissions are rejected", () => {
  const now = Date.now();
  const form = validForm(now);
  form.set("website", "https://spam.example");
  assert.deepEqual(parseContactSubmission(form, now), { ok: false, error: "spam" });
});

test("instant submissions are rejected", () => {
  const now = Date.now();
  const form = validForm(now);
  form.set("startedAt", String(now));
  assert.deepEqual(parseContactSubmission(form, now), { ok: false, error: "timing" });
});

test("short details map to a clear user message", () => {
  assert.match(contactSubmissionUserMessage("details", "tr"), /20 karakter/);
  assert.match(contactSubmissionUserMessage("details", "en"), /20 characters/);
});

test("client validation requires turnstile token", () => {
  const now = Date.now();
  assert.equal(
    validateContactFieldsClient({
      name: "Ada Lovelace",
      email: "ada@example.com",
      details: "Üretime hazır bir SaaS ürünü için görüşmek istiyorum.",
      turnstileToken: "",
      startedAt: now - 5_000,
      now,
    }),
    "turnstile",
  );
});
