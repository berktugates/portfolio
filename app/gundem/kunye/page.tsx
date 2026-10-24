import type { Metadata } from "next";
import { GundemInfoLayout } from "../../components/gundem-info-layout";
import { publicationIdentity } from "../../lib/gundem/publication";

export const metadata: Metadata = { title: "Künye", alternates: { canonical: "https://haberler.berktugberke.com/kunye" } };

export default function KunyePage() {
  const identity = publicationIdentity();
  return (
    <GundemInfoLayout title="Künye" lead="Yayın kimliği, sorumluluk ve iletişim bilgileri.">
      <dl>
        <dt>Yayın sahibi</dt>
        <dd>{identity.owner}</dd>
        <dt>Sorumlu müdür</dt>
        <dd>{identity.responsibleManager ?? "—"}</dd>
        <dt>Yayın türü</dt>
        <dd>{identity.publicationType}</dd>
        <dt>İletişim</dt>
        <dd>
          <a href={identity.contactFormUrl}>İletişim formu</a> (
          {identity.contactFormUrl.replace(/^https:\/\//, "")})
        </dd>
        <dt>Yer sağlayıcı</dt>
        <dd>{identity.hostingProvider}</dd>
      </dl>
    </GundemInfoLayout>
  );
}
