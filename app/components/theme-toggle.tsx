"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
type Theme = "light" | "dark" | "system";
const options = [{ id: "light", label: "Light", Icon: Sun }, { id: "dark", label: "Dark", Icon: Moon }, { id: "system", label: "System", Icon: Monitor }] as const;
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  useEffect(() => { const timer = window.setTimeout(() => setTheme((localStorage.getItem("theme") as Theme) || "system"), 0); return () => window.clearTimeout(timer); }, []);
  const apply = (next: Theme) => { setTheme(next); if (next === "system") localStorage.removeItem("theme"); else localStorage.setItem("theme", next); document.documentElement.classList.toggle("dark", next === "dark" || (next === "system" && matchMedia("(prefers-color-scheme: dark)").matches)); };
  return <div className="flex text-xs text-zinc-400">{options.map(({ id, label, Icon }) => <button key={id} type="button" onClick={() => apply(id)} className="relative inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 dark:text-zinc-400" aria-label={`Switch to ${label} theme`} data-checked={theme === id}>{theme === id && <span className="pointer-events-none absolute inset-0 rounded-lg bg-zinc-100 dark:bg-zinc-800" />}<Icon className="z-10 size-4" /></button>)}</div>;
}
