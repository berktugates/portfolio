/** Publish gate: licensed image URL must respond (Pexels short paths 404). */
export async function isImageUrlReachable(src: string): Promise<boolean> {
  try {
    const res = await fetch(src, { method: "HEAD", redirect: "follow" });
    if (res.status === 405) {
      const getRes = await fetch(src, { method: "GET", redirect: "follow", headers: { Range: "bytes=0-0" } });
      return getRes.ok;
    }
    return res.ok;
  } catch {
    return false;
  }
}
