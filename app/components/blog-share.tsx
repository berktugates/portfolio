type BlogShareProps = {
  title: string;
  slug: string;
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function RedditIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm5.938 7.188c.563 0 1.021.458 1.021 1.021 0 .41-.244.761-.594.922.057.26.09.53.09.812 0 2.635-3.063 4.771-6.844 4.771S4.767 14.678 4.767 12.043c0-.282.033-.552.09-.812a1.02 1.02 0 0 1-.594-.922c0-.563.458-1.021 1.021-1.021.282 0 .536.115.719.298 1.01-.721 2.39-1.182 3.92-1.25l.74-3.48a.42.42 0 0 1 .51-.323l2.49.53a1.02 1.02 0 1 1-.02.344l-2.22-.473-.66 3.11c1.5.08 2.85.54 3.84 1.25a1.01 1.01 0 0 1 .725-.297zM8.75 12.7c0 .563.458 1.021 1.021 1.021S10.792 13.263 10.792 12.7s-.458-1.021-1.021-1.021S8.75 12.137 8.75 12.7zm5.542 2.73c-.74.74-2.146.8-2.792.8s-2.052-.06-2.792-.8a.42.42 0 0 1 .594-.594c.49.49 1.54.563 2.198.563s1.708-.073 2.198-.563a.42.42 0 1 1 .594.594zm.437-1.709c-.563 0-1.021-.458-1.021-1.021s.458-1.021 1.021-1.021 1.021.458 1.021 1.021-.458 1.021-1.021 1.021z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

const shareLinkClassName =
  "inline-flex size-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50";

export function BlogShare({ title, slug }: BlogShareProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://berktugberke.com";
  const url = `${siteUrl}/blogs/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <nav aria-label="Share this article" className="mt-8 flex items-center gap-1">
      <span className="mr-2 text-sm text-zinc-500 dark:text-zinc-400">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noreferrer"
        className={shareLinkClassName}
        aria-label="Share on X"
      >
        <XIcon className="size-4" />
      </a>
      <a
        href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noreferrer"
        className={shareLinkClassName}
        aria-label="Share on Reddit"
      >
        <RedditIcon className="size-4" />
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noreferrer"
        className={shareLinkClassName}
        aria-label="Share on WhatsApp"
      >
        <WhatsAppIcon className="size-4" />
      </a>
    </nav>
  );
}
