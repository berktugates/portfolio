# Haberler — Google AdSense

## Kapsam

- AdSense site kaydı Google'ın site yönetimi gereği `berktugberke.com` alan adıyla yapılır.
- Reklam betiği yalnız `haberler.berktugberke.com/kategori/*` ve haber detaylarında yüklenir.
- Haberler ana sayfası, künye, editöryal politika, düzeltme ve yazar sayfalarında reklam betiği yoktur.
- Portföy ana alan adında reklam betiği yoktur.

## Yapılandırma

1. Public yayıncı kimliği kodda ve `ads.txt` içinde sabittir; `NEXT_PUBLIC_ADSENSE_CLIENT_ID` yalnız gerektiğinde override eder.
2. `public/ads.txt`, yayıncı kimliğini `DIRECT` olarak bildirir.
3. Auto Ads biçimleri: banner, Multiplex, sabit, sol/sağ yan reklam sütunu ve vinyet.
4. Yerleşimler AdSense tarafından ekran boyutu, içerik uzunluğu ve kullanılabilir boşluğa göre seçilir.

## Performans ve kullanıcı deneyimi

- Betik `afterInteractive` ile yüklenir; haber içeriğinin ilk boyamasını engellemez.
- Masaüstünde yan reklam sütunları uygun genişlikte sol ve sağ boşluğu kullanır.
- Mobilde sabit ve responsive sayfa içi biçimler kullanılır.
- Elle boş reklam alanı ayrılmaz; bu sayede reklam sunulmadığında içerikte boşluk ve gereksiz CLS oluşmaz.
