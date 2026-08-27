import { ImageResponse } from "next/og";

export const alt = "Isak Forsberg — Atlas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFFFFF",
          color: "#0A0A0A",
          padding: 56,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1px solid #0A0A0A",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span>Plate 01 · Atlas</span>
          <span>56.0465° N · 12.6945° E</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            Helsingborg, Sweden · Fullstack
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 500,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
            }}
          >
            ISAK FORSBERG
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 16,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          <span>Black ink on white paper, moved by wind.</span>
          <span>isakforsberg.se</span>
        </div>
      </div>
    ),
    size,
  );
}
