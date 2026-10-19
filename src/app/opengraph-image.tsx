import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Convaudit — Images, PDFs and YouTube Creator Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default OpenGraph image for the site (home page, legal pages, etc.).
 * Route: /opengraph-image
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          backgroundColor: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              backgroundColor: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
              color: "#0a0a0a",
            }}
          >
            C
          </div>
          <div style={{ display: "flex", color: "#fafafa", fontSize: "32px", fontWeight: 600 }}>
            Convaudit
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              color: "#fafafa",
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            Images, PDFs & YouTube Creator Tools
          </div>
          <div
            style={{
              display: "flex",
              color: "#a3a3a3",
              fontSize: "28px",
            }}
          >
            Free tools for images, PDFs and YouTube creators. Check each tool&apos;s data-use badge.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#525252",
            fontSize: "22px",
          }}
        >
          <div style={{ display: "flex" }}>convaudit.com</div>
          <div style={{ display: "flex" }}>Tool-specific processing disclosures</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
