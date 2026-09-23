import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { SearchBar } from "../components/SearchBar";
import { getProducts } from "../api/products";
import { getCategories } from "../api/categories";
import { updateSEO } from "../utils/seo";
import { SlidersHorizontal } from "lucide-react";

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    updateSEO({
      title: "All Products | WeaveHub Storefront",
      description:
        "Browse artisan products, handcrafted goods, beauty, crafts and more from verified makers across WeaveHub.",
    });

    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.warn("Categories fetch error:", err.message);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoryId = selectedCategory === "all" ? null : selectedCategory;
      const data = await getProducts({
        categoryId,
        categoriesList: categories,
      });
      setProducts(data);
    } catch (err) {
      console.error("Products error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catId);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (val) => {
    if (val.trim()) {
      searchParams.set("q", val.trim());
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
  };

  // Filter & Sort
  const processedProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.storeName.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, searchQuery, sortBy]);

  return (
    <div style={{ paddingTop: "calc(var(--nav-h) + 24px)", paddingBottom: "64px" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <div className="section-badge">Storefront</div>
          <h1 className="section-title" style={{ marginBottom: "8px" }}>
            Artisan Marketplace
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
            Explore verified artisan items. Tap any product to view details and open directly in the WeaveHub app.
          </p>
        </div>

        {/* Controls: Search & Sort */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearchSubmit}
            placeholder="Search by keyword, product name, maker..."
          />

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <SlidersHorizontal size={16} style={{ color: "var(--text-light)" }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
              style={{
                padding: "8px 32px 8px 14px",
                borderRadius: "var(--radius-full)",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--secondary)",
              }}
              aria-label="Sort products"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="filter-pills" style={{ marginBottom: "32px" }}>
          <button
            type="button"
            className={`filter-pill ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => handleCategorySelect("all")}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-pill ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => handleCategorySelect(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={processedProducts}
          loading={loading}
          error={error}
          onRetry={loadProducts}
          emptyTitle="No products match your criteria"
          emptyMessage="Try clearing your search query or selecting a different category."
        />
      </div>
    </div>
  );
}
