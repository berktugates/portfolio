# Gündem kuyruğu

Taslak brifing JSON dosyaları. Üretimde çoğunlukla `pnpm gundem:refresh-queue` (Trends TR + talep sinyalleri) CI içinde doldurur; yayın `publish-gundem` ile Blob’a gider. Manuel KWP: `scripts/gundem-from-csv.mjs`.

**Editöryal kapsam:** Türkiye’nin tamamını ilgilendiren ulusal gündem (ekonomi, siyaset, toplum, sağlık, spor, kültür, bilim, bilişim…). Yalnızca yazılım/bilişim hattı değil. Trends/KWP ile tıklama potansiyeli yüksek konular + kısa analiz. Ayrıntı: `docs/gundem-editorial.md`, sabitler: `app/lib/gundem/editorial.ts`.

CI: `pnpm check:queues` kuyruk metnini tarar.
