import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/categories";
import { CategoryCard } from "../components/CategoryCard";
import { updateSEO } from "../utils/seo";
import { AlertCircle, RotateCw } from "lucide-react";

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    updateSEO({
      title: "Product Categories | WeaveHub",
      description:
        "Explore curated collections of authentic handcrafted goods, fashion, braids, pottery, and art on WeaveHub.",
    });

    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Categories error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "calc(var(--nav-h) + 24px)", paddingBottom: "64px" }}>
      <div className="container">
        <div style={{ marginBottom: "32px" }}>
          <div className="section-badge">Directory</div>
          <h1 className="section-title" style={{ marginBottom: "8px" }}>
            Marketplace Categories
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
            Discover handmade treasures organized by artisan craftsmanship.
          </p>
        </div>

        {loading ? (
          <div className="category-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: "140px", borderRadius: "14px" }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="state-box">
            <div className="state-icon error">
              <AlertCircle size={32} />
            </div>
            <h3 className="state-title">Unable to load categories</h3>
            <p className="state-desc">{error.message || "Failed to fetch categories."}</p>
            <button type="button" onClick={loadCategories} className="btn btn-primary">
              <RotateCw size={16} />
              <span>Try Again</span>
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="state-box">
            <h3 className="state-title">No categories available</h3>
            <p className="state-desc">Categories will appear here once registered on the marketplace.</p>
          </div>
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
