import { ImageResponse } from "next/og";

export const alt = "Print Circuit — Printing & Branding in Harare, Zimbabwe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0A0A0C",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <div style={{ width: 48, height: 48, borderRadius: 9999, background: "#00AEEF" }} />
          <div style={{ width: 48, height: 48, borderRadius: 9999, background: "#EC008C" }} />
          <div style={{ width: 48, height: 48, borderRadius: 9999, background: "#FFF200" }} />
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1 }}>
          Print Circuit
        </div>
        <div style={{ fontSize: 40, color: "#A1A1AA", marginTop: 24 }}>
          Printing, branding & signage in Harare, Zimbabwe
        </div>
      </div>
    ),
    { ...size },
  );
}
