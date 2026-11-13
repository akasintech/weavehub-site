import React, { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getAppOpenUrl } from "../utils/deepLinks";
import { StoreButtons } from "../components/StoreButtons";
import { updateSEO } from "../utils/seo";
import { Smartphone, Sparkles, Video, MessageCircle, Wallet, ShieldCheck } from "lucide-react";

export function Download() {
  const appUrl = getAppOpenUrl();

  useEffect(() => {
    updateSEO({
      title: "Download the WeaveHub App | Android",
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

            <StoreButtons />

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
                  value={appUrl}
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
