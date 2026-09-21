/**
 * Faz 4 DoD: prod Blob'da beklenen slug var mı?
 */
const slug = "turkiye-yazilim-ekipleri-icin-bulut-maliyetleri";

async function main() {
  const base = process.env.BLOB_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!base) {
    console.error("BLOB_PUBLIC_BASE_URL is required.");
    process.exit(1);
  }

  const indexUrl = `${base}/gundem/index.json`;
  const res = await fetch(indexUrl);
  if (!res.ok) {
    console.error(`Blob index fetch failed: ${res.status} ${indexUrl}`);
    process.exit(1);
  }
  const data = (await res.json()) as { posts: { slug: string }[] };
  const found = data.posts?.some((p) => p.slug === slug);
  if (!found) {
    console.error(
      `Expected slug ${slug} in Blob index; got ${data.posts?.map((p) => p.slug).join(", ") || "none"}`,
    );
    process.exit(1);
  }
  console.log(`Blob index OK: ${slug}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
