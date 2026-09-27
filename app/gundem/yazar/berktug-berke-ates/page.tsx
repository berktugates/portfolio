import type { Metadata } from "next";
import { GundemInfoLayout } from "../../../components/gundem-info-layout";

export const metadata: Metadata = { title: "Berktuğ Berke Ateş — Editör", alternates: { canonical: "https://haberler.berktugberke.com/yazar/berktug-berke-ates" } };

export default function AuthorPage() {
  return <GundemInfoLayout title="Berktuğ Berke Ateş" lead="Yayın sahibi ve editör.">
    <p>Yazılım mühendisi Berktuğ Berke Ateş, haberler.berktugberke.com’un yayın ve teknik altyapısından sorumludur. Haberler kanıt kontrollü otomasyonla hazırlanır; hassas veya çelişkili gelişmeler editör incelemesine alınır.</p>
    <p><a href="mailto:contact@berktugberke.com">contact@berktugberke.com</a> · <a href="https://berktugberke.com">Resmî profil</a></p>
  </GundemInfoLayout>;
}
