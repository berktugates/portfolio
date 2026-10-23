import type { GrowthDailyPost } from "./types";

const API_BASE = "https://www.growthdailyseo.com/api/v1";

export class GrowthDailyClient {
  private etag: string | undefined;

  constructor(
    private readonly apiKey: string,
    private readonly siteId: string,
  ) {}

  private async fetchWithBackoff(url: string, init: RequestInit, attempt = 0): Promise<Response> {
    const res = await fetch(url, init);
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      const delay = (attempt + 1) * 500;
      await new Promise((r) => setTimeout(r, delay));
      return this.fetchWithBackoff(url, init, attempt + 1);
    }
    return res;
  }

  async getPost(slug: string): Promise<GrowthDailyPost | null> {
    const url = `${API_BASE}/sites/${this.siteId}/posts/${encodeURIComponent(slug)}`;
    const res = await this.fetchWithBackoff(url, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`growthdaily-get-post:${res.status}`);
    return (await res.json()) as GrowthDailyPost;
  }

  async listPostsUpdatedAfter(updatedAfter: string, pageSize = 50): Promise<GrowthDailyPost[]> {
    const items: GrowthDailyPost[] = [];
    let page = 1;
    for (;;) {
      const params = new URLSearchParams({
        status: "all",
        pageSize: String(pageSize),
        page: String(page),
        updatedAfter,
      });
      const url = `${API_BASE}/sites/${this.siteId}/posts?${params}`;
      const headers: Record<string, string> = { Authorization: `Bearer ${this.apiKey}` };
      if (this.etag) headers["If-None-Match"] = this.etag;
      const res = await this.fetchWithBackoff(url, { headers });
      if (res.status === 304) break;
      if (!res.ok) throw new Error(`growthdaily-list-posts:${res.status}`);
      const etag = res.headers.get("etag");
      if (etag) this.etag = etag;
      const body = (await res.json()) as { items: GrowthDailyPost[]; totalPages: number };
      items.push(...(body.items ?? []));
      if (page >= (body.totalPages ?? 1)) break;
      page += 1;
    }
    return items;
  }
}
