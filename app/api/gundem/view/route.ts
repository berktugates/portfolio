import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getGundemBySlug } from "../../../lib/gundem/catalog";
import { baselineGundemViews } from "../../../lib/gundem/view-counts";
import { getR2Json, putR2Json } from "../../../lib/content/r2-json";

type ViewsFile = { views: Record<string, number> };

export async function POST(request: Request) {
  let slug: string | undefined;
  try {
    const body = (await request.json()) as { slug?: string };
    slug = body.slug;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const briefing = await getGundemBySlug(slug);
  if (!briefing) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const existing = (await getR2Json<ViewsFile>("gundem/views.json")) ?? { views: {} };
  const current =
    existing.views[slug] ?? baselineGundemViews(slug, briefing.publishedAt);
  existing.views[slug] = current + 1;

  const written = await putR2Json("gundem/views.json", existing);
  if (written) {
    revalidateTag("gundem-views", "max");
  }

  return NextResponse.json({ ok: true, views: existing.views[slug] });
}
