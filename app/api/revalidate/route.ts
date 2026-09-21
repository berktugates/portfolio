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

  for (const tag of body.tags ?? []) {
    revalidateTag(tag, "max");
  }
  for (const path of body.paths ?? []) {
    if (!path.startsWith("/")) continue;
    revalidatePath(path);
  }

  return new NextResponse(null, { status: 204 });
}
