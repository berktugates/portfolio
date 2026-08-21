"use client";
import type { MouseEvent, ReactNode } from "react";

type Props = { children: ReactNode; href?: string; label?: string };
export function GlowCard({ children, href, label }: Props) {
  const paintGlow = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dark = document.documentElement.classList.contains("dark");
    const spotlight = dark ? "rgba(255,255,255,.95)" : "rgba(24,24,27,.95)";
    const base = dark ? "rgba(82,82,91,.30)" : "rgba(212,212,216,.30)";
    event.currentTarget.style.background = `radial-gradient(64px circle at ${x}px ${y}px, ${spotlight} 0%, transparent 80%), ${base}`;
  };
  const clearGlow = (event: MouseEvent<HTMLElement>) => { event.currentTarget.style.background = ""; };
  const content = <span className="relative block h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">{children}</span>;
  const classes = "group relative block overflow-hidden rounded-2xl bg-zinc-300/30 p-px transition-[background] duration-200 dark:bg-zinc-600/30";
  const interactions = { onMouseEnter: paintGlow, onMouseMove: paintGlow, onMouseLeave: clearGlow };
  const opensNewTab = href?.startsWith("http");
  return href ? <a href={href} target={opensNewTab ? "_blank" : undefined} rel={opensNewTab ? "noreferrer" : undefined} aria-label={label} {...interactions} className={classes}>{content}</a> : <div {...interactions} className={classes}>{content}</div>;
}
