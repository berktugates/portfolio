# Gündem kuyruğu

Taslak brifing JSON dosyaları. Yayın `publish-gundem` workflow ile Vercel Blob’a gider; `main`’e git push yok.

**Editöryal kapsam:** Türkiye’nin tamamını ilgilendiren ulusal gündem (ekonomi, siyaset, toplum, sağlık, spor, kültür, bilim, bilişim…). Yalnızca yazılım/bilişim hattı değil. Trends/KWP ile tıklama potansiyeli yüksek konular + kısa analiz. Ayrıntı: `docs/gundem-editorial.md`, sabitler: `app/lib/gundem/editorial.ts`.

CI: `pnpm check:queues` kuyruk metnini tarar.
