import React from "react";
import { ProductCard } from "./ProductCard";
import { EmptyState, ErrorState } from "./States";

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-img" />
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
  skeletonCount = 8,
}) {
  if (loading) {
    return (
      <div className="product-grid" aria-label="Loading products">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Unable to load products" error={error} onRetry={onRetry} />;
  }

  if (!products.length) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
