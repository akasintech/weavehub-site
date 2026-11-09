import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Truck,
} from "lucide-react";
import { TTL } from "../api/cache";
import {
  getAlsoBoughtProducts,
  getProductById,
  getRelatedProducts,
  peekProduct,
  productKey,
} from "../api/products";
import { findStoreById } from "../api/stores";
import { BuyOnAppButton } from "../components/BuyOnAppButton";
import { ProductFeedback } from "../components/ProductFeedback";
import { ProductImageGallery } from "../components/ProductImageGallery";
import { ProductPrice } from "../components/ProductPrice";
import { ProductVariants } from "../components/ProductVariants";
import { ProductRail } from "../components/Rails";
import { MediaImage, Pill, Skeleton } from "../components/ui";
import { useCategories, useQuery } from "../hooks/useApi";
import {
  formatCurrency,
  getProductSlides,
  getVariantPricing,
  withCategoryName,
} from "../utils/helpers";
import { updateSEO } from "../utils/seo";

export function ProductDetails() {
  const { id } = useParams();
  return <ProductView key={id} id={id} />;
}

function DetailsSkeleton() {
  return (
    <div className="page">
      <div className="container">
        <div className="product-detail-layout" aria-label="Loading product">
          <div className="skeleton gallery-skeleton" />
          <div className="product-info-panel">
            <Skeleton width="40%" height={20} />
            <Skeleton width="85%" height={34} />
            <Skeleton width="30%" height={28} />
            <Skeleton height={110} radius={14} />
            <Skeleton height={54} radius={999} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StockPill({ soldOut, lowStock, available, known }) {
  if (!known) return null;
  if (soldOut) return <Pill tone="sale">Sold out</Pill>;
  if (lowStock) return <Pill tone="gold">Low Stock: Only {available} left</Pill>;
  return (
    <Pill tone="brand" icon={Check}>
      In Stock &amp; Ready to Ship
    </Pill>
  );
}

function ProductView({ id }) {
  const { data: fetched, loading, error, refetch } = useQuery(
    productKey(id),
    (signal) => getProductById(id, { signal }),
    { ttl: TTL.short }
  );
  const { data: categories = [] } = useCategories();
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const base = fetched || peekProduct(id);
  const product = useMemo(() => withCategoryName(base, categories), [base, categories]);

  const variants = useMemo(() => {
    const all = product?.variants?.length
      ? product.variants
      : product?.defaultVariant
      ? [product.defaultVariant]
      : [];
    const active = all.filter((v) => v.isActive !== false);
    return active.length ? active : all;
  }, [product]);

  const activeVariant =
    variants.find((v) => v.id === selectedVariantId) ||
    variants.find((v) => v.isDefault) ||
    variants[0] ||
    null;

  const slides = useMemo(
    () => (product ? getProductSlides(product, activeVariant) : []),
    [product, activeVariant]
  );

  const storeId = product?.storeId;
  const storeQuery = useQuery(
    storeId ? `store:${storeId}` : null,
    (signal) => findStoreById(storeId, { signal }),
    { enabled: Boolean(storeId), ttl: TTL.long }
  );

  const related = useQuery(`related:${id}`, (signal) => getRelatedProducts(id, { signal }));
  const alsoBought = useQuery(`also-bought:${id}`, (signal) => getAlsoBoughtProducts(id, { signal }));

  const productName = product?.name;
  const seoImage = product?.image;
  const seoDescription = product?.description;
  const seoStore = product?.storeName;

  useEffect(() => {
    if (!productName) return;
    updateSEO({
      title: `${productName} | WeaveHub`,
      description:
        seoDescription?.slice(0, 160) || `Buy ${productName} handcrafted by ${seoStore} on WeaveHub.`,
      image: seoImage || undefined,
    });
  }, [productName, seoDescription, seoStore, seoImage]);

  if (!product) {
    if (loading) return <DetailsSkeleton />;
    return (
      <div className="page">
        <div className="container">
          <div className="state-box" role="alert">
            <div className="state-icon error">
              <AlertCircle size={28} aria-hidden="true" />
            </div>
            <h2 className="state-title">Product not found</h2>
            <p className="state-desc">
              {error?.message || "We couldn't retrieve this product from the WeaveHub catalog."}
            </p>
            <div className="state-actions">
              <button type="button" onClick={refetch} className="btn btn-outline">
                Try Again
              </button>
              <Link to="/products" className="btn btn-primary">
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pricing = getVariantPricing(activeVariant, product.price);
  const stockKnown = Boolean(activeVariant?.stockKnown);
  const available = Number(activeVariant?.inventory?.available ?? 0);
  const soldOut = stockKnown && available <= 0;
  const lowStock =
    stockKnown && !soldOut && available <= Number(activeVariant?.inventory?.lowStockThreshold ?? 5);
  const isAvailable = !soldOut && product.status !== "inactive";
  const detailsPending = !fetched && loading;

  const store = storeQuery.data;
  // The details response only names the store's id; the list item had its name.
  const listItem = peekProduct(id);
  const storeName = store?.name || product.storeName || listItem?.storeName || "WeaveHub Artisan Store";
  const storeLogo = store?.logo || product.storeLogo || listItem?.storeLogo;
  const storeDescription =
    store?.tagLine || store?.description || product.storeDescription || "Independent artisan shop";
  const hasCategory = product.categoryId && product.category !== "General";

  const storeCard = (
    <>
      <div className="pd-store-logo">
        {storeLogo ? <MediaImage src={storeLogo} alt="" iconSize={18} /> : <Store size={20} aria-hidden="true" />}
      </div>
      <div className="pd-store-text">
        <span>Sold by</span>
        <strong>{storeName}</strong>
        <span>{storeDescription}</span>
      </div>
      {storeId ? <ChevronRight size={18} aria-hidden="true" /> : null}
    </>
  );

  return (
    <div className="page pd-page">
      <div className="container">
        <nav className="breadcrumbs pd-breadcrumbs" aria-label="Breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link to="/products">Shop</Link>
          <ChevronRight size={14} aria-hidden="true" />
          {hasCategory ? (
            <>
              <Link to={`/categories/${product.categoryId}`}>{product.category}</Link>
              <ChevronRight size={14} aria-hidden="true" />
            </>
          ) : null}
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-layout">
          <div className="pd-gallery">
            <ProductImageGallery slides={slides} productName={product.name} />
          </div>

          <div className="product-info-panel">
            <div className="pd-pills">
              {hasCategory ? (
                <Link to={`/categories/${product.categoryId}`}>
                  <Pill tone="brand" icon={Tag}>
                    {product.category}
                  </Pill>
                </Link>
              ) : null}
              {detailsPending ? (
                <Skeleton width={120} height={20} radius={999} />
              ) : (
                <StockPill soldOut={soldOut} lowStock={lowStock} available={available} known={stockKnown} />
              )}
            </div>

            <h1 className="product-page-title">{product.name}</h1>

            <ProductPrice pricing={pricing} />

            {detailsPending ? (
              <Skeleton height={42} radius={999} />
            ) : (
              <ProductVariants
                variants={variants}
                selectedVariant={activeVariant}
                onSelectVariant={(variant) => setSelectedVariantId(variant.id)}
              />
            )}

            <div className="pd-buy">
              <div className="pd-buy-button">
                <BuyOnAppButton productId={product.id} productName={product.name} isAvailable={isAvailable} />
              </div>
              <p className="pd-buy-note">Safe in-app payment with buyer protection via WeaveHub mobile.</p>
            </div>

            <div className="pd-trust">
              <div>
                <Truck size={20} aria-hidden="true" />
                <div>
                  <strong>Tracked Delivery</strong>
                  <span>Doorstep dispatch</span>
                </div>
              </div>
              <div>
                <RotateCcw size={20} aria-hidden="true" />
                <div>
                  <strong>Artisan Guarantee</strong>
                  <span>Direct from creator</span>
                </div>
              </div>
            </div>

            {storeId ? (
              <Link to={`/stores/${storeId}`} state={store ? { store } : undefined} className="pd-store" aria-label={`Sold by ${storeName}`}>
                {storeCard}
              </Link>
            ) : (
              <div className="pd-store">{storeCard}</div>
            )}

            <div className="pd-about">
              <h2 className="section-head-title">About this Creation</h2>
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        <ProductFeedback productId={id} />

        <div className="pd-rails">
          <ProductRail
            title="Customers also purchased"
            subtitle="Frequently Bought Together"
            icon={ShoppingBag}
            products={alsoBought.data || []}
            loading={alsoBought.loading}
            error={alsoBought.error}
            onRetry={alsoBought.refetch}
            emptyText="No frequently bought items for this product yet."
            action={
              <Link to="/products" className="link-action">
                View All
              </Link>
            }
          />

          <ProductRail
            title="You might also like"
            subtitle="Similar Products"
            icon={Sparkles}
            products={related.data || []}
            loading={related.loading}
            error={related.error}
            onRetry={related.refetch}
            emptyText="No similar products to show yet."
            action={
              hasCategory ? (
                <Link to={`/categories/${product.categoryId}`} className="link-action">
                  <span>More in {product.category}</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              ) : null
            }
          />
        </div>
      </div>

      <div className="pd-buybar">
        <div className="pd-buybar-price">
          {pricing.price > 0 ? (
            <>
              <strong className={pricing.discountPct ? "is-sale" : ""}>{formatCurrency(pricing.price)}</strong>
              {pricing.originalPrice ? <s>{formatCurrency(pricing.originalPrice)}</s> : null}
            </>
          ) : null}
        </div>
        <BuyOnAppButton productId={product.id} productName={product.name} isAvailable={isAvailable} />
      </div>
    </div>
  );
}
