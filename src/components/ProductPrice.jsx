import React from "react";
import { formatCurrency } from "../utils/helpers";

export function ProductPrice({ price, discountedPrice, size = "md" }) {
  const hasDiscount =
    discountedPrice != null &&
    Number(discountedPrice) > 0 &&
    Number(discountedPrice) < Number(price);

  const currentPrice = hasDiscount ? discountedPrice : price;
  const originalPrice = hasDiscount ? price : null;

  const percentOff =
    hasDiscount && originalPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  if (size === "lg") {
    return (
      <div className="product-page-price-box">
        <span className="price-display-lg">{formatCurrency(currentPrice)}</span>
        {hasDiscount && (
          <>
            <span className="price-strike-lg">{formatCurrency(originalPrice)}</span>
            <span className="price-save-badge">{percentOff}% OFF</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap" }}>
      <span className="price-current">{formatCurrency(currentPrice)}</span>
      {hasDiscount && (
        <span className="price-original">{formatCurrency(originalPrice)}</span>
      )}
    </div>
  );
}
