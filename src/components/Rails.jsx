import React, { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ChevronLeft, ChevronRight, Store } from "lucide-react";
import { formatCurrency, getProductPricing } from "../utils/helpers";
import { warmProduct } from "./ProductCard";
import { EmptyState, ErrorState } from "./States";
import { MediaImage, Pill, SectionHeader, Skeleton } from "./ui";

function RailShell({ head, loading, error, onRetry, errorTitle, empty, emptyText, skeleton, children }) {
  const trackRef = useRef(null);

  const scrollByPage = (direction) => {
    const track = trackRef.current;
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  let body;
  if (loading) {
    body = <div className="rail-track" aria-hidden="true">{skeleton}</div>;
  } else if (error) {
    body = <ErrorState compact title={errorTitle} error={error} onRetry={onRetry} />;
  } else if (empty) {
    body = <EmptyState compact message={emptyText} />;
  } else {
    body = (
      <div className="rail-frame">
        <div className="rail-track" ref={trackRef}>
          {children}
        </div>
        <button type="button" className="rail-arrow rail-arrow--prev" onClick={() => scrollByPage(-1)} aria-label="Scroll back">
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button type="button" className="rail-arrow rail-arrow--next" onClick={() => scrollByPage(1)} aria-label="Scroll forward">
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <section className="rail">
      {head}
      {body}
    </section>
  );
}

const RailCard = memo(function RailCard({ product, rank }) {
  const { price, originalPrice, discountPct } = getProductPricing(product);

  return (
    <Link
      to={`/products/${product.id}`}
      className="rail-card"
      onPointerDown={() => warmProduct(product)}
    >
      <div className="rail-card-media">
        <MediaImage src={product.image} alt={product.name} className="pcard-img" iconSize={24} />
        {rank ? <span className="rail-rank">{rank}</span> : null}
        {discountPct > 0 ? (
          <Pill tone="sale" className="pcard-discount">
            -{discountPct}%
          </Pill>
        ) : null}
      </div>
      <div className="rail-card-name">{product.name}</div>
      {price > 0 ? (
        <div className="pcard-price pcard-price--sm">
          <span className={discountPct ? "is-sale" : ""}>{formatCurrency(price)}</span>
          {originalPrice ? <s>{formatCurrency(originalPrice)}</s> : null}
        </div>
      ) : null}
    </Link>
  );
});

export function ProductRail({
  title,
  subtitle,
  icon,
  ranked = false,
  products = [],
  loading = false,
  error = null,
  onRetry,
  action,
  emptyText = "Nothing to show here yet. Check back soon.",
  errorTitle = "Unable to load products",
}) {
  return (
    <RailShell
      head={<SectionHeader title={title} subtitle={subtitle} icon={icon} action={action} />}
      loading={loading}
      error={error}
      onRetry={onRetry}
      errorTitle={errorTitle}
      empty={!products.length}
      emptyText={emptyText}
      skeleton={[0, 1, 2, 3, 4, 5].map((i) => (
        <div className="rail-card" key={i}>
          <div className="rail-card-media skeleton" />
          <Skeleton width="80%" height={11} style={{ marginTop: 9 }} />
        </div>
      ))}
    >
      {products.map((product, index) => (
        <RailCard key={product.id} product={product} rank={ranked ? index + 1 : null} />
      ))}
    </RailShell>
  );
}

const StoreBubble = memo(function StoreBubble({ store }) {
  const initial = (store.name || "W").trim().charAt(0).toUpperCase();
  const picture = store.logo || store.banner;

  return (
    <Link to={`/stores/${store.id}`} state={{ store }} className="store-bubble">
      <span className={`store-bubble-ring ${store.isPlatformStore ? "is-platform" : ""}`}>
        <span className="store-bubble-inner">
          {picture ? <img src={picture} alt="" loading="lazy" /> : initial}
        </span>
        {store.verified ? (
          <span className="store-bubble-check">
            <BadgeCheck size={16} aria-hidden="true" />
          </span>
        ) : null}
      </span>
      <span className="store-bubble-name">{store.name}</span>
    </Link>
  );
});

export function StoreRail({ stores = [], loading = false, error = null, onRetry, action }) {
  return (
    <RailShell
      head={<SectionHeader title="Top makers" subtitle="Shop straight from the artisans" icon={Store} action={action} />}
      loading={loading}
      error={error}
      onRetry={onRetry}
      errorTitle="Unable to load makers"
      empty={!stores.length}
      emptyText="New makers are joining soon."
      skeleton={[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div className="store-bubble" key={i}>
          <Skeleton width={70} height={70} radius={999} />
          <Skeleton width={48} height={10} style={{ marginTop: 8 }} />
        </div>
      ))}
    >
      {stores.map((store) => (
        <StoreBubble key={store.id} store={store} />
      ))}
    </RailShell>
  );
}
