import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone } from "lucide-react";
import { StoreButtons } from "../components/StoreButtons";
import { getAppOpenUrl, openApp } from "../utils/deepLinks";
import { updateSEO } from "../utils/seo";

/**
 * Where every QR code points. On Android it opens WeaveHub (or the Play Store
 * when it isn't installed) straight away; on a computer it shows the QR code.
 */
export function AppRedirect() {
  const [params] = useSearchParams();
  const productId = params.get("product") || undefined;
  const [result, setResult] = useState(null);

  useEffect(() => {
    updateSEO({ title: "Open WeaveHub", description: "Open the WeaveHub app, or get it on Google Play." });
    setResult(openApp({ productId }));
  }, [productId]);

  const heading =
    result === "android" || result === "ios"
      ? "Opening WeaveHub…"
      : result === "ios-unavailable"
        ? "WeaveHub is coming to iPhone"
        : "Get the WeaveHub app";

  const message =
    result === "android" || result === "ios"
      ? "If the app doesn't open in a few seconds, use the button below."
      : result === "ios-unavailable"
        ? "The app is available on Android today and coming soon to the App Store. You can keep shopping on this website meanwhile."
        : "Scan this code with your phone's camera to open WeaveHub, or install it from Google Play.";

  return (
    <div style={{ paddingTop: "calc(var(--nav-h) + 48px)", paddingBottom: "80px" }}>
      <div className="container" style={{ maxWidth: "520px", textAlign: "center" }}>
        <div className="state-box">
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
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
          <h1 className="section-title" style={{ fontSize: 24, marginBottom: 8 }}>
            {heading}
          </h1>
          <p className="section-subtitle" style={{ fontSize: 14, marginBottom: 24 }}>
            {message}
          </p>

          {result === "desktop" ? (
            <div className="qr-frame" style={{ marginBottom: 20 }}>
              <QRCodeSVG value={getAppOpenUrl(productId)} size={190} level="M" includeMargin bgColor="#FFFFFF" fgColor="#0E1B2C" />
            </div>
          ) : null}

          <StoreButtons productId={productId} />
        </div>
      </div>
    </div>
  );
}
