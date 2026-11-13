import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { getAppOpenUrl } from "../utils/deepLinks";
import { StoreButtons } from "./StoreButtons";

export function DownloadAppCTA() {
  const appUrl = getAppOpenUrl();

  return (
    <section className="section download-section" aria-labelledby="download-heading">
      <div className="container">
        <div className="download-card">
          <div className="download-content">
            <img src="/icon.png" alt="WeaveHub App Icon" className="download-icon" />
            <h2 id="download-heading" className="download-title">
              Ready to start shopping?
            </h2>
            <p className="download-subtitle">
              Join thousands of shoppers and artisans on WeaveHub today. Available now on Android, coming soon to iPhone.
            </p>

            <StoreButtons />

            <div style={{ marginTop: "32px", display: "inline-block" }}>
              <div
                style={{
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "14px",
                  display: "inline-block",
                }}
              >
                <QRCodeSVG
                  value={appUrl}
                  size={120}
                  level="M"
                  bgColor="#FFFFFF"
                  fgColor="#0E1B2C"
                />
              </div>
              <p style={{ color: "#94A3B8", fontSize: "12px", marginTop: "8px" }}>
                Scan to download WeaveHub
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
