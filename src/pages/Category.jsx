import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts } from "../api/products";
import { getCategoryById, getCategories } from "../api/categories";
import { ProductGrid } from "../components/ProductGrid";
import { updateSEO } from "../utils/seo";
import { ChevronRight, ArrowLeft } from "lucide-react";

export function Category() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategoryData();
  }, [id]);

  const loadCategoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch category meta
      let currentCat = null;
      try {
        currentCat = await getCategoryById(id);
      } catch {
        // Fallback: try finding in categories list
        const all = await getCategories();
        currentCat = all.find((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase());
      }

      const catName = currentCat?.name || "Category";
      setCategory(currentCat || { id, name: catName, description: "" });

      // SEO
      updateSEO({
        title: `${catName} | WeaveHub`,
        description: `Explore authentic handcrafted items in ${catName} on WeaveHub.`,
      });

      // 2. Fetch products in this category
      const items = await getProducts({ categoryId: id });
      setProducts(items);
    } catch (err) {
      console.error("Failed to load category products:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "calc(var(--nav-h) + 24px)", paddingBottom: "64px" }}>
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/categories">Categories</Link>
          <ChevronRight size={14} />
          <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>
            {category?.name || "Category"}
          </span>
        </nav>

        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div className="section-badge">Collection</div>
            <h1 className="section-title" style={{ marginBottom: "8px" }}>
              {category?.name || "Collection"}
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
              {category?.description || "Browse handcrafted items in this artisan category."}
            </p>
          </div>

          <Link to="/categories" className="btn btn-outline btn-sm">
            <ArrowLeft size={14} />
            <span>All Categories</span>
          </Link>
        </div>

        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={loadCategoryData}
          emptyTitle={`No products found in ${category?.name || "this category"}`}
          emptyMessage="Vendors are continually adding new artisan creations to this collection."
        />
      </div>
    </div>
  );
}
