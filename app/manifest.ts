import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest { return { name: "Berktug Berke Ates — Software Engineer and Product Builder", short_name: "Berktug Ates", description: "Official portfolio of Berktug Berke Ates", start_url: "/", display: "standalone", background_color: "#ffffff", theme_color: "#ffffff", icons: [{ src: "/manifest-icon.webp", sizes: "512x512", type: "image/webp" }] }; }
