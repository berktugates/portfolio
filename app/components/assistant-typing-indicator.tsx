/** Minimal assistant “typing” dots — shown briefly before the reply appears. */
export function AssistantTypingIndicator({ label }: { label: string }) {
  return (
    <div
      className="mr-2 w-fit rounded-xl border border-zinc-100 bg-zinc-50/90 px-3.5 py-2.5 dark:border-zinc-800 dark:bg-zinc-950/50"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="assistant-typing-dots" aria-hidden>
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}
