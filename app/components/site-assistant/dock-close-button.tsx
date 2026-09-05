"use client";

import { X } from "lucide-react";

type Props = {
  label: string;
  onClick: () => void;
};

export function AssistantDockCloseButton({ label, onClick }: Props) {
  return (
    <div className="mb-1.5 flex justify-end">
      <button
        type="button"
        data-testid="site-assistant-dock-close"
        onClick={onClick}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-600 text-white shadow dark:bg-zinc-500"
        aria-label={label}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
