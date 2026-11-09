import React from "react";
import { formatCurrency } from "../utils/helpers";
import { Pill } from "./ui";

/** Takes the result of getVariantPricing / getProductPricing. */
export function ProductPrice({ pricing }) {
  const { price, originalPrice, discountPct } = pricing;
  if (!(price > 0)) return null;

  return (
    <div className="product-page-price-box">
      <span className={`price-display-lg ${discountPct ? "is-sale" : ""}`}>{formatCurrency(price)}</span>
      {originalPrice ? <s className="price-strike-lg">{formatCurrency(originalPrice)}</s> : null}
      {discountPct > 0 ? <Pill tone="sale">-{discountPct}%</Pill> : null}
    </div>
  );
}
