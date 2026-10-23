const ALLOWED_TAGS = new Set([
  "h2",
  "h3",
  "h4",
  "p",
  "ul",
  "ol",
  "li",
  "a",
  "strong",
  "em",
  "code",
  "pre",
  "blockquote",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
]);

class SanitizeHandler {
  constructor(private readonly dropTags: Set<string>) {}

  element(element: Element) {
    const tag = element.tagName.toLowerCase();
    if (tag === "h1") {
      element.remove();
      return;
    }
    if (tag === "script" || tag === "iframe" || tag === "style" || tag === "object" || tag === "embed") {
      element.remove();
      return;
    }
    if (!ALLOWED_TAGS.has(tag)) {
      element.removeAndKeepContent();
      return;
    }
    if (tag === "a") {
      const href = element.getAttribute("href") ?? "";
      if (!href.startsWith("https:")) {
        element.remove();
        return;
      }
      element.removeAttribute("onclick");
      element.removeAttribute("onmouseover");
      element.setAttribute("rel", "noopener noreferrer");
      element.setAttribute("target", "_blank");
    }
    const stripAttrs = ["style", "class", "id", "onclick", "onmouseover", "onload", "onerror", "onfocus"];
    for (const attr of stripAttrs) {
      if (element.hasAttribute(attr)) element.removeAttribute(attr);
    }
  }
}

export async function sanitizeArticleHtml(html: string): Promise<string> {
  const res = new Response(html, { headers: { "Content-Type": "text/html" } });
  const sanitized = await new HTMLRewriter().on("*", new SanitizeHandler(new Set())).transform(res).text();
  return sanitized.trim();
}
