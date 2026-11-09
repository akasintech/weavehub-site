import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { TTL } from "../api/cache";
import { getCategories, getCategoryById } from "../api/categories";
import { getProductsPage } from "../api/products";
import { ProductGrid } from "../components/ProductGrid";
import { LoadMore } from "../components/States";
import { usePagedList, useQuery } from "../hooks/useApi";
import { updateSEO } from "../utils/seo";

async function loadCategory(id, signal) {
  try {
    return await getCategoryById(id, { signal });
  } catch (error) {
    if (signal.aborted) throw error;
    // Fall back to the list, which also accepts an old name-based link.
    const all = await getCategories({ signal });
    return all.find((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase()) || null;
  }
}

export function Category() {
  const { id } = useParams();
  const { data: category } = useQuery(`category:${id}`, (signal) => loadCategory(id, signal), { ttl: TTL.long });
  const list = usePagedList(`category-products:${id}`, ({ page, signal }) =>
    getProductsPage({ page, categoryId: id, signal })
  );

  const categoryName = category?.name;

  useEffect(() => {
    if (!categoryName) return;
    updateSEO({
      title: `${categoryName} | WeaveHub`,
      description: `Explore authentic handcrafted items in ${categoryName} on WeaveHub.`,
    });
  }, [categoryName]);

  return (
    <div className="page">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link to="/categories">Categories</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="breadcrumb-current">{categoryName || "Category"}</span>
        </nav>

        <div className="page-head page-head--split">
          <div>
            <div className="section-badge">Collection</div>
            <h1 className="section-title">{categoryName || "Collection"}</h1>
            <p className="page-head-sub">
              {category?.description || "Browse handcrafted items in this artisan category."}
            </p>
          </div>

          <Link to="/categories" className="btn btn-outline btn-sm">
            <ArrowLeft size={14} aria-hidden="true" />
            <span>All Categories</span>
          </Link>
        </div>

        <ProductGrid
          products={list.items}
          loading={list.loading}
          error={list.error}
          onRetry={list.retry}
          emptyTitle={`No products found in ${categoryName || "this category"}`}
          emptyMessage="Vendors are continually adding new artisan creations to this collection."
        />
        <LoadMore list={list} />
      </div>
    </div>
  );
}
