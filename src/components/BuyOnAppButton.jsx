import React, { useState } from "react";
import { openApp, isMobileDevice } from "../utils/deepLinks";
import { DesktopQRModal } from "./DesktopQRModal";
import { Smartphone, QrCode } from "lucide-react";

export function BuyOnAppButton({
  productId,
  productName = "Product",
  isAvailable = true,
}) {
  const [showQRModal, setShowQRModal] = useState(false);

  const handleClick = () => {
    if (!isAvailable) return;

    // Android: opens the product in WeaveHub, or the Play Store if it isn't installed.
    // A computer (or an iPhone, until the iOS app exists) gets the QR code.
    const result = openApp({ productId });
    if (result === "desktop" || result === "ios-unavailable") setShowQRModal(true);
  };

  return (
    <>
      <button
        type="button"
        className="buy-app-btn"
        onClick={handleClick}
        disabled={!isAvailable}
        style={!isAvailable ? { opacity: 0.5, cursor: "not-allowed", background: "var(--text-light)" } : {}}
      >
        {isMobileDevice() ? <Smartphone className="icon" /> : <QrCode className="icon" />}
        <span>{isAvailable ? "Buy on WeaveHub" : "Currently Unavailable"}</span>
      </button>

      <DesktopQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        productId={productId}
        productName={productName}
      />
    </>
  );
}
