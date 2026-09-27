import type { Metadata } from "next";
import { CorrectionRequestForm } from "../../components/correction-request-form";
import { GundemInfoLayout } from "../../components/gundem-info-layout";

export const metadata: Metadata = { title: "Düzeltme ve cevap talebi", alternates: { canonical: "https://haberler.berktugberke.com/duzeltme-talebi" } };

export default function CorrectionRequestPage() {
  return <GundemInfoLayout title="Düzeltme ve cevap talebi" lead="Bir haberde gerçeğe aykırı, eksik veya kişilik haklarını etkileyen bir bilgi varsa ilgili URL ve somut düzeltme metniyle bildirin.">
    <p>Talep, sorumlu editör kuyruğuna zaman damgasıyla kaydedilir. Kimlik ve iletişim bilgileriniz yalnız talebi değerlendirmek ve gerektiğinde size ulaşmak için kullanılır.</p>
    <CorrectionRequestForm />
  </GundemInfoLayout>;
}
