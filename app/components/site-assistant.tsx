"use client";

import { ArrowUp, Mic, X } from "lucide-react";
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
import { AssistantMessageContent } from "../lib/site-assistant/render-message";
import { AssistantTypingIndicator } from "./assistant-typing-indicator";

const MIN_TYPING_MS = 520;

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
        const [reply] = await Promise.all([
          sendAssistantMessage(locale, messagesRef.current, trimmed),
          new Promise<void>((resolve) => setTimeout(resolve, MIN_TYPING_MS)),
        ]);
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
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-20 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80"
        aria-hidden
      />

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-3xl flex-col px-2.5 pb-2 sm:px-5 sm:pb-4">
        {chatOpen ? (
          <div className="pointer-events-auto relative mb-2 flex max-h-[min(52vh,420px)] flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-lg shadow-black/5 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40">
            <button
              type="button"
              className="absolute right-2 top-2 z-10 rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
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

        {showSuggestions ? (
          <div
            className="pointer-events-auto mb-1.5 flex max-h-[min(26vh,168px)] flex-col gap-0 overflow-y-auto px-0.5 sm:max-h-[min(22vh,152px)]"
            onMouseDown={(e) => e.preventDefault()}
          >
            {copy.suggestions.map((q) => (
              <PromptSuggestion
                key={q}
                type="button"
                highlight={prompt}
                className="h-auto min-h-0 w-full justify-start rounded-md bg-transparent px-1.5 py-1 text-left text-[11px] leading-snug font-normal text-zinc-600 shadow-none hover:bg-transparent hover:text-zinc-950 sm:px-2 sm:py-1.5 sm:text-xs dark:text-zinc-400 dark:hover:text-zinc-100"
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
          maxHeight={120}
          className="pointer-events-auto border-input bg-popover relative z-10 w-full rounded-2xl border p-0 shadow-xs sm:rounded-3xl dark:bg-zinc-900"
        >
          <div className="flex flex-col">
            <PromptInputTextarea
              placeholder={copy.placeholder}
              className="min-h-[36px] max-h-[120px] py-2 pl-3 pr-2 text-sm leading-snug sm:min-h-[40px] sm:pl-4 sm:text-[15px]"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />

            <PromptInputActions className="mt-0.5 flex w-full items-center justify-end gap-1.5 px-2 pb-2 sm:px-2.5 sm:pb-2.5">
              <div className="flex items-center gap-1.5">
                <PromptInputAction tooltip={copy.voiceInput ?? "Voice input"}>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={`size-8 rounded-full sm:size-9 ${listening ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-800" : ""}`}
                    onClick={toggleVoice}
                    aria-pressed={listening}
                    aria-label={copy.voiceInput ?? "Voice input"}
                  >
                    <Mic className="size-4 sm:size-[18px]" />
                  </Button>
                </PromptInputAction>

                <Button
                  type="button"
                  size="icon"
                  disabled={!prompt.trim() || thinking}
                  onClick={() => void handleSubmit()}
                  className="size-8 rounded-full sm:size-9"
                  aria-label={copy.send}
                >
                  {!thinking ? (
                    <ArrowUp className="size-4 sm:size-[18px]" />
                  ) : (
                    <span className="size-2.5 animate-pulse rounded-sm bg-primary-foreground sm:size-3" />
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
