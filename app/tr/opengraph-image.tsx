import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Berktuğ Berke Ateş — Yazılım Mühendisi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const font = await readFile(
    join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf"),
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#fafafa",
          color: "#18181b",
          fontFamily: "Geist",
        }}
      >
        <div style={{ fontSize: 30, color: "#71717a", marginBottom: 24 }}>PORTFÖY</div>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -4 }}>Berktuğ Berke Ateş</div>
        <div style={{ fontSize: 34, color: "#52525b", marginTop: 28 }}>Yazılım Mühendisi</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist", data: font, style: "normal", weight: 400 }],
    },
  );
}
