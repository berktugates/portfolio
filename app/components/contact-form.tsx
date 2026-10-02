"use client";

import Script from "next/script";
import { useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: { reset: () => void };
  }
}

export function ContactForm() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [startedAt, setStartedAt] = useState(() => Date.now());

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setMessage("Gönderiliyor…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: { Accept: "application/json" },
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Mesaj gönderilemedi.");
      formRef.current?.reset();
      setStartedAt(Date.now());
      setState("success");
      setMessage(data.message ?? "Mesajınız başarıyla gönderildi.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Mesaj gönderilemedi.");
      window.turnstile?.reset();
    }
  }

  if (!siteKey) {
    return <p role="alert">Form geçici olarak kullanılamıyor. contact@berktugberke.com adresine yazabilirsiniz.</p>;
  }

  const fieldClass =
    "mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800";

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <form ref={formRef} onSubmit={submit} className="space-y-5" noValidate>
        <input type="hidden" name="startedAt" value={startedAt} />
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="block text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
          PROJE TÜRÜ <span className="font-normal">(OPSİYONEL)</span>
          <select name="projectType" className={fieldClass} defaultValue="">
            <option value="">Seçin…</option>
            <option value="ai-automation">AI / Otomasyon</option>
            <option value="saas-mvp">SaaS / MVP</option>
            <option value="mobile">Mobil uygulama</option>
            <option value="custom">Özel yazılım</option>
            <option value="other">Diğer</option>
          </select>
        </label>

        <label className="block text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
          ADINIZ
          <input required name="name" minLength={2} maxLength={100} autoComplete="name" className={fieldClass} />
        </label>

        <label className="block text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
          E-POSTA
          <input required name="email" type="email" maxLength={254} autoComplete="email" inputMode="email" className={fieldClass} />
        </label>

        <label className="block text-xs font-medium tracking-wide text-zinc-600 dark:text-zinc-400">
          PROJE DETAYLARI
          <textarea required name="details" minLength={20} maxLength={5000} rows={8} className={`${fieldClass} resize-y`} />
        </label>

        <div
          className="cf-turnstile"
          data-sitekey={siteKey}
          data-action="contact"
          data-theme="auto"
          data-size="flexible"
        />

        <button
          type="submit"
          disabled={state === "sending" || state === "success"}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {state === "sending" ? "Gönderiliyor…" : state === "success" ? "Gönderildi" : "Mesajı gönder"}
        </button>
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
