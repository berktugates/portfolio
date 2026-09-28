"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  applyThemePreference,
  readThemePreference,
  writeThemePreference,
  type ThemePreference,
} from "../lib/theme";

const options = [
  { id: "light" as const, label: "Light", Icon: Sun },
  { id: "dark" as const, label: "Dark", Icon: Moon },
  { id: "system" as const, label: "System", Icon: Monitor },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>("system");

  useLayoutEffect(() => {
    setTheme(readThemePreference());
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemePreference("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const apply = (next: ThemePreference) => {
    setTheme(next);
    writeThemePreference(next);
    applyThemePreference(next);
  };

  return (
    <div className="flex text-xs text-zinc-400">
      {options.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => apply(id)}
          className="relative inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 dark:text-zinc-400"
          aria-label={`Switch to ${label} theme`}
          aria-pressed={theme === id}
          data-checked={theme === id}
        >
          {theme === id && (
            <span className="pointer-events-none absolute inset-0 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          )}
          <Icon className="z-10 size-4" />
        </button>
      ))}
    </div>
  );
}
