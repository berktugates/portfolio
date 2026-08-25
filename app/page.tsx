import { createHomeMetadata, HomePage } from "./components/home-page";

export async function generateMetadata() {
  return createHomeMetadata("en");
}

export default function Home() {
  return <HomePage locale="en" />;
}
