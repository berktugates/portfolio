import type { Metadata } from "next";
import { GundemInfoLayout } from "../../components/gundem-info-layout";

export const metadata: Metadata = { title: "Editöryal politika", alternates: { canonical: "https://haberler.berktugberke.com/editorial-policy" } };

export default function EditorialPolicyPage() {
  return <GundemInfoLayout title="Editöryal politika" lead="Olayları kaynak metinlerini kopyalamadan, doğrulanabilir kanıtlardan özgün ve sıkı biçimde özetliyoruz.">
    <h2>Kaynak ve doğrulama</h2>
    <p>Makale HTML’i scrape edilmez. İzinli RSS/Atom metadata’sı, resmî açıklamalar ve açıkça lisanslı kaynaklar kullanılır. Aynı yayın grubundaki iki kanal bağımsız doğrulama sayılmaz. Her haberin kaynak bağlantıları yazının altında gösterilir.</p>
    <h2>Otomasyon</h2>
    <p>Yapay zekâ yalnız kanıt paketinden taslak üretir; yeni isim, rakam, tarih veya sonuç eklemesine izin verilmez. Sayısal ve özel isim kontrolleri, kopya ve tekrar kapıları otomatik uygulanır. Hassas konular insan onayı olmadan yayımlanmaz.</p>
    <h2>Düzeltmeler</h2>
    <p>İlk yayın zamanı korunur. Yeni gelişmeler ve düzeltmeler aynı URL’de tarihli sürüm notlarıyla gösterilir. Geri çekilen bir içerik arşiv ve denetim izi korunarak işaretlenir.</p>
    <h2>Görseller</h2>
    <p>Yalnız lisansı kayıtlı görseller kullanılır. Olayın kendisini göstermeyen stok görseller “temsili” olarak belirtilir; kaynak yayınların görselleri hotlink edilmez.</p>
  </GundemInfoLayout>;
}
