import React from "react";
import { Link } from "react-router-dom";
import { ProductPrice } from "./ProductPrice";
import { Store, Tag } from "lucide-react";

export function ProductCard({ product }) {
  if (!product) return null;

  const {
    id,
    name,
    price,
    discountedPrice,
    image,
    category,
    storeName,
    storeLogo,
    isAvailable,
    stock,
  } = product;

  const hasDiscount =
    discountedPrice != null &&
    Number(discountedPrice) > 0 &&
    Number(discountedPrice) < Number(price);

  const percentOff =
    hasDiscount && price
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0;

  return (
    <article className="product-card">
      <Link
        to={`/products/${id}`}
        aria-label={`View details for ${name}`}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <div className="product-card-img-wrap">
          <img
            src={image || "/banner1.jpg"}
            alt={name}
            className="product-card-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/banner1.jpg";
            }}
          />

          <div className="product-card-badge-wrap">
            {hasDiscount && (
              <span className="badge-discount">{percentOff}% OFF</span>
            )}
            {!isAvailable && (
              <span className="badge-out-of-stock">Out of Stock</span>
            )}
            {isAvailable && stock > 0 && stock <= 3 && (
              <span className="badge-out-of-stock" style={{ background: "var(--warning)" }}>
                Only {stock} left
              </span>
            )}
          </div>
        </div>

        <div className="product-card-body">
          <div className="product-card-vendor">
            {storeLogo ? (
              <img
                src={storeLogo}
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Store size={14} />
            )}
            <span>{storeName || "WeaveHub Artisan"}</span>
          </div>

          <h3 className="product-card-title">{name}</h3>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            <Tag size={12} style={{ color: "var(--text-light)" }} />
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {category || "Craft"}
            </span>
          </div>

          <div className="product-card-footer">
            <ProductPrice price={price} discountedPrice={discountedPrice} />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--secondary)",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              View →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
