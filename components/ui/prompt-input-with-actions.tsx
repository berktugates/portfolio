"use client";

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Mic } from "lucide-react";
import { useState } from "react";

/** Reference-style prompt shell (Berktug site uses `SiteAssistantDock` with hire logic). */
function PromptInputWithActions() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setPrompt("");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-3 pb-3 md:px-5 md:pb-5">
      <PromptInput
        isLoading={isLoading}
        value={prompt}
        onValueChange={setPrompt}
        onSubmit={handleSubmit}
        className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
      >
        <div className="flex flex-col">
          <PromptInputTextarea
            placeholder="Ask anything"
            className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
          />
          <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
            <div />
            <div className="flex items-center gap-2">
              <PromptInputAction tooltip="Voice input">
                <Button variant="outline" size="icon" className="size-9 rounded-full" type="button">
                  <Mic size={18} />
                </Button>
              </PromptInputAction>
              <Button
                size="icon"
                disabled={!prompt.trim() || isLoading}
                onClick={handleSubmit}
                className="size-9 rounded-full"
                type="button"
              >
                {!isLoading ? <ArrowUp size={18} /> : <span className="size-3 rounded-xs bg-white" />}
              </Button>
            </div>
          </PromptInputActions>
        </div>
      </PromptInput>
    </div>
  );
}

export { PromptInputWithActions };
