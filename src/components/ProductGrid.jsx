import React from "react";
import { ProductCard } from "./ProductCard";
import { AlertCircle, PackageSearch, RotateCw } from "lucide-react";

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-price" />
    </div>
  );
}

export function ProductGrid({
  products = [],
  loading = false,
  error = null,
  onRetry = null,
  emptyTitle = "No products found",
  emptyMessage = "Try searching for another artisan craft or selecting a different category.",
}) {
  if (loading) {
    return (
      <div className="product-grid" aria-label="Loading products">
        {Array.from({ length: 8 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-box">
        <div className="state-icon error">
          <AlertCircle size={32} />
        </div>
        <h3 className="state-title">Unable to load products</h3>
        <p className="state-desc">
          {typeof error === "string" ? error : error?.message || "An unexpected error occurred while fetching from WeaveHub."}
        </p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn btn-primary">
            <RotateCw size={16} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="state-box">
        <div className="state-icon empty">
          <PackageSearch size={32} />
        </div>
        <h3 className="state-title">{emptyTitle}</h3>
        <p className="state-desc">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
