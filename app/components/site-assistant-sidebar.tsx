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
const STORAGE_KEY = "site-assistant-messages";

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

  const listRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isSubmittingRef = useRef(false);

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

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const openSidebar = useCallback(() => {
    setIsClosing(false);
    setIsOpen(true);
    trackAssistantEvent("open", { locale });
  }, [locale]);

  const closeSidebar = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  }, []);

  const canSend = Boolean(prompt.trim()) && !thinking;

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

  const showSuggestions = messages.length === 0 && !thinking;

  return (
    <>
      {/* Floating button - right side */}
      {!isOpen && (
        <button
          type="button"
          onClick={openSidebar}
          className="site-assistant-fab fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg shadow-zinc-900/25 transition-transform hover:scale-105 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-zinc-950/40"
          aria-label={copy.openChat}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar panel - left side */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`site-assistant-sidebar-backdrop fixed inset-0 z-50 bg-zinc-950/30 backdrop-blur-[2px] ${isClosing ? "site-assistant-sidebar-backdrop--closing" : ""}`}
            onClick={closeSidebar}
            aria-hidden
          />

          {/* Panel */}
          <div
            className={`site-assistant-sidebar fixed bottom-0 left-0 top-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl dark:bg-zinc-900 ${isClosing ? "site-assistant-sidebar--closing" : ""}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{copy.title}</h2>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="rounded-lg px-2 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  >
                    {locale === "tr" ? "Temizle" : "Clear"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  aria-label={copy.closeChat}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4">
              {showSuggestions ? (
                <div className="space-y-2">
                  <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">{copy.subtitle}</p>
                  {copy.suggestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => pickSuggestion(q)}
                      className="block w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div
                      key={`${msg.role}-${i}`}
                      className={
                        msg.role === "user"
                          ? "ml-8 rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
                          : "mr-4 rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }
                    >
                      {msg.role === "assistant" ? <AssistantMessageContent text={msg.content} /> : msg.content}
                    </div>
                  ))}
                  {thinking && <AssistantTypingIndicator label={copy.thinking} />}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
              <div className="flex items-end gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 focus-within:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-zinc-600">
                <textarea
                  ref={inputRef}
                  className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
                  rows={1}
                  value={prompt}
                  placeholder={copy.placeholder}
                  disabled={thinking}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSend}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                  aria-label={copy.send}
                >
                  {thinking ? <span className="h-2 w-2 animate-pulse rounded-sm bg-current" /> : <SendIcon />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
