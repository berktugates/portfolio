"use client";

import Script from "next/script";
import { useState } from "react";

export function CorrectionRequestForm() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Gönderiliyor…");
    const response = await fetch("/api/corrections", { method: "POST", body: new FormData(event.currentTarget) });
    const data = await response.json().catch(() => ({})) as { requestId?: string; error?: string };
    setMessage(response.ok ? `Talebiniz alındı. Kayıt: ${data.requestId}` : `Talep gönderilemedi: ${data.error ?? "bilinmeyen hata"}`);
    if (response.ok) event.currentTarget.reset();
  }
  if (!siteKey) return <p role="alert">Çevrim içi form henüz etkin değil. Talebinizi contact@berktugberke.com adresine iletebilirsiniz.</p>;
  return <>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
    <form onSubmit={submit} className="space-y-5">
      <label className="block">İlgili haber URL’si<input required name="articleUrl" type="url" pattern="https://haberler\.berktugberke\.com/.*" className="mt-1 w-full rounded-lg border bg-transparent p-3" /></label>
      <label className="block">Ad soyad<input required name="requesterName" minLength={2} maxLength={120} className="mt-1 w-full rounded-lg border bg-transparent p-3" /></label>
      <label className="block">E-posta<input required name="requesterEmail" type="email" maxLength={200} className="mt-1 w-full rounded-lg border bg-transparent p-3" /></label>
      <label className="block">Düzeltme veya cevap metni<textarea required name="statement" minLength={20} maxLength={5000} rows={8} className="mt-1 w-full rounded-lg border bg-transparent p-3" /></label>
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="auto" />
      <button className="rounded-lg bg-zinc-950 px-4 py-2 text-white dark:bg-white dark:text-zinc-950" type="submit">Talebi gönder</button>
      <p aria-live="polite">{message}</p>
    </form>
  </>;
}
