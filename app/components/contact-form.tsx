"use client";

import { ChevronDown } from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
  CONTACT_PROJECT_TYPES,
  contactFormLimits,
  contactSubmissionUserMessage,
  validateContactFieldsClient,
} from "../lib/contact-form";
import type { Locale } from "../lib/i18n";
import type { ContactPageCopy } from "../lib/i18n/contact-page-copy";

declare global {
  interface Window {
    turnstile?: { reset: (widgetId?: string) => void };
    onBerktugContactTurnstile?: (token: string) => void;
    onBerktugContactTurnstileExpired?: () => void;
  }
}

type ContactFormProps = {
  locale: Locale;
  copy: ContactPageCopy;
};

export function ContactForm({ locale, copy }: ContactFormProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const formRef = useRef<HTMLFormElement>(null);
  const startedRef = useRef(false);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);

  useEffect(() => {
    window.onBerktugContactTurnstile = (token: string) => {
      setTurnstileToken(token);
      setTurnstileReady(Boolean(token));
    };
    window.onBerktugContactTurnstileExpired = () => {
      setTurnstileToken("");
      setTurnstileReady(false);
    };
    return () => {
      delete window.onBerktugContactTurnstile;
      delete window.onBerktugContactTurnstileExpired;
    };
  }, []);

  function resetTurnstile() {
    setTurnstileToken("");
    setTurnstileReady(false);
    window.turnstile?.reset();
  }

  function markFormStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    setStartedAt(Date.now());
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const clientError = validateContactFieldsClient({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      details: String(formData.get("details") ?? ""),
      turnstileToken,
      startedAt,
    });
    if (clientError) {
      setState("error");
      setMessage(contactSubmissionUserMessage(clientError, locale));
      return;
    }

    formData.set("cf-turnstile-response", turnstileToken);
    formData.set("startedAt", String(startedAt));
    formData.set("locale", locale);

    setState("sending");
    setMessage(copy.form.sendingStatus);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? copy.form.sendFailed);
      formRef.current?.reset();
      setStartedAt(Date.now());
      startedRef.current = false;
      resetTurnstile();
      setState("success");
      setMessage(data.message ?? copy.form.successDefault);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : copy.form.sendFailed);
      resetTurnstile();
    }
  }

  if (!siteKey) {
    return (
      <p role="alert" className="text-sm text-red-600 dark:text-red-400">
        {copy.form.unavailable}
      </p>
    );
  }

  const fieldShell =
    "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800";

  const fieldClass = `mt-2 ${fieldShell}`;
  const selectClass = `${fieldShell} appearance-none pr-10`;

  const canSubmit = turnstileReady && state !== "sending" && state !== "success";

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <form ref={formRef} onSubmit={submit} className="relative space-y-5" noValidate>
        <input type="hidden" name="startedAt" value={startedAt} readOnly />
        <input type="hidden" name="cf-turnstile-response" value={turnstileToken} readOnly />
        <input type="hidden" name="locale" value={locale} readOnly />
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
        />

        <label className="block text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
          {copy.form.projectTypeLegend}{" "}
          <span className="font-normal text-zinc-400 dark:text-zinc-500">({copy.form.projectTypeOptional})</span>
          <div className="relative mt-2">
            <select
              name="projectType"
              defaultValue=""
              aria-label={copy.form.projectTypeAria}
              className={selectClass}
              onFocus={markFormStarted}
            >
              <option value="">{copy.form.projectTypePlaceholder}</option>
              {CONTACT_PROJECT_TYPES.map((value) => (
                <option key={value} value={value}>
                  {copy.form.projectTypes[value]}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
            />
          </div>
        </label>

        <label className="block text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
          {copy.form.nameLabel}
          <input
            required
            name="name"
            minLength={2}
            maxLength={100}
            autoComplete="name"
            className={fieldClass}
            onFocus={markFormStarted}
          />
        </label>

        <label className="block text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
          {copy.form.emailLabel}
          <input
            required
            name="email"
            type="email"
            maxLength={254}
            autoComplete="email"
            inputMode="email"
            className={fieldClass}
            onFocus={markFormStarted}
          />
        </label>

        <label className="block text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
          {copy.form.detailsLabel}{" "}
          <span className="font-normal text-zinc-400 dark:text-zinc-500">({copy.form.detailsMinLabel})</span>
          <textarea
            required
            name="details"
            minLength={contactFormLimits.minDetailsLength}
            maxLength={5000}
            rows={8}
            className={`${fieldClass} resize-y`}
            onFocus={markFormStarted}
          />
        </label>

        <div
          className="cf-turnstile"
          data-sitekey={siteKey}
          data-action="contact"
          data-theme="auto"
          data-size="flexible"
          data-callback="onBerktugContactTurnstile"
          data-expired-callback="onBerktugContactTurnstileExpired"
          data-error-callback="onBerktugContactTurnstileExpired"
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {state === "sending"
            ? copy.form.submitting
            : state === "success"
              ? copy.form.submitted
              : copy.form.submit}
        </button>
        {!turnstileReady && state !== "success" ? (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{copy.form.turnstileWait}</p>
        ) : null}
        <p
          role={state === "error" ? "alert" : "status"}
          aria-live="polite"
          className={`min-h-5 text-sm ${state === "error" ? "text-red-600 dark:text-red-400" : "text-zinc-500 dark:text-zinc-400"}`}
        >
          {message}
        </p>
      </form>
    </>
  );
}
