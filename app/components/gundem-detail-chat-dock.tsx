"use client";

import { MessageCircle, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type GundemDetailChatDockProps = {
  title: string;
  excerpt: string;
  snippets: readonly string[];
};

export function GundemDetailChatDock({ title, excerpt, snippets }: GundemDetailChatDockProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="fixed bottom-6 right-4 z-40 sm:right-6" data-gundem-chat-dock>
      <div
        id={panelId}
        role="dialog"
        aria-label="Brifing sohbet özeti"
        aria-hidden={!open}
        className={`mb-3 origin-bottom-right transition-all duration-200 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-2xl shadow-zinc-900/15 dark:border-zinc-700 dark:bg-zinc-950 dark:shadow-black/50">
          <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/90 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/80">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Brifing notu</p>
              <p className="line-clamp-1 text-sm font-medium text-zinc-950 dark:text-zinc-50">{title}</p>
            </div>
            <button
              type="button"
              aria-label="Kapat"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-200/80 dark:hover:bg-zinc-800"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <div className="max-h-[min(50vh,20rem)] space-y-3 overflow-y-auto bg-zinc-50/50 p-4 dark:bg-zinc-900/30">
            <div className="flex justify-start">
              <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm leading-6 text-zinc-700 shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-700">
                {excerpt}
              </div>
            </div>
            {snippets.map((line) => (
              <div key={line.slice(0, 48)} className="flex justify-start">
                <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm leading-6 text-zinc-700 shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-900 dark:text-zinc-200 dark:ring-zinc-700">
                  {line}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-100 bg-white px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="rounded-xl bg-zinc-100 px-3 py-2 text-xs text-zinc-500 dark:bg-zinc-900">
              Bu özet brifing metninden; tam analiz için yukarıdaki yazıyı okuyun.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Brifing notunu kapat" : "Brifing notunu aç"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-lg shadow-zinc-900/25 transition-transform hover:scale-[1.03] active:scale-95 dark:bg-zinc-100 dark:text-zinc-950"
      >
        <MessageCircle className="size-6" aria-hidden />
      </button>
    </div>
  );
}
