import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Body = {
  secret?: string;
  paths?: string[];
  tags?: string[];
};

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });
  }

  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const secret = bearer ?? body.secret;
  if (secret !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // Expire immediately (not "max" = stale-while-revalidate). With SWR the paths revalidated below
  // (e.g. /sitemap.xml) regenerate from the stale tagged R2 index.json and miss the new slug.
  for (const tag of body.tags ?? []) {
    revalidateTag(tag, { expire: 0 });
  }
  for (const path of body.paths ?? []) {
    if (!path.startsWith("/")) continue;
    revalidatePath(path);
  }

  return new NextResponse(null, { status: 204 });
}
