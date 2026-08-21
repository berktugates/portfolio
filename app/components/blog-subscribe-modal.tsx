"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

const SESSION_KEY = "blog-subscribe-prompted";
const USERNAME = process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME ?? "berktug";
const SUBSCRIBE_ACTION = `https://buttondown.com/api/emails/embed-subscribe/${USERNAME}`;

type Status = "idle" | "submitting" | "success";

export function BlogSubscribeModal() {
  const titleId = useId();
  const descId = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      const timer = window.setTimeout(() => setOpen(true), 700);
      return () => window.clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, []);

  const dismiss = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!email.trim() || status === "submitting") return;

    setStatus("submitting");
    try {
      const body = new FormData();
      body.set("email", email.trim());
      body.set("tag", "blog");

      const response = await fetch(SUBSCRIBE_ACTION, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        setStatus("success");
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // ignore
        }
        window.setTimeout(() => setOpen(false), 1600);
        return;
      }

      form.submit();
    } catch {
      form.submit();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button
        type="button"
        aria-label="Dismiss subscribe dialog"
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px]"
        onClick={dismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-xl ring-1 ring-zinc-200/80 dark:bg-zinc-950 dark:ring-zinc-800"
      >
        {status === "success" ? (
          <div>
            <h2 id={titleId} className="text-lg font-medium text-zinc-950 dark:text-zinc-50">
              You&apos;re in
            </h2>
            <p id={descId} className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Check your inbox to confirm. New posts land there when they ship.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 id={titleId} className="text-lg font-medium text-zinc-950 dark:text-zinc-50">
                Stay in the loop
              </h2>
              <p id={descId} className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Get an email when a new post goes live on berktugberke.com. Optional—skip anytime.
              </p>
            </div>

            <form action={SUBSCRIBE_ACTION} method="post" className="mt-5 space-y-3" onSubmit={onSubmit}>
              <input type="hidden" name="tag" value="blog" />
              <label className="block">
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-600"
                />
              </label>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center rounded-xl px-3 py-2.5 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-3 py-2.5 text-sm text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  {status === "submitting" ? "Subscribing…" : "Notify me"}
                </button>
              </div>
            </form>
            <p className="mt-3 text-xs leading-5 text-zinc-400 dark:text-zinc-500">
              Only new blog posts. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
