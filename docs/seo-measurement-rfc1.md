# RFC-1 ölçüm — 2026-09-26

Search Console servis hesabı bu ortamda yok (`GSC_SERVICE_ACCOUNT_JSON` boş). Sayfa, ülke ve Core Web Vitals çekilemedi. Aşağıdaki tablo sayfa filtreli değildir. Kaynak, 2026-09-22 tarihli 46 satırlık sorgu dışa aktarımıdır. Dört kova o satırlarda arandı.

| Kova | Eşleşen sorgu | Gösterim | Tıklama | Sayfa |
| --- | --- | --- | --- | --- |
| Tam ad (`berktuğ berke ateş`, `berktug berke ates`, `berktuğ berke`, `berktug berke`) | yok | 0 | 0 | yok |
| Kısa ad | `berke ates` | 8 | 0 | ayrılmadı |
| Kısa ad | `berke ateş` | 3 | 0 | ayrılmadı |
| Kısa ad | `berktug` | 2 | 0 | ayrılmadı |
| Yığın (`react native`, `next.js`, `nextjs`, `react`, `javascript`) | yok | 0 | 0 | yok |
| İş (`web geliştirme`, `mobil geliştirme`, `yazılımcı`) | yok | 0 | 0 | yok |

Domain toplamı (sayfa filtresi yok): 7 tıklama, 329 gösterim, CTR 0,021, ortalama sıra 44,2. Bu ortalama portföy ile haberler hostunu birlikte sayar. Başarı ölçüsü olarak kullanılmaz.

GA4 sayfa görüntüleme: mülkten sayı alınmadı. `docs/ops-baseline.md` hücresi boş kalır.

## Prod başlıkları

| İstek | Sonuç |
| --- | --- |
| `https://berktugberke.com/` | 200, `content-length: 278422`, `x-nextjs-prerender: 1`. Bu uzunluk sıkıştırılmamış gövdedir. Gzip boyutu ölçülmedi. |
| `https://berktugberke.com/tr` | 200, `content-length: 279610`, kaynak `<html lang="en">` |
| `https://www.berktugberke.com/` | 200, apex ile aynı ETag. Yönlendirme yoktu. Kod artık 308 istiyor. |
| `https://berktugberke.com/tr/` | 308, `location: /tr` |
| `https://berktugberke.com/gundem` | 308, `location: https://haberler.berktugberke.com/` |
| `https://berktugberke.com/sitemap-gundem.xml` | 308, `location: https://haberler.berktugberke.com/sitemap.xml` |
| `https://berktugberke.com/api/revalidate` | 405. HTML indeks sayfası değil. |
| `sitemap.xml` `<loc>` | 462 |

Core Web Vitals mobil `/` ve `/tr`: alan raporu yok. RFC-6 açılmaz.

## Sosyal profiller

GitHub hesap adı `berktugates`. API `users/berktugates` (2026-09-26, yeniden bakıldı): `login` = `berktugates`, `blog` = `berktugberke.com`, `twitter_username` = null. `name` alanı `berktug`; bu, hesap adı değil. `sameAs` zaten `https://github.com/berktugates`. URL değişmedi. `alternateName` içine `berktugates` eklendi; ana sayfada `@berktugates` yazıyor.

LinkedIn profil HTML’i okunamadı. `https://www.linkedin.com/in/berktugates/` `sameAs` içinde duruyor, yeni iddia eklenmedi.
