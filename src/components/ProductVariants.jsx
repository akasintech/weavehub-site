import React from "react";

function variantLabel(variant, index) {
  return (
    (variant?.attributes || [])
      .map((a) => (typeof a === "object" ? a.value : a))
      .filter(Boolean)
      .join(" / ") || `Option ${index + 1}`
  );
}

export function ProductVariants({ variants = [], selectedVariant = null, onSelectVariant }) {
  if (variants.length > 1) {
    return (
      <div className="variants-container">
        <div className="overline">Select Variant</div>
        <div className="variant-options">
          {variants.map((variant, index) => {
            const selected = selectedVariant?.id === variant.id;
            const soldOut = variant.stockKnown && Number(variant.inventory?.available ?? 0) <= 0;
            return (
              <button
                key={variant.id || index}
                type="button"
                className={`variant-btn ${selected ? "selected" : ""} ${soldOut ? "sold-out" : ""}`}
                aria-pressed={selected}
                onClick={() => onSelectVariant(variant)}
              >
                {variantLabel(variant, index)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // One variant: nothing to choose, but its attributes are still worth showing.
  const attributes = (variants[0]?.attributes || []).filter((a) => a?.name && a?.value);
  if (!attributes.length) return null;

  return (
    <dl className="variant-attrs">
      {attributes.map((attribute) => (
        <div key={attribute.name}>
          <dt>{attribute.name}</dt>
          <dd>{attribute.value}</dd>
        </div>
      ))}
    </dl>
  );
}
