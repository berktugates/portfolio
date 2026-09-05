"use client";

import { MessageCircle, X } from "lucide-react";
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
const STORAGE_KEY = "site-assistant-messages";
const PANEL_CLOSE_DURATION_MS = 280;

function loadStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed as ChatMessage[];
  } catch {
    /* ignore */
  }
  return [];
}

function saveMessages(messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    if (messages.length === 0) {
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  } catch {
    /* ignore */
  }
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

export function SiteAssistantSidebar({ locale }: { locale: Locale }) {
  const copy = getSiteAssistantCopy(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isSubmittingRef = useRef(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load stored messages on mount
  useEffect(() => {
    const stored = loadStoredMessages();
    if (stored.length > 0) {
      setMessages(stored);
    }
  }, []);

  // Save messages to storage when they change
  useEffect(() => {
    messagesRef.current = messages;
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    syncDockInputHeight(inputRef.current);
  }, [prompt]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const openDock = useCallback(() => {
    setIsClosing(false);
    setIsOpen(true);
    trackAssistantEvent("open", { locale });
  }, [locale]);

  const closeDock = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, PANEL_CLOSE_DURATION_MS);
  }, []);

  const canSend = Boolean(prompt.trim()) && !thinking;
  const showSuggestions = inputFocused && !thinking && messages.length === 0;
  const chatOpen = messages.length > 0 || thinking;

  const submitText = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed || thinking || isSubmittingRef.current) return;

      isSubmittingRef.current = true;
      setThinking(true);
      setPrompt("");

      const historyBefore = messagesRef.current;
      const userMsg: ChatMessage = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMsg]);

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
        isSubmittingRef.current = false;
      }
    },
    [copy.error, locale, thinking],
  );

  const pickSuggestion = useCallback(
    (text: string) => {
      trackAssistantEvent("suggestion", { locale, question: text.slice(0, 80) });
      void submitText(text);
    },
    [locale, submitText],
  );

  const handleSubmit = useCallback(() => {
    void submitText(prompt);
  }, [prompt, submitText]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSubmit();
    }
  };

  const handleClearChat = useCallback(() => {
    setMessages([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setInputFocused(true);
  };

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setInputFocused(false), 180);
  };

  return (
    <>
      {/* Floating button - only show when dock is closed */}
      {!isOpen && (
        <button
          type="button"
          onClick={openDock}
          className="site-assistant-fab fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg shadow-zinc-900/25 transition-transform hover:scale-105 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-zinc-950/40"
          aria-label={copy.openChat}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Dock - same as home page but positioned right on large screens */}
      {isOpen && (
        <>
          {/* Gradient background */}
          <div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-14 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-zinc-950 dark:via-zinc-950/70"
            aria-hidden
          />

          {/* Dock container - centered on mobile, right-aligned on desktop */}
          <div className={`site-assistant-blog-dock fixed bottom-0 z-50 flex flex-col px-3 pb-2.5 sm:px-5 sm:pb-3 inset-x-0 mx-auto max-w-[720px] sm:inset-x-auto sm:right-4 sm:left-auto sm:mx-0 sm:max-w-[420px] ${isClosing ? "site-assistant-blog-dock--closing" : ""}`}>
            {/* Chat panel */}
            {chatOpen && (
              <div className="site-assistant-chat-panel pointer-events-auto relative mb-2 flex w-full max-h-[min(52vh,420px)] flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-lg shadow-black/5 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40">
                <button
                  type="button"
                  className="absolute right-2 top-2 z-10 rounded-lg p-1 text-zinc-400 dark:text-zinc-500"
                  aria-label={copy.closeChat}
                  onClick={handleClearChat}
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
                  {thinking && <AssistantTypingIndicator label={copy.thinking} />}
                </div>
              </div>
            )}

            {/* Input dock */}
            <div className="hw-dock-stack pointer-events-auto" style={{ width: "100%", maxWidth: "100%" }}>
              {showSuggestions && (
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
              )}

              <div className="hw-dock">
                <div className="hw-dock-bar" style={{ position: "relative" }}>
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
                      className="hw-dock-send"
                      aria-label={copy.send}
                      disabled={!canSend}
                      onClick={handleSubmit}
                    >
                      {thinking ? <span className="hw-dock-send-spinner" aria-hidden /> : <SendIcon />}
                    </button>
                  </div>
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={closeDock}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-white shadow-md transition-transform hover:scale-110 dark:bg-zinc-600"
                    aria-label={copy.closeChat}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
