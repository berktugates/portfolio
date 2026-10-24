# Haberler — Google AdSense

## Kapsam

- Yayıncı: `ca-pub-2056987543720599` (`public/ads.txt` her iki host’ta 200).
- **Haberler:** ana index, `/kategori/*`, haber detayları — Auto Ads + opsiyonel responsive display slot (`NEXT_PUBLIC_ADSENSE_SLOT_HABERLER`).
- **Apex:** ana sayfa (`NEXT_PUBLIC_ADSENSE_SLOT_HOME`).
- **Blog:** index + yazı detayı (`NEXT_PUBLIC_ADSENSE_SLOT_BLOG`).
- **Kapalı:** künye, editöryal politika, düzeltme, yazar, `/hire` ve diğer ince/legal sayfalar.

## Yapılandırma

1. `NEXT_PUBLIC_ADSENSE_CLIENT_ID` boş bırakılırsa kodda sabit `ca-pub-2056987543720599` kullanılır.
2. Display slot env’leri boşsa yalnız script + Auto Ads çalışır; boş `<ins>` kutusu render edilmez (CLS).
3. Ortak bileşenler: `app/components/adsense-script.tsx`, `adsense-display.tsx`.

## Performans

- Betik `afterInteractive` ile yüklenir.
- Manuel slot yalnız env ile tanımlıysa mount edilir ve `adsbygoogle.push` çağrılır.
