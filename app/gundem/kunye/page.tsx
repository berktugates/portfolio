import type { Metadata } from "next";
import { GundemInfoLayout } from "../../components/gundem-info-layout";
import { publicationIdentity } from "../../lib/gundem/publication";

export const metadata: Metadata = { title: "Künye", alternates: { canonical: "https://haberler.berktugberke.com/kunye" } };

export default function KunyePage() {
  const identity = publicationIdentity();
  return <GundemInfoLayout title="Künye" lead="Yayın kimliği, sorumluluk ve iletişim bilgileri.">
    {!identity.complete ? <p role="alert"><strong>Yayın doğrulama bekliyor:</strong> Kayıtlı sorumlu müdür, adres, telefon ve elektronik tebligat bilgileri tamamlanmadan otomatik yayın açılamaz.</p> : null}
    <dl>
      <dt>Yayın sahibi</dt><dd>{identity.owner}</dd>
      <dt>Sorumlu müdür</dt><dd>{identity.responsibleManager ?? "Yayın öncesi doğrulama bekliyor"}</dd>
      <dt>Yayın türü</dt><dd>{identity.publicationType}</dd>
      <dt>Yönetim / işyeri adresi</dt><dd>{identity.workplaceAddress ?? "Yayın öncesi doğrulama bekliyor"}</dd>
      <dt>Telefon</dt><dd>{identity.phone ?? "Güncellenecek"}</dd>
      <dt>E-posta</dt><dd><a href={`mailto:${identity.email}`}>{identity.email}</a></dd>
      <dt>Elektronik tebligat adresi</dt><dd>{identity.electronicNotificationAddress ?? "Yayın öncesi doğrulama bekliyor"}</dd>
      <dt>Yer sağlayıcı</dt><dd>{identity.hostingProvider}</dd>
    </dl>
  </GundemInfoLayout>;
}
