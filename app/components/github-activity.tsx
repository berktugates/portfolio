"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { formatMessage } from "../lib/i18n/format";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((module) => module.GitHubCalendar),
  {
    ssr: false,
    loading: () => <div className="h-[104px] animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />,
  },
);

function getSiteColorScheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export type GitHubActivityCopy = {
  title: string;
  currentStreak: string;
  longestStreak: string;
  noContributions: string;
  contribution: string;
  dateLocale: string;
};

export function GitHubActivity({ copy }: { copy: GitHubActivityCopy }) {
  const [streaks, setStreaks] = useState({ current: 0, longest: 0 });
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");
  const contributionDateFormatter = new Intl.DateTimeFormat(copy.dateLocale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  useEffect(() => {
    const syncColorScheme = () => setColorScheme(getSiteColorScheme());
    syncColorScheme();

    const observer = new MutationObserver(syncColorScheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", syncColorScheme);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncColorScheme);
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("https://github-contributions-api.jogruber.de/v4/berktugates?y=last")
      .then((response) => response.json())
      .then((data: { contributions: Array<{ count: number }> }) => {
        const days = data.contributions ?? [];
        let longest = 0;
        let run = 0;
        for (const day of days) {
          run = day.count > 0 ? run + 1 : 0;
          longest = Math.max(longest, run);
        }
        let index = days.length - 1;
        if (index >= 0 && days[index].count === 0) index -= 1;
        let current = 0;
        while (index >= 0 && days[index].count > 0) {
          current += 1;
          index -= 1;
        }
        if (active) setStreaks({ current, longest });
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl bg-zinc-300/30 p-px dark:bg-zinc-600/30">
      <div className="rounded-[15px] bg-white p-4 dark:bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-normal">{copy.title}</h3>
          <a
            href="https://github.com/berktugates"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            @berktugates
          </a>
        </div>
        <div className="text-zinc-500">
          <GitHubCalendar
            username="berktugates"
            blockSize={9}
            blockMargin={3}
            fontSize={11}
            colorScheme={colorScheme}
            theme={{
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            tooltips={{
              activity: {
                withArrow: true,
                hoverRestMs: 80,
                text: (activity) => {
                  const count =
                    activity.count === 0
                      ? copy.noContributions
                      : formatMessage(copy.contribution, { count: activity.count });
                  return `${count} · ${contributionDateFormatter.format(new Date(`${activity.date}T00:00:00Z`))}`;
                },
              },
            }}
          />
        </div>
        <div className="mt-5 grid grid-cols-2 border-t border-zinc-100 pt-4 text-center dark:border-zinc-800">
          <div className="border-r border-zinc-100 dark:border-zinc-800">
            <p className="text-xl font-medium text-zinc-900 dark:text-zinc-100">{streaks.current}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{copy.currentStreak}</p>
          </div>
          <div>
            <p className="text-xl font-medium text-zinc-900 dark:text-zinc-100">{streaks.longest}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{copy.longestStreak}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
