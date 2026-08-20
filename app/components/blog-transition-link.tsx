"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type TransitionDocument = Document & { startViewTransition?: (update: () => Promise<void>) => { finished: Promise<void> } };

export function BlogTransitionLink({ children, className }: { children: ReactNode; className: string }) {
  const router = useRouter();
  const paintBorder = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dark = document.documentElement.classList.contains("dark");
    const spotlight = dark ? "rgba(255,255,255,.95)" : "rgba(24,24,27,.95)";
    const base = dark ? "rgba(82,82,91,.30)" : "rgba(212,212,216,.30)";
    event.currentTarget.style.background = `radial-gradient(64px circle at ${x}px ${y}px, ${spotlight} 0%, transparent 80%), ${base}`;
  };
  const clearBorder = (event: MouseEvent<HTMLAnchorElement>) => { event.currentTarget.style.background = ""; };
  const fallbackTransition = (anchor: HTMLAnchorElement) => {
    const source = anchor.querySelector<HTMLElement>("[style*='view-transition-name']");
    if (!source) { router.push("/blogs/hello-world"); return; }
    const rect = source.getBoundingClientRect();
    const styles = getComputedStyle(source);
    const clone = document.createElement("span");
    clone.textContent = source.textContent;
    Object.assign(clone.style, { position: "fixed", left: `${rect.left}px`, top: `${rect.top}px`, zIndex: "9999", margin: "0", color: styles.color, fontFamily: styles.fontFamily, fontSize: styles.fontSize, fontWeight: "500", lineHeight: "28px", letterSpacing: styles.letterSpacing, whiteSpace: "nowrap", pointerEvents: "none", transition: "left 420ms cubic-bezier(.22,1,.36,1), top 420ms cubic-bezier(.22,1,.36,1), font-size 420ms cubic-bezier(.22,1,.36,1)" });
    document.body.appendChild(clone);
    source.style.visibility = "hidden";
    document.body.classList.add("blog-route-leaving");
    window.scrollTo({ top: 0 });
    const targetLeft = Math.max(16, (window.innerWidth - 608) / 2);
    requestAnimationFrame(() => requestAnimationFrame(() => { clone.style.left = `${targetLeft}px`; clone.style.top = "224px"; clone.style.fontSize = "20px"; }));
    router.push("/blogs/hello-world");
    const observer = new MutationObserver(() => {
      const destination = document.querySelector<HTMLElement>("main.blog-prose h1");
      if (!destination) return;
      destination.style.visibility = "hidden";
      observer.disconnect();
      window.setTimeout(() => document.body.classList.remove("blog-route-leaving"), 120);
      window.setTimeout(() => { destination.style.visibility = "visible"; clone.remove(); }, 430);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => { observer.disconnect(); document.body.classList.remove("blog-route-leaving"); clone.remove(); }, 2600);
  };
  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const transitionDocument = document as TransitionDocument;
    if (!transitionDocument.startViewTransition) { event.preventDefault(); fallbackTransition(event.currentTarget); return; }
    event.preventDefault();
    transitionDocument.startViewTransition(() => new Promise<void>((resolve) => {
      let settled = false;
      const finish = () => { if (settled) return; settled = true; observer.disconnect(); window.clearTimeout(timeout); window.scrollTo({ top: 0 }); resolve(); };
      const observer = new MutationObserver(() => { if (document.querySelector("main.blog-prose h1")) finish(); });
      const timeout = window.setTimeout(finish, 2500);
      observer.observe(document.body, { childList: true, subtree: true });
      router.push("/blogs/hello-world");
    }));
  };
  return <Link href="/blogs/hello-world" onClick={navigate} onMouseEnter={paintBorder} onMouseMove={paintBorder} onMouseLeave={clearBorder} className={className}><span className="relative flex w-full items-center justify-between rounded-[11px] bg-white px-3 py-3 transition-colors duration-300 dark:bg-zinc-950">{children}</span></Link>;
}
