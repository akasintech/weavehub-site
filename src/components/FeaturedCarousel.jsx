import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useSnapCarousel } from "../hooks/useSnapCarousel";
import { formatCurrency, getProductPricing } from "../utils/helpers";
import { warmProduct } from "./ProductCard";
import { EmptyState, ErrorState } from "./States";
import { MediaImage, Pill } from "./ui";

function HeroSlide({ product, eager }) {
  const { price, originalPrice, discountPct } = getProductPricing(product);

  return (
    <Link
      to={`/products/${product.id}`}
      className="hero-slide"
      onPointerDown={() => warmProduct(product)}
    >
      <MediaImage src={product.image} alt={product.name} className="hero-slide-img" eager={eager} />
      <div className="hero-slide-shade" />

      <div className="hero-slide-pills">
        <Pill tone="glass" icon={Sparkles}>
          {product.isFeatured ? "FEATURED" : "SPOTLIGHT"}
        </Pill>
        {discountPct > 0 ? <Pill tone="sale">-{discountPct}%</Pill> : null}
      </div>

      <div className="hero-slide-copy">
        {product.storeName ? <div className="hero-slide-store">{product.storeName}</div> : null}
        <div className="hero-slide-name">{product.name}</div>
        <div className="hero-slide-foot">
          <div className="hero-slide-price">
            {price > 0 ? <span>{formatCurrency(price)}</span> : null}
            {originalPrice ? <s>{formatCurrency(originalPrice)}</s> : null}
          </div>
          <span className="hero-slide-cta">
            Shop now <ArrowRight size={13} aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedCarousel({ products = [], loading = false, error = null, onRetry }) {
  const { trackRef, index, onScroll, goTo } = useSnapCarousel();
  const pausedRef = useRef(false);
  const indexRef = useRef(0);
  indexRef.current = index;
  const count = products.length;

  // One stable timer that holds off while the shopper is interacting.
  useEffect(() => {
    if (count <= 1) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = setInterval(() => {
      if (!pausedRef.current && !document.hidden) goTo((indexRef.current + 1) % count);
    }, 5000);
    return () => clearInterval(timer);
  }, [count, goTo]);

  if (loading) return <div className="skeleton hero-carousel-size hero-carousel-skeleton" aria-hidden="true" />;
  if (error) {
    return (
      <div className="hero-carousel-size hero-carousel-state">
        <ErrorState compact title="Unable to load featured products" error={error} onRetry={onRetry} />
      </div>
    );
  }
  if (!count) {
    return (
      <div className="hero-carousel-size hero-carousel-state">
        <EmptyState compact icon={Sparkles} message="Featured collections are on their way." />
      </div>
    );
  }

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      className="hero-carousel"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <div className="hero-carousel-frame">
        <div className="hero-track hero-carousel-size" ref={trackRef} onScroll={onScroll}>
          {products.map((product, i) => (
            <HeroSlide key={product.id} product={product} eager={i === 0} />
          ))}
        </div>
        {count > 1 ? (
          <>
            <button
              type="button"
              className="carousel-arrow carousel-arrow--prev"
              onClick={() => goTo((index - 1 + count) % count)}
              aria-label="Previous featured product"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="carousel-arrow carousel-arrow--next"
              onClick={() => goTo((index + 1) % count)}
              aria-label="Next featured product"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <div className="carousel-dots">
          {products.map((product, i) => (
            <button
              key={product.id}
              type="button"
              className={`carousel-dot ${i === index ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Show featured product ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
