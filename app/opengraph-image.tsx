import { ImageResponse } from "next/og";
export const dynamic = "force-static";
export const alt = "Berktug Berke Ates — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#fafafa", color: "#18181b", fontFamily: "monospace" }}><div style={{ fontSize: 30, color: "#71717a", marginBottom: 24 }}>PORTFOLIO / SOFTWARE ENGINEER</div><div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -4 }}>Berktug Berke Ates</div><div style={{ fontSize: 34, color: "#52525b", marginTop: 28 }}>Full-stack products · AI · Health Tech</div></div>, size); }
