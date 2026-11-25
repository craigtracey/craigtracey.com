import { ImageResponse } from "next/og";

export const alt = "Craig Tracey — Founder and engineer. AI and infrastructure.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function Image() {
  return new ImageResponse(
    <div style={{ background: "#080a0f", color: "#f5f7ff", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "74px 80px", justifyContent: "space-between" }}>
      <div style={{ display: "flex", fontSize: 27, color: "#b1ff49" }}>CRAIG TRACEY / FOUNDER & ENGINEER</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 82, letterSpacing: -4, lineHeight: 1.1 }}><span>Founder. Engineer.</span><span style={{ color: "#b1ff49" }}>AI and infrastructure.</span></div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#a1aabd" }}><span>AI · Infrastructure · Product</span><span>craigtracey.com</span></div>
    </div>,
    size,
  );
}
