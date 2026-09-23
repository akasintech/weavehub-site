import React, { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Smartphone, ExternalLink } from "lucide-react";
import {
  getWebProductOpenUrl,
  ANDROID_STORE_URL,
  IOS_STORE_URL,
} from "../utils/deepLinks";

export function DesktopQRModal({
  isOpen,
  onClose,
  productId,
  productName = "Product",
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const openUrl = getWebProductOpenUrl(productId);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "var(--primary-light)",
            color: "var(--primary-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}
        >
          <Smartphone size={24} />
        </div>

        <h3 id="qr-modal-title" className="section-title" style={{ fontSize: "22px", marginBottom: "8px" }}>
          Get this on WeaveHub
        </h3>
        <p className="section-subtitle" style={{ fontSize: "14px", marginBottom: "16px" }}>
          Scan this QR code with your phone camera to open <strong>{productName}</strong> directly inside the WeaveHub mobile app.
        </p>

        <div className="qr-frame">
          <QRCodeSVG
            value={openUrl}
            size={190}
            level="M"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#0F172A"
          />
        </div>

        <p style={{ fontSize: "12px", color: "var(--text-light)", marginBottom: "20px" }}>
          Link: <code style={{ wordBreak: "break-all", background: "var(--bg-alt)", padding: "2px 6px", borderRadius: "4px" }}>{openUrl}</code>
        </p>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={ANDROID_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm"
          >
            Google Play <ExternalLink size={12} />
          </a>
          <a
            href={IOS_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-sm"
          >
            App Store <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
