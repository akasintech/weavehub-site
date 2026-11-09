import React, { useEffect } from "react";
import { Store } from "lucide-react";
import { getStoresPage } from "../api/stores";
import { TTL } from "../api/cache";
import { StoreCard, StoreCardSkeleton } from "../components/StoreCard";
import { EmptyState, ErrorState, LoadMore } from "../components/States";
import { usePagedList } from "../hooks/useApi";
import { updateSEO } from "../utils/seo";

export function Stores() {
  const list = usePagedList("stores", ({ page, signal }) => getStoresPage({ page, signal }), { ttl: TTL.long });

  useEffect(() => {
    updateSEO({
      title: "Artisan Stores | WeaveHub",
      description: "Browse independent artisan stores on WeaveHub and shop straight from the makers.",
    });
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-head">
          <div className="section-badge">Top makers</div>
          <h1 className="section-title">Artisan Stores</h1>
          <p className="page-head-sub">Shop straight from the artisans.</p>
        </div>

        {list.loading ? (
          <div className="store-grid" aria-label="Loading stores">
            {Array.from({ length: 8 }).map((_, i) => (
              <StoreCardSkeleton key={i} />
            ))}
          </div>
        ) : list.error ? (
          <ErrorState title="Unable to load stores" error={list.error} onRetry={list.retry} />
        ) : !list.items.length ? (
          <EmptyState icon={Store} title="No stores yet" message="New makers are joining soon. Check back shortly." />
        ) : (
          <div className="store-grid">
            {list.items.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
        <LoadMore list={list} className="store-grid" endText="That's every store on WeaveHub for now" />
      </div>
    </div>
  );
}
