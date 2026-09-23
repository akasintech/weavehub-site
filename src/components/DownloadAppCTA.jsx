import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { ANDROID_STORE_URL, IOS_STORE_URL, WEBSITE_URL } from "../utils/deepLinks";

export function DownloadAppCTA() {
  const downloadPageUrl = `${WEBSITE_URL}/download`;

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
              Join thousands of shoppers and artisans on WeaveHub today. Available on iOS and Android.
            </p>

            <div className="download-buttons">
              <a
                href={IOS_STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="store-btn"
                aria-label="Download on App Store"
              >
                <svg
                  className="icon"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-16.9 75.8-16.9 31.8 0 48.3 16.9 76.4 16.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <div>
                  <div className="store-btn-sub">Download on the</div>
                  <div className="store-btn-main">App Store</div>
                </div>
              </a>

              <a
                href={ANDROID_STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="store-btn"
                aria-label="Get it on Google Play"
              >
                <svg
                  className="icon"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.88,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55" />
                </svg>
                <div>
                  <div className="store-btn-sub">Get it on</div>
                  <div className="store-btn-main">Google Play</div>
                </div>
              </a>
            </div>

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
                  value={downloadPageUrl}
                  size={120}
                  level="M"
                  bgColor="#FFFFFF"
                  fgColor="#0F172A"
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
