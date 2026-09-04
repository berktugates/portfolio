"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Locale } from "../lib/i18n";
import { getSiteAssistantCopy } from "../lib/site-assistant/copy";
import { sendAssistantMessage, trackAssistantEvent } from "../lib/site-assistant/chat-client";
import type { ChatMessage } from "../lib/site-assistant/knowledge";
import { AssistantMessageContent } from "../lib/site-assistant/render-message";
import { AssistantTypingIndicator } from "./assistant-typing-indicator";

const MIN_TYPING_MS = 520;
const DOCK_INPUT_MIN_PX = 36;
const DOCK_INPUT_MAX_PX = 120;

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

function syncDockInputHeight(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = `${DOCK_INPUT_MIN_PX}px`;
  const next = Math.min(Math.max(el.scrollHeight, DOCK_INPUT_MIN_PX), DOCK_INPUT_MAX_PX);
  el.style.height = `${next}px`;
}

function MicIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3.5a3 3 0 0 1 3 3v4.5a3 3 0 0 1-6 0V6.5a3 3 0 0 1 3-3Z" />
      <path d="M5.5 11v.5a6.5 6.5 0 0 0 13 0V11" />
      <path d="M12 18v3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10L12 4L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    document.body.classList.add("has-site-assistant-dock");
    return () => document.body.classList.remove("has-site-assistant-dock");
  }, []);

  useEffect(() => {
    syncDockInputHeight(inputRef.current);
  }, [prompt]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    if (messages.length > 0) setExpanded(true);
  }, [messages.length]);

  const showSuggestions = inputFocused && !thinking && messages.length === 0;
  const canSend = Boolean(prompt.trim()) && !thinking;

  const submitInFlight = useRef(false);

  const submitText = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed || thinking || submitInFlight.current) return;
      submitInFlight.current = true;
      setPrompt("");
      setInputFocused(false);
      const historyBefore = messagesRef.current;
      const userMsg: ChatMessage = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setThinking(true);
      setExpanded(true);
      trackAssistantEvent("send", { locale });
      try {
        const [reply] = await Promise.all([
          sendAssistantMessage(locale, historyBefore, trimmed),
          new Promise<void>((resolve) => setTimeout(resolve, MIN_TYPING_MS)),
        ]);
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: copy.error }]);
      } finally {
        setThinking(false);
        submitInFlight.current = false;
      }
    },
    [copy.error, locale, thinking],
  );

  const pickSuggestion = (text: string) => {
    trackAssistantEvent("suggestion", { locale, question: text.slice(0, 80) });
    void submitText(text);
  };

  const handleSubmit = useCallback(() => {
    void submitText(prompt);
  }, [prompt, submitText]);

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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) void handleSubmit();
    }
  };

  const chatOpen = expanded && (messages.length > 0 || thinking);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-14 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-zinc-950 dark:via-zinc-950/70"
        aria-hidden
      />

      <div className="site-assistant-dock-host fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-[720px] flex-col px-3 pb-2.5 sm:px-5 sm:pb-3">
        {chatOpen ? (
          <div className="pointer-events-auto relative mb-2 flex max-h-[min(52vh,420px)] flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-lg shadow-black/5 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40">
            <button
              type="button"
              className="absolute right-2 top-2 z-10 rounded-lg p-1 text-zinc-400 dark:text-zinc-500"
              aria-label={copy.closeChat}
              onClick={() => {
                setExpanded(false);
                setMessages([]);
              }}
            >
              <X className="size-4" />
            </button>
            <div ref={listRef} className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3 pt-3" role="log" aria-live="polite">
              {messages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}`}
                  className={
                    msg.role === "user"
                      ? "ml-6 rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                      : "mr-2 rounded-xl border border-zinc-100 bg-zinc-50/90 px-3 py-2 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300"
                  }
                >
                  {msg.role === "assistant" ? <AssistantMessageContent text={msg.content} /> : msg.content}
                </div>
              ))}
              {thinking ? <AssistantTypingIndicator label={copy.thinking} /> : null}
            </div>
          </div>
        ) : null}

        <div className="hw-dock-stack pointer-events-auto">
          {showSuggestions ? (
            <div
              className="hw-dock-suggestions hw-dock-suggestions--animate"
              onMouseDown={(e) => e.preventDefault()}
            >
              {copy.suggestions.map((q, index) => (
                <button
                  key={q}
                  type="button"
                  className="hw-dock-suggestion"
                  style={{ animationDelay: `${index * 55}ms` }}
                  onClick={() => pickSuggestion(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          ) : null}

          <div className="hw-dock">
            <div
              className="hw-dock-bar"
              data-grown={
                prompt.includes("\n") || (inputRef.current?.scrollHeight ?? 0) > DOCK_INPUT_MIN_PX + 4
                  ? "true"
                  : "false"
              }
            >
              <textarea
                ref={inputRef}
                className="hw-dock-input"
                rows={1}
                value={prompt}
                placeholder={copy.placeholder}
                aria-label={copy.placeholder}
                disabled={thinking}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
              <div className="hw-dock-actions">
                <button
                  type="button"
                  className={`hw-dock-tool${listening ? " hw-dock-tool--active" : ""}`}
                  aria-label={copy.voiceInput ?? "Voice input"}
                  aria-pressed={listening}
                  onClick={toggleVoice}
                >
                  <MicIcon />
                </button>
                <button
                  type="button"
                  className="hw-dock-send"
                  aria-label={copy.send}
                  disabled={!canSend}
                  onClick={() => void handleSubmit()}
                >
                  {thinking ? <span className="hw-dock-send-spinner" aria-hidden /> : <SendIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
