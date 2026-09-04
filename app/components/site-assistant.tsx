"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUp, Mic, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { PromptSuggestion } from "@/components/ui/prompt-suggestion";
import type { Locale } from "../lib/i18n";
import { getSiteAssistantCopy } from "../lib/site-assistant/copy";
import { sendAssistantMessage, trackAssistantEvent } from "../lib/site-assistant/chat-client";
import type { ChatMessage } from "../lib/site-assistant/knowledge";

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
        className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-100"
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

type SpeechRecognitionCtor = new () => {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(locale: Locale): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function speechLang(locale: Locale) {
  if (locale === "tr") return "tr-TR";
  if (locale === "de") return "de-DE";
  if (locale === "fr") return "fr-FR";
  if (locale === "it") return "it-IT";
  if (locale === "zh") return "zh-CN";
  if (locale === "ja") return "ja-JP";
  return "en-US";
}

export function SiteAssistantDock({ locale }: { locale: Locale }) {
  const copy = getSiteAssistantCopy(locale);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<InstanceType<SpeechRecognitionCtor> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    document.body.classList.add("has-site-assistant-dock");
    return () => document.body.classList.remove("has-site-assistant-dock");
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    if (messages.length > 0) setExpanded(true);
  }, [messages.length]);

  const showSuggestions = inputFocused && !thinking && messages.length === 0;

  const submitText = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed || thinking) return;
      setPrompt("");
      setInputFocused(false);
      const userMsg: ChatMessage = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setThinking(true);
      setExpanded(true);
      trackAssistantEvent("send", { locale });
      try {
        const reply = await sendAssistantMessage(locale, messagesRef.current, trimmed);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: copy.error }]);
      } finally {
        setThinking(false);
      }
    },
    [copy.error, locale, thinking],
  );

  const handleSubmit = useCallback(() => {
    void submitText(prompt);
  }, [prompt, submitText]);

  const pickSuggestion = (text: string) => {
    trackAssistantEvent("suggestion", { locale, question: text.slice(0, 80) });
    setPrompt(text);
    void submitText(text);
  };

  const toggleVoice = () => {
    const Ctor = getSpeechRecognition(locale);
    if (!Ctor) return;

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new Ctor();
    recognition.lang = speechLang(locale);
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const handleFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setInputFocused(true);
    trackAssistantEvent("open", { locale });
  };

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setInputFocused(false), 180);
  };

  const chatOpen = expanded && (messages.length > 0 || thinking);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-28 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80"
        aria-hidden
      />

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-3xl flex-col px-3 pb-3 md:px-5 md:pb-5">
        {chatOpen ? (
          <div className="pointer-events-auto mb-2 flex max-h-[min(52vh,420px)] flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-lg shadow-black/5 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                  <Sparkles className="size-3.5 text-zinc-700 dark:text-zinc-200" aria-hidden />
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[11px] font-medium text-zinc-900 dark:text-zinc-100">{copy.title}</span>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
                aria-label={copy.closeChat}
                onClick={() => {
                  setExpanded(false);
                  setMessages([]);
                }}
              >
                <X className="size-4" />
              </button>
            </div>
            <div ref={listRef} className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3" role="log" aria-live="polite">
              {messages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}`}
                  className={
                    msg.role === "user"
                      ? "ml-6 rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                      : "mr-2 rounded-xl border border-zinc-100 bg-zinc-50/90 px-3 py-2 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300"
                  }
                >
                  {msg.role === "assistant" ? renderAssistantMarkdown(msg.content) : msg.content}
                </div>
              ))}
              {thinking ? (
                <div className="flex items-center gap-2 px-1 text-[10px] text-zinc-500">
                  <span className="flex gap-1" aria-hidden>
                    <span className="size-1.5 animate-pulse rounded-full bg-zinc-400" />
                    <span className="size-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:120ms]" />
                    <span className="size-1.5 animate-pulse rounded-full bg-zinc-400 [animation-delay:240ms]" />
                  </span>
                  {copy.thinking}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {showSuggestions ? (
          <div
            className="pointer-events-auto mb-2 overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-1.5 shadow-md shadow-black/5 dark:border-zinc-700 dark:bg-zinc-900"
            onMouseDown={(e) => e.preventDefault()}
          >
            {copy.suggestions.map((q) => (
              <PromptSuggestion
                key={q}
                type="button"
                highlight={prompt}
                className="text-sm"
                onClick={() => pickSuggestion(q)}
              >
                {q}
              </PromptSuggestion>
            ))}
          </div>
        ) : null}

        <PromptInput
          isLoading={thinking}
          value={prompt}
          onValueChange={setPrompt}
          onSubmit={() => void handleSubmit()}
          className="pointer-events-auto border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs dark:bg-zinc-900"
        >
          <div className="flex flex-col">
            <PromptInputTextarea
              placeholder={copy.placeholder}
              className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
              <div className="flex min-h-9 items-center">
                {!inputFocused && messages.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground">{copy.emptyHint}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <PromptInputAction tooltip={copy.voiceInput ?? "Voice input"}>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={`size-9 rounded-full ${listening ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-800" : ""}`}
                    onClick={toggleVoice}
                    aria-pressed={listening}
                    aria-label={copy.voiceInput ?? "Voice input"}
                  >
                    <Mic size={18} />
                  </Button>
                </PromptInputAction>

                <Button
                  type="button"
                  size="icon"
                  disabled={!prompt.trim() || thinking}
                  onClick={() => void handleSubmit()}
                  className="size-9 rounded-full"
                  aria-label={copy.send}
                >
                  {!thinking ? (
                    <ArrowUp size={18} />
                  ) : (
                    <span className="size-3 animate-pulse rounded-sm bg-primary-foreground" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </>
  );
}
