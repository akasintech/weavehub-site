import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { getProductsPage } from "../api/products";
import { Chip, ChipRow } from "../components/ChipRow";
import { ProductGrid } from "../components/ProductGrid";
import { SearchBar } from "../components/SearchBar";
import { LoadMore } from "../components/States";
import { useCategories, useDebouncedValue, usePagedList } from "../hooks/useApi";
import { getProductPricing } from "../utils/helpers";
import { updateSEO } from "../utils/seo";

const OBJECT_ID = /^[a-f\d]{24}$/i;
const priceOf = (product) => getProductPricing(product).price;

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";
  const queryParam = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortBy, setSortBy] = useState("default");
  const debouncedQuery = useDebouncedValue(searchQuery).trim();
  const lastPushedQuery = useRef(queryParam);

  const categories = useCategories();
  const categoryList = categories.data || [];

  useEffect(() => {
    updateSEO({
      title: "All Products | WeaveHub Storefront",
      description:
        "Browse artisan products, handcrafted goods, beauty, crafts and more from verified makers across WeaveHub.",
    });
  }, []);

  const updateParams = useCallback(
    (mutate) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          mutate(next);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // A URL change we didn't make (Back, a link) overrides the search box.
  useEffect(() => {
    if (queryParam !== lastPushedQuery.current) {
      lastPushedQuery.current = queryParam;
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  // Keep the URL in step with the debounced search box.
  useEffect(() => {
    if (debouncedQuery === lastPushedQuery.current) return;
    lastPushedQuery.current = debouncedQuery;
    updateParams((next) => {
      if (debouncedQuery) next.set("q", debouncedQuery);
      else next.delete("q");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  // Old links may carry a category name. The server filter needs an id.
  const categoryId =
    selectedCategory === "all"
      ? ""
      : OBJECT_ID.test(selectedCategory)
      ? selectedCategory
      : categoryList.find((c) => c.name.toLowerCase() === selectedCategory.toLowerCase())?.id || "";
  const waitingForCategory = selectedCategory !== "all" && !categoryId;

  const list = usePagedList(
    `products:${categoryId}:${debouncedQuery}`,
    ({ page, signal }) => getProductsPage({ page, categoryId, name: debouncedQuery, signal }),
    { enabled: !waitingForCategory }
  );

  const handleCategorySelect = (catId) => {
    updateParams((next) => {
      if (catId === "all") next.delete("category");
      else next.set("category", catId);
    });
  };

  const handleSearchSubmit = (val) => setSearchQuery(val);

  const sortedProducts = useMemo(() => {
    const items = [...list.items];
    if (sortBy === "price-low") items.sort((a, b) => priceOf(a) - priceOf(b));
    else if (sortBy === "price-high") items.sort((a, b) => priceOf(b) - priceOf(a));
    else if (sortBy === "name") items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }, [list.items, sortBy]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div className="section-badge">Storefront</div>
          <h1 className="section-title">Artisan Marketplace</h1>
          <p className="page-head-sub">
            Explore verified artisan items. Tap any product to view details and open directly in the WeaveHub app.
          </p>
        </div>

        <div className="products-controls">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearchSubmit}
            placeholder="Search by keyword, product name, maker..."
          />

          <div className="sort-wrap">
            <SlidersHorizontal size={16} aria-hidden="true" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              aria-label="Sort products"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="chips-sticky chips-sticky--page">
          <ChipRow loading={categories.loading} error={categories.error} onRetry={categories.refetch}>
            <Chip active={selectedCategory === "all"} onClick={() => handleCategorySelect("all")}>
              All Products
            </Chip>
            {categoryList.map((cat) => (
              <Chip key={cat.id} active={selectedCategory === cat.id} onClick={() => handleCategorySelect(cat.id)}>
                {cat.name}
              </Chip>
            ))}
          </ChipRow>
        </div>

        {sortBy !== "default" && list.hasNext ? (
          <p className="list-note">Sorted across the {list.items.length} products loaded so far.</p>
        ) : null}

        <ProductGrid
          products={sortedProducts}
          loading={list.loading || (waitingForCategory && categories.loading)}
          error={list.error}
          onRetry={list.retry}
          emptyTitle="No products match your criteria"
          emptyMessage="Try clearing your search query or selecting a different category."
        />
        <LoadMore list={list} />
      </div>
    </div>
  );
}
