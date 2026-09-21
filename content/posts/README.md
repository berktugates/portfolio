# Blog MD kaynağı (Faz 3)

Hedef format: `content/posts/{slug}/en.md` + isteğe bağlı locale overlay dosyaları.

Şu an kanonik kaynak hâlâ `app/data/blogs.ts`; Blob yayını `BLOB_PUBLIC_BASE_URL` ile birleştirilir. Tek seferlik export: `node scripts/export-blogs-to-md.mjs` (gelecek).
