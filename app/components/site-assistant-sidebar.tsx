"use client";

import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Locale } from "../lib/i18n";
import { getSiteAssistantCopy } from "../lib/site-assistant/copy";
import { sendAssistantMessage, trackAssistantEvent } from "../lib/site-assistant/chat-client";
import type { ChatMessage } from "../lib/site-assistant/knowledge";
import { AssistantMessageContent } from "../lib/site-assistant/render-message";
import { AssistantTypingIndicator } from "./assistant-typing-indicator";
import { AssistantDockCloseButton } from "./site-assistant/dock-close-button";
import { useAssistantOutsideDismiss } from "./site-assistant/use-assistant-outside-dismiss";

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
  const dockContainerRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openGuardUntilRef = useRef(0);

  useEffect(() => {
    if (!isOpen) return;
    openGuardUntilRef.current = Date.now() + 400;
  }, [isOpen]);

  const isOpenGuarded = useCallback(() => Date.now() < openGuardUntilRef.current, []);

  useEffect(() => {
    const stored = loadStoredMessages();
    if (stored.length > 0) {
      setMessages(stored);
    }
  }, []);

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

  const [backdropActive, setBackdropActive] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setBackdropActive(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setBackdropActive(true));
    return () => window.cancelAnimationFrame(id);
  }, [isOpen]);

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

  const closeDock = useCallback((options?: { userInitiated?: boolean }) => {
    const userInitiated = options?.userInitiated === true;
    if (!userInitiated && Date.now() < openGuardUntilRef.current) return;
    if (!userInitiated && (thinking || isSubmittingRef.current)) return;
    setIsClosing(true);
    setInputFocused(false);
    inputRef.current?.blur();
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, PANEL_CLOSE_DURATION_MS);
  }, [thinking]);

  const dismissGuard = useCallback(
    () => !thinking && !isSubmittingRef.current && !isOpenGuarded(),
    [thinking, isOpenGuarded],
  );

  useAssistantOutsideDismiss({
    enabled: isOpen && !isClosing && backdropActive,
    containerRef: dockContainerRef,
    onDismiss: closeDock,
    canDismiss: dismissGuard,
  });

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

  const handleFocus = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setInputFocused(true);
  };

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setInputFocused(false), 180);
  };

  const handleDockMouseDown = () => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          data-testid="site-assistant-fab"
          onClick={openDock}
          className="site-assistant-fab fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 transition-transform hover:scale-105 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
          aria-label={copy.openChat}
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      )}

      {isOpen && (
        <>
          {backdropActive && (
            <button
              type="button"
              data-testid="site-assistant-blog-backdrop"
              className="fixed inset-0 z-[55] cursor-default bg-transparent"
              aria-hidden
              tabIndex={-1}
              onPointerDown={(e) => {
                e.preventDefault();
                closeDock();
              }}
            />
          )}

          <div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-20 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80"
            aria-hidden
          />

          <div
            className={`site-assistant-blog-dock site-assistant-blog-dock-shell fixed bottom-0 left-0 right-0 z-[60] flex flex-col items-center px-4 pb-4 sm:items-end sm:px-6 sm:pb-5 ${isClosing ? "site-assistant-blog-dock--closing" : ""}`}
          >
            <div
              ref={dockContainerRef}
              className="site-assistant-input-shell pointer-events-auto flex w-full min-w-0 max-w-[400px] flex-col sm:w-[380px]"
              onKeyDown={(e) => {
                if (e.key === "Escape") closeDock({ userInitiated: true });
              }}
            >
              <AssistantDockCloseButton
                label={copy.closeChat}
                onClick={() => closeDock({ userInitiated: true })}
              />

              {chatOpen && (
                <div className="site-assistant-chat-panel relative mb-2 flex max-h-[min(50vh,380px)] w-full flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                  <div ref={listRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 pb-3 pt-3" role="log" aria-live="polite">
                    {messages.map((msg, i) => (
                      <div
                        key={`${msg.role}-${i}`}
                        className={
                          msg.role === "user"
                            ? "ml-8 rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                            : "mr-4 rounded-xl border border-zinc-100 bg-zinc-50/90 px-3 py-2 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300"
                        }
                      >
                        {msg.role === "assistant" ? <AssistantMessageContent text={msg.content} /> : msg.content}
                      </div>
                    ))}
                    {thinking && <AssistantTypingIndicator label={copy.thinking} />}
                  </div>
                </div>
              )}

              {showSuggestions && (
                <div
                  className="mb-2 flex flex-col gap-1.5"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {copy.suggestions.map((q, index) => (
                    <button
                      key={q}
                      type="button"
                      className="site-assistant-blog-suggestion w-full rounded-xl border border-zinc-200/80 bg-white/95 px-3 py-2 text-left text-xs text-zinc-700 shadow-sm backdrop-blur transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:text-sm"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => pickSuggestion(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="hw-dock-stack min-w-0 max-w-full" onMouseDown={handleDockMouseDown}>
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
                      maxLength={500}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
