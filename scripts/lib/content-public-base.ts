/** Canonical public JSON base (R2). Legacy Blob env still accepted during migration. */
export function contentPublicBaseUrl(): string | null {
  const next =
    process.env.CONTENT_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
    process.env.BLOB_PUBLIC_BASE_URL?.replace(/\/$/, "");
  return next || null;
}
