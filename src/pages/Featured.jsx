import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { getAllFeaturedProducts } from "../api/products";
import { ProductGrid } from "../components/ProductGrid";
import { useQuery } from "../hooks/useApi";
import { updateSEO } from "../utils/seo";

export function Featured() {
  const featured = useQuery("featured:all", () => getAllFeaturedProducts());
  const products = featured.data || [];

  useEffect(() => {
    updateSEO({
      title: "Featured Picks | WeaveHub",
      description: "Hand-picked handmade fashion, fabrics and crafts from WeaveHub's artisans.",
    });
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div className="section-badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={13} aria-hidden="true" /> Hand-picked
          </div>
          <h1 className="section-title">Featured Picks</h1>
          <p className="page-head-sub">
            Standout pieces chosen by the WeaveHub team.
            {products.length ? ` ${products.length} item${products.length === 1 ? "" : "s"} right now.` : ""}
          </p>
        </div>

        <ProductGrid
          products={products}
          loading={featured.loading && !products.length}
          error={products.length ? null : featured.error}
          onRetry={featured.refetch}
          emptyTitle="No featured picks right now"
          emptyMessage="New highlights are added regularly. In the meantime, browse everything on WeaveHub."
        />

        {!featured.loading && !products.length && !featured.error ? (
          <div className="center-action">
            <Link to="/products" className="btn btn-primary btn-lg">
              <span>Browse all products</span>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
