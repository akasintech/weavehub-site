import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { X, Smartphone } from "lucide-react";
import {
  getAppOpenUrl,
  getDevicePlatform,
  IOS_AVAILABLE,
} from "../utils/deepLinks";
import { StoreButtons } from "./StoreButtons";

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

  const openUrl = getAppOpenUrl(productId);
  const onIphone = getDevicePlatform() === "ios" && !IOS_AVAILABLE;

  // Portalled so an animated or transformed ancestor can't trap the fixed overlay.
  return createPortal(
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
            fgColor="#0E1B2C"
          />
        </div>

        <p style={{ fontSize: "12px", color: "var(--text-light)", marginBottom: "20px" }}>
          Link: <code style={{ wordBreak: "break-all", background: "var(--bg-alt)", padding: "2px 6px", borderRadius: "4px" }}>{openUrl}</code>
        </p>

        {onIphone ? (
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
            WeaveHub is on Android today and coming soon to iPhone. Scan this from an Android phone, or keep shopping here.
          </p>
        ) : null}
        <StoreButtons productId={productId} />
      </div>
    </div>,
    document.body
  );
}
