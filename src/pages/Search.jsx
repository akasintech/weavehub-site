import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsPage } from "../api/products";
import { ProductGrid } from "../components/ProductGrid";
import { SearchBar } from "../components/SearchBar";
import { EmptyState, LoadMore } from "../components/States";
import { useDebouncedValue, usePagedList } from "../hooks/useApi";
import { updateSEO } from "../utils/seo";

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const debouncedQuery = useDebouncedValue(query).trim();
  const lastPushedQuery = useRef(queryParam);

  useEffect(() => {
    updateSEO({
      title: queryParam ? `Search: "${queryParam}" | WeaveHub` : "Search Marketplace | WeaveHub",
      description: "Search for handmade products, artisan vendors, and craft goods on WeaveHub.",
    });
  }, [queryParam]);

  // A URL change we didn't make (the navbar search, Back) overrides the box.
  useEffect(() => {
    if (queryParam !== lastPushedQuery.current) {
      lastPushedQuery.current = queryParam;
      setQuery(queryParam);
    }
  }, [queryParam]);

  // Keep the URL in step with the debounced search box.
  useEffect(() => {
    if (debouncedQuery === lastPushedQuery.current) return;
    lastPushedQuery.current = debouncedQuery;
    setSearchParams(debouncedQuery ? { q: debouncedQuery } : {}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const list = usePagedList(
    debouncedQuery ? `search:${debouncedQuery}` : null,
    ({ page, signal }) => getProductsPage({ page, name: debouncedQuery, signal }),
    { enabled: Boolean(debouncedQuery) }
  );

  const hasSearched = Boolean(debouncedQuery);
  const settled = hasSearched && !list.loading && !list.error;

  return (
    <div className="page">
      <div className="container">
        <div className="search-hero">
          <div className="section-badge">Discovery</div>
          <h1 className="section-title">Search WeaveHub</h1>
          <p className="page-head-sub">Find handmade crafts, artisan fashion, pottery, decor, and more.</p>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={setQuery}
            placeholder="Try 'braids', 'basket', 'ceramic'..."
          />
        </div>

        {settled ? (
          <div className="list-note" aria-live="polite">
            Found <strong>{list.total}</strong> result{list.total === 1 ? "" : "s"} for "<strong>{debouncedQuery}</strong>"
          </div>
        ) : null}

        {hasSearched ? (
          <>
            <ProductGrid
              products={list.items}
              loading={list.loading}
              error={list.error}
              onRetry={list.retry}
              emptyTitle={`No results for "${debouncedQuery}"`}
              emptyMessage="Try checking your spelling, using more general terms, or exploring our product categories."
            />
            <LoadMore list={list} />
          </>
        ) : (
          <EmptyState
            title="Ready to explore?"
            message="Type a search term above to search thousands of products across verified maker storefronts."
          />
        )}
      </div>
    </div>
  );
}
