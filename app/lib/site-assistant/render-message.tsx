import type { ReactNode } from "react";
import Link from "next/link";

const SITE_HOSTS = new Set(["berktugberke.com", "www.berktugberke.com"]);

function isExternalHref(href: string): boolean {
  if (href.startsWith("/") || href.startsWith("#")) return false;
  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return true;
    return !SITE_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function linkClassName() {
  return "font-medium text-blue-600 underline decoration-blue-400/60 underline-offset-2 hover:text-blue-700 hover:decoration-blue-500 dark:text-blue-400 dark:decoration-blue-500/50 dark:hover:text-blue-300";
}

function renderLink(href: string, label: ReactNode, key: string) {
  if (isExternalHref(href)) {
    return (
      <a
        key={key}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName()}
      >
        {label}
      </a>
    );
  }

  const path = href.startsWith("http") ? new URL(href).pathname + new URL(href).search + new URL(href).hash : href;

  return (
    <Link key={key} href={path} className={linkClassName()}>
      {label}
    </Link>
  );
}

function renderInlineFormatting(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`|https?:\/\/[^\s<]+[^\s<.,;:!?)"])/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    const token = match[0];
    const key = `${keyPrefix}-f${i++}`;
    if (token.startsWith("http://") || token.startsWith("https://")) {
      nodes.push(renderLink(token, token, key));
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-zinc-950 dark:text-white">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-zinc-200/80 px-1 py-0.5 font-mono text-[0.9em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(
        <em key={key} className="text-zinc-800 dark:text-zinc-200">
          {token.slice(1, -1)}
        </em>,
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return nodes.length ? nodes : [text];
}

function renderInlineWithLinks(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = linkRe.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(...renderInlineFormatting(text.slice(last, match.index), `${keyPrefix}-t${i}`));
    }
    const href = match[2];
    nodes.push(renderLink(href, renderInlineFormatting(match[1], `${keyPrefix}-lt${i}`), `${keyPrefix}-l${i++}`));
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    nodes.push(...renderInlineFormatting(text.slice(last), `${keyPrefix}-tail`));
  }

  return nodes.length ? nodes : renderInlineFormatting(text, keyPrefix);
}

/** Assistant replies: markdown links, **bold**, *italic*, `code`, line breaks, emoji. */
export function AssistantMessageContent({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);

  return (
    <div className="space-y-2 break-words text-[inherit] leading-relaxed">
      {paragraphs.map((block, pi) => {
        const lines = block.split("\n");
        return (
          <p key={`p-${pi}`} className="whitespace-pre-wrap">
            {lines.map((line, li) => (
              <span key={`p-${pi}-l-${li}`}>
                {li > 0 ? <br /> : null}
                {renderInlineWithLinks(line, `p${pi}l${li}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
