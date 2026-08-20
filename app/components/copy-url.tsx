"use client";
import { useState } from "react";

export function CopyUrl() {
  const [copied, setCopied] = useState(false);
  return <button type="button" className="flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50" onClick={async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }}><span>{copied ? "Copied" : "Copy"}</span><span>URL</span></button>;
}
