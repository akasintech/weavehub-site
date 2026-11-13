import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  isMobileDevice,
  getDevicePlatform,
  openProductInApp,
  getWebProductOpenUrl,
} from "../utils/deepLinks";
import { StoreButtons } from "../components/StoreButtons";
import { updateSEO } from "../utils/seo";
import { Smartphone, ArrowRight } from "lucide-react";

export function OpenProduct() {
  const { id } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [fallbackTriggered, setFallbackTriggered] = useState(false);

  const openUrl = getWebProductOpenUrl(id);
  const platform = getDevicePlatform();

  useEffect(() => {
    updateSEO({
      title: "Opening Product in WeaveHub...",
      description: "Redirecting to product in the WeaveHub mobile app.",
    });

    const mobile = isMobileDevice();
    setIsMobile(mobile);

    if (mobile && id) {
      setAttempted(true);
      openProductInApp(id);

      // Show fallback button options after 3s
      const timer = setTimeout(() => {
        setFallbackTriggered(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [id]);

  return (
    <div style={{ paddingTop: "calc(var(--nav-h) + 48px)", paddingBottom: "80px" }}>
      <div className="container" style={{ maxWidth: "520px", textAlign: "center" }}>
        <div className="state-box">
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "var(--primary-light)",
              color: "var(--primary-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Smartphone size={32} />
          </div>

          <h1 className="section-title" style={{ fontSize: "24px", marginBottom: "8px" }}>
            {isMobile ? "Opening WeaveHub..." : "Scan with Your Phone"}
          </h1>

          <p className="section-subtitle" style={{ fontSize: "14px", marginBottom: "24px" }}>
            {isMobile
              ? "We're launching the WeaveHub app on your device to show this product."
              : "Scan this QR code with your mobile camera to open this product in the WeaveHub app."}
          </p>

          {!isMobile && (
            <div className="qr-frame" style={{ margin: "0 auto 20px" }}>
              <QRCodeSVG
                value={openUrl}
                size={180}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#0F172A"
              />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
            {isMobile && (
              <button
                type="button"
                className="btn btn-accent btn-block"
                onClick={() => openProductInApp(id)}
              >
                Tap to Open App
              </button>
            )}

            <Link to={`/products/${id}`} className="btn btn-outline btn-block">
              <span>View Product on Website</span>
              <ArrowRight size={16} />
            </Link>

            {(fallbackTriggered || !isMobile) && (
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <p style={{ fontSize: "12px", color: "var(--text-light)", marginBottom: "12px" }}>
                  Don't have the WeaveHub app installed yet?
                </p>
                <StoreButtons productId={id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
