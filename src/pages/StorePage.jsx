import React, { useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { BadgeCheck, Smartphone, Store } from "lucide-react";
import { TTL } from "../api/cache";
import { getStoreProductsPage } from "../api/products";
import { findStoreById } from "../api/stores";
import { ProductGrid } from "../components/ProductGrid";
import { EmptyState, ErrorState, LoadMore } from "../components/States";
import { MediaImage, Skeleton } from "../components/ui";
import { usePagedList, useQuery } from "../hooks/useApi";
import { getProductPricing } from "../utils/helpers";
import { updateSEO } from "../utils/seo";

export function StorePage() {
  const { id } = useParams();
  return <StoreView key={id} id={id} />;
}

function StoreView({ id }) {
  const location = useLocation();
  const seed = location.state?.store?.id === id ? location.state.store : null;

  const storeQuery = useQuery(`store:${id}`, (signal) => findStoreById(id, { signal }), { ttl: TTL.long });
  const list = usePagedList(`store-products:${id}`, ({ page, signal }) => getStoreProductsPage(id, { page, signal }));

  const store = storeQuery.data || seed;
  const name = store?.name;

  useEffect(() => {
    if (!name) return;
    updateSEO({
      title: `${name} | WeaveHub`,
      description: store?.description?.slice(0, 160) || `Shop handmade products from ${name} on WeaveHub.`,
      image: store?.logo || undefined,
    });
  }, [name, store?.description, store?.logo]);

  const onSale = useMemo(
    () => list.items.filter((p) => getProductPricing(p).discountPct > 0).length,
    [list.items]
  );

  const storeMissing = !store && !storeQuery.loading && !storeQuery.error;

  if (storeMissing && !list.loading && !list.items.length) {
    return (
      <div className="page">
        <div className="container">
          {list.error ? (
            <ErrorState title="Unable to load this store" error={list.error} onRetry={list.retry} />
          ) : (
            <EmptyState icon={Store} title="Store not found" message="This store may have moved or is no longer public.">
              <Link to="/stores" className="btn btn-primary btn-sm">
                See all stores
              </Link>
            </EmptyState>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="store-page">
      <div className="store-banner">
        {store?.banner ? <MediaImage src={store.banner} alt="" className="store-banner-img" eager /> : null}
        <div className="store-banner-shade" />
      </div>

      <div className="container">
        <div className="store-identity">
          <div className="store-logo">
            {store?.logo ? <MediaImage src={store.logo} alt="" iconSize={24} /> : <Store size={30} aria-hidden="true" />}
          </div>
          <Link to="/download" className="btn btn-primary btn-sm">
            <Smartphone size={15} aria-hidden="true" />
            <span>Get the App</span>
          </Link>
        </div>

        <div className="store-title">
          {name ? (
            <h1>{name}</h1>
          ) : storeQuery.loading ? (
            <Skeleton width={200} height={24} />
          ) : (
            <h1>Store</h1>
          )}
          {store?.verified ? <BadgeCheck size={18} aria-hidden="true" /> : null}
        </div>

        {store?.tagLine || store?.description ? (
          <p className="store-about">
            {store.tagLine ? `${store.tagLine}${store.description ? " · " : ""}` : ""}
            {store.description}
          </p>
        ) : null}

        {storeQuery.error && !store ? (
          <ErrorState compact title="Unable to load store details" error={storeQuery.error} onRetry={storeQuery.refetch} />
        ) : null}

        <div className="store-stats">
          <div>
            <strong>{list.loading ? "–" : list.total}</strong>
            <span>Products</span>
          </div>
          <div>
            <strong>
              {list.loading ? "–" : onSale}
              {list.hasNext ? "+" : ""}
            </strong>
            <span>On sale</span>
          </div>
        </div>

        <h2 className="store-products-title">All products</h2>

        <ProductGrid
          products={list.items}
          loading={list.loading}
          error={list.error}
          onRetry={list.retry}
          emptyTitle="No products yet"
          emptyMessage="This store hasn't published anything yet. Check back soon."
        />
        <LoadMore list={list} />
      </div>
    </div>
  );
}
