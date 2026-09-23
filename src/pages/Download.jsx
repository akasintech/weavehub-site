import React, { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ANDROID_STORE_URL, IOS_STORE_URL, WEBSITE_URL } from "../utils/deepLinks";
import { updateSEO } from "../utils/seo";
import { Smartphone, Sparkles, Video, MessageCircle, Wallet, ShieldCheck } from "lucide-react";

export function Download() {
  const downloadUrl = `${WEBSITE_URL}/download`;

  useEffect(() => {
    updateSEO({
      title: "Download WeaveHub App | iOS & Android",
      description:
        "Download the official WeaveHub mobile app. Shop unique artisan crafts, watch live shopping streams, and support independent makers.",
    });
  }, []);

  return (
    <div style={{ paddingTop: "calc(var(--nav-h) + 36px)", paddingBottom: "80px" }}>
      <div className="container">
        {/* Main Card */}
        <div className="download-card" style={{ marginBottom: "64px" }}>
          <div className="download-content">
            <img src="/icon.png" alt="WeaveHub App Icon" className="download-icon" />
            <h1 className="download-title">
              Experience WeaveHub on Mobile
            </h1>
            <p className="download-subtitle">
              The full artisan marketplace lives in your pocket. Discover handmade goods, join real-time creator live streams, and purchase with buyer protection.
            </p>

            <div className="download-buttons">
              <a
                href={IOS_STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="store-btn"
                aria-label="Download on the App Store"
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

            {/* QR Code */}
            <div style={{ marginTop: "36px", display: "inline-block" }}>
              <div
                style={{
                  background: "#fff",
                  padding: "12px",
                  borderRadius: "16px",
                  display: "inline-block",
                }}
              >
                <QRCodeSVG
                  value={downloadUrl}
                  size={140}
                  level="M"
                  bgColor="#FFFFFF"
                  fgColor="#0F172A"
                />
              </div>
              <p style={{ color: "#94A3B8", fontSize: "13px", marginTop: "10px" }}>
                Scan with your phone to download directly
              </p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="section-header">
          <div className="section-badge">App Highlights</div>
          <h2 className="section-title">Why shop on the WeaveHub App?</h2>
          <p className="section-subtitle">
            Built from the ground up for craft enthusiasts and authentic independent commerce.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-icon-wrap">
                <Video className="icon" />
              </div>
              <h3 className="feature-title">Live Seller Broadcasts</h3>
              <p className="feature-desc">
                Watch artisans demonstrate their craft live, ask questions in the chat, and buy directly while watching.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-icon-wrap">
                <MessageCircle className="icon" />
              </div>
              <h3 className="feature-title">Direct Maker Chat</h3>
              <p className="feature-desc">
                Have custom size, color, or delivery inquiries? Message verified vendors directly via in-app chat.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-icon-wrap">
                <Wallet className="icon" />
              </div>
              <h3 className="feature-title">Instant In-App Wallet</h3>
              <p className="feature-desc">
                Top up your virtual account, store coupons, and checkout in seconds with one tap.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-icon-wrap">
                <ShieldCheck className="icon" />
              </div>
              <h3 className="feature-title">Buyer Protection</h3>
              <p className="feature-desc">
                Every transaction is safeguarded by escrow fulfillment and real-time shipping tracking.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-icon-wrap">
                <Sparkles className="icon" />
              </div>
              <h3 className="feature-title">Exclusive Deals &amp; Coupons</h3>
              <p className="feature-desc">
                Unlock app-only flash sales, seasonal craft discounts, and artisan reward vouchers.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card-inner">
              <div className="feature-icon-wrap">
                <Smartphone className="icon" />
              </div>
              <h3 className="feature-title">Native Performance</h3>
              <p className="feature-desc">
                Optimized for fluid scrolling, instant push notifications, and fast image browsing on iOS &amp; Android.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
