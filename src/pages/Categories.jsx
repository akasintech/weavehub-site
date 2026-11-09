import React, { useEffect } from "react";
import { CategoryCard, CategoryCardSkeleton } from "../components/CategoryCard";
import { EmptyState, ErrorState } from "../components/States";
import { useCategories } from "../hooks/useApi";
import { updateSEO } from "../utils/seo";

export function Categories() {
  const { data: categories = [], loading, error, refetch } = useCategories();

  useEffect(() => {
    updateSEO({
      title: "Product Categories | WeaveHub",
      description:
        "Explore curated collections of authentic handcrafted goods, fashion, braids, pottery, and art on WeaveHub.",
    });
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div className="section-badge">Directory</div>
          <h1 className="section-title">Marketplace Categories</h1>
          <p className="page-head-sub">Discover handmade treasures organized by artisan craftsmanship.</p>
        </div>

        {loading ? (
          <div className="category-grid" aria-label="Loading categories">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState title="Unable to load categories" error={error} onRetry={refetch} />
        ) : categories.length === 0 ? (
          <EmptyState
            title="No categories available"
            message="Categories will appear here once registered on the marketplace."
          />
        ) : (
          <div className="category-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
