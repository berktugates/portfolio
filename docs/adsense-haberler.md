# Haberler — Google AdSense

## Güvenlik

- AdSense hesabı **tarayıcı otomasyonu veya sohbette paylaşılan şifre ile açılmaz**.
- `ca-pub-*` yalnızca Vercel **Environment Variables** (Production) içinde tutulur.

## Kurulum (manuel)

1. [Google AdSense](https://www.google.com/adsense/) → site ekle: `https://haberler.berktugberke.com`
2. Onay için yeterli içerik, `kunye`, `editorial-policy`, `robots.txt`, sitemap hazır olmalı.
3. Onay sonrası **Reklam birimleri** oluştur:
   - Dikey / display — sol şerit (slot → `NEXT_PUBLIC_ADSENSE_SLOT_LEFT`)
   - Dikey / display — sağ şerit (`NEXT_PUBLIC_ADSENSE_SLOT_RIGHT`)
   - Yatay responsive — mobil (`NEXT_PUBLIC_ADSENSE_SLOT_MOBILE`)
   - Makale altı — mobil (`NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE`)
4. Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXX`
   - Slot değişkenleri (opsiyonel; boşsa auto format denenir)
5. Redeploy.

## UI

- **Desktop (lg+):** İçerik ortada; sol/sağ sticky dikey birimler (`haberler-shell.tsx`).
- **Mobil:** Nav altı banner + makale sonu birim.

Reklam env yoksa bileşenler render edilmez (geliştirme ortamı temiz kalır).
