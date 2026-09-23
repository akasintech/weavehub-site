import React from "react";
import { formatCurrency } from "../utils/helpers";

export function ProductVariants({
  variants = [],
  selectedVariant = null,
  onSelectVariant,
}) {
  if (!Array.isArray(variants) || variants.length <= 1) {
    return null;
  }

  // Check if variants have distinct attributes
  const hasNamedAttributes = variants.some(
    (v) => Array.isArray(v.attributes) && v.attributes.length > 0
  );

  return (
    <div className="variants-container">
      <div className="variant-title">
        Select Variant {selectedVariant?.sku ? `(${selectedVariant.sku})` : ""}
      </div>

      <div className="variant-options">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const available = variant?.inventory?.available ?? 0;
          const isAvailable = available > 0 && variant.isActive;

          // Build readable label: attributes like "Color: Red, Size: M" or SKU
          let label = "";
          if (Array.isArray(variant.attributes) && variant.attributes.length > 0) {
            label = variant.attributes
              .map((a) => (a.name ? `${a.name}: ${a.value}` : a.value))
              .join(" / ");
          }
          if (!label) {
            label = variant.sku || `Variant ${variant.id.slice(-4)}`;
          }

          return (
            <button
              key={variant.id}
              type="button"
              disabled={!isAvailable}
              className={`variant-btn ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectVariant(variant)}
              title={
                !isAvailable
                  ? "This variant is currently out of stock"
                  : `${label} - ${formatCurrency(variant.discountedPrice || variant.price)}`
              }
            >
              <span>{label}</span>
              {variant.price ? (
                <span
                  style={{
                    marginLeft: "6px",
                    fontSize: "12px",
                    color: isSelected ? "var(--primary-dark)" : "var(--text-light)",
                  }}
                >
                  ({formatCurrency(variant.discountedPrice || variant.price)})
                </span>
              ) : null}
              {!isAvailable && (
                <span style={{ marginLeft: "6px", fontSize: "11px", color: "var(--danger)" }}>
                  (Sold out)
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
