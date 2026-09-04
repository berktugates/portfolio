"use client";

import type { ReactNode } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Locale } from "../lib/i18n";
import { getSiteAssistantCopy } from "../lib/site-assistant/copy";
import { sendAssistantMessage, trackAssistantEvent } from "../lib/site-assistant/chat-client";
import type { ChatMessage } from "../lib/site-assistant/knowledge";
import { getAssistantApiUrl } from "../lib/site-assistant/knowledge";

function renderAssistantMarkdown(text: string) {
  const nodes: ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = linkRe.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(<span key={key++}>{text.slice(last, m.index)}</span>);
    }
    nodes.push(
      <Link
        key={key++}
        href={m[2]}
        className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-100 dark:decoration-zinc-600"
      >
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    nodes.push(<span key={key++}>{text.slice(last)}</span>);
  }
  return nodes.length ? nodes : text;
}

type SiteAssistantPanelProps = {
  locale: Locale;
  variant?: "embedded" | "floating";
  onClose?: () => void;
};

export function SiteAssistantPanel({ locale, variant = "embedded", onClose }: SiteAssistantPanelProps) {
  const copy = getSiteAssistantCopy(locale);
  const titleId = useId();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasLiveApi = Boolean(getAssistantApiUrl());

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const submit = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || thinking) return;
      setInput("");
      const userMsg: ChatMessage = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setThinking(true);
      trackAssistantEvent("send", { locale });
      try {
        const history = messages;
        const reply = await sendAssistantMessage(locale, history, trimmed);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: copy.error },
        ]);
      } finally {
        setThinking(false);
      }
    },
    [copy.error, locale, messages, thinking],
  );

  const shellClass =
    variant === "floating"
      ? "flex max-h-[min(70vh,520px)] flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl shadow-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40"
      : "flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900";

  return (
    <section
      aria-labelledby={titleId}
      className={variant === "embedded" ? "mt-16 scroll-mt-24" : undefined}
    >
      {variant === "embedded" ? (
        <div className="mb-4">
          <h2 id={titleId} className="text-lg font-medium text-zinc-950 dark:text-zinc-50">
            {copy.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {copy.subtitle}
          </p>
        </div>
      ) : null}

      <div className={shellClass}>
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-2.5 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Sparkles className="size-3.5 text-zinc-700 dark:text-zinc-200" aria-hidden />
            </span>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{copy.title}</span>
              <span className="font-mono text-[10px] text-zinc-400">{copy.modelLabel}</span>
            </div>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label={copy.closeChat}
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>

        <div
          ref={listRef}
          className="flex min-h-[200px] flex-1 flex-col gap-3 overflow-y-auto px-3 py-3 sm:min-h-[240px]"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{copy.emptyHint}</p>
          ) : null}
          {messages.map((msg, i) => (
            <div
              key={`${msg.role}-${i}`}
              className={
                msg.role === "user"
                  ? "ml-8 rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                  : "mr-4 rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-300"
              }
            >
              {msg.role === "assistant" ? renderAssistantMarkdown(msg.content) : msg.content}
            </div>
          ))}
          {thinking ? (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="flex gap-1" aria-hidden>
                <span className="size-1.5 animate-pulse rounded-full bg-zinc-400" />
                <span className="size-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:120ms]" />
                <span className="size-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:240ms]" />
              </span>
              {copy.thinking}
            </div>
          ) : null}
        </div>

        <div className="border-t border-zinc-100 px-3 py-2 dark:border-zinc-800">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {copy.suggestions.map((q) => (
              <button
                key={q}
                type="button"
                disabled={thinking}
                onClick={() => {
                  trackAssistantEvent("suggestion", { locale, question: q.slice(0, 80) });
                  void submit(q);
                }}
                className="max-w-full rounded-full border border-zinc-200/80 bg-zinc-50 px-2.5 py-1 text-left text-[11px] leading-snug text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-white disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:border-zinc-600"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void submit(input);
            }}
          >
            <label className="sr-only" htmlFor={`${titleId}-input`}>
              {copy.placeholder}
            </label>
            <textarea
              id={`${titleId}-input`}
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void submit(input);
                }
              }}
              placeholder={copy.placeholder}
              className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              disabled={thinking}
            />
            <button
              type="submit"
              disabled={thinking || !input.trim()}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
              aria-label={copy.send}
            >
              <Send className="size-4" aria-hidden />
            </button>
          </form>
          {!hasLiveApi ? (
            <p className="mt-2 text-[10px] leading-snug text-zinc-400">{copy.offlineNote}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

type SiteAssistantLauncherProps = {
  locale: Locale;
};

export function SiteAssistantLauncher({ locale }: SiteAssistantLauncherProps) {
  const copy = getSiteAssistantCopy(locale);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-end p-4 sm:p-5">
        {open ? (
          <div className="pointer-events-auto w-full max-w-md">
            <SiteAssistantPanel locale={locale} variant="floating" onClose={() => setOpen(false)} />
          </div>
        ) : null}
      </div>
      {!open ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            trackAssistantEvent("open", { locale });
          }}
          className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-zinc-900/20 transition-transform hover:scale-[1.02] dark:bg-zinc-100 dark:text-zinc-900 sm:bottom-5 sm:right-5"
        >
          <MessageCircle className="size-4" aria-hidden />
          <span className="max-w-[40vw] truncate sm:max-w-none">{copy.openChat}</span>
        </button>
      ) : null}
    </>
  );
}
