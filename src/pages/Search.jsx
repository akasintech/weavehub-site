import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../api/products";
import { getCategories } from "../api/categories";
import { ProductGrid } from "../components/ProductGrid";
import { SearchBar } from "../components/SearchBar";
import { updateSEO } from "../utils/seo";

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    updateSEO({
      title: queryParam ? `Search: "${queryParam}" | WeaveHub` : "Search Marketplace | WeaveHub",
      description: "Search for handmade products, artisan vendors, and craft goods on WeaveHub.",
    });

    if (queryParam.trim()) {
      setQuery(queryParam);
      performSearch(queryParam);
    } else {
      setProducts([]);
      setHasSearched(false);
    }
  }, [queryParam]);

  const performSearch = async (searchTerm) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setProducts([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      let categories = [];
      try {
        categories = await getCategories();
      } catch {
        // Non-fatal
      }

      const results = await searchProducts(trimmed, categories);
      setProducts(results);
    } catch (err) {
      console.error("Search failed:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (val) => {
    const trimmed = val.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div style={{ paddingTop: "calc(var(--nav-h) + 24px)", paddingBottom: "64px" }}>
      <div className="container">
        <div style={{ maxWidth: "600px", margin: "0 auto 36px", textAlign: "center" }}>
          <div className="section-badge">Discovery</div>
          <h1 className="section-title" style={{ marginBottom: "12px" }}>
            Search WeaveHub
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "20px" }}>
            Find handmade crafts, artisan fashion, pottery, decor, and more.
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={handleSearchSubmit}
              placeholder="Try 'braids', 'basket', 'ceramic'..."
            />
          </div>
        </div>

        {hasSearched && (
          <div style={{ marginBottom: "20px", fontSize: "14px", color: "var(--text-muted)" }}>
            {!loading && !error && (
              <span>
                Found <strong>{products.length}</strong> result{products.length === 1 ? "" : "s"} for "<strong>{queryParam}</strong>"
              </span>
            )}
          </div>
        )}

        {hasSearched ? (
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            onRetry={() => performSearch(queryParam)}
            emptyTitle={`No results for "${queryParam}"`}
            emptyMessage="Try checking your spelling, using more general terms, or exploring our product categories."
          />
        ) : (
          <div className="state-box" style={{ marginTop: "20px" }}>
            <h3 className="state-title">Ready to explore?</h3>
            <p className="state-desc">Type a search term above to search thousands of products across verified maker storefronts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
