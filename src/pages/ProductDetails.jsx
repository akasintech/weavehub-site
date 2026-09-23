import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getProductReviews, getProductComments } from "../api/products";
import { getCategories } from "../api/categories";
import { ProductImageGallery } from "../components/ProductImageGallery";
import { ProductPrice } from "../components/ProductPrice";
import { ProductVariants } from "../components/ProductVariants";
import { BuyOnAppButton } from "../components/BuyOnAppButton";
import { updateSEO } from "../utils/seo";
import {
  Store,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      let categories = [];
      try {
        categories = await getCategories();
      } catch (err) {
        console.warn("Categories fetch skipped in details:", err.message);
      }

      const item = await getProductById(id, categories);
      setProduct(item);

      // Default variant
      const initialVariant =
        item.defaultVariant || (item.variants?.length > 0 ? item.variants[0] : null);
      setSelectedVariant(initialVariant);

      // Dynamic SEO
      updateSEO({
        title: `${item.name} | WeaveHub`,
        description:
          item.description?.slice(0, 160) ||
          `Buy ${item.name} handcrafted by ${item.storeName} on WeaveHub.`,
        image: item.image,
      });

      // Attempt non-critical reviews and comments
      getProductReviews(id).then((r) => setReviews(r || []));
      getProductComments(id).then((c) => setComments(c || []));
    } catch (err) {
      console.error("Failed to load product details:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  if (loading) {
    return (
      <div style={{ paddingTop: "calc(var(--nav-h) + 32px)", paddingBottom: "80px" }}>
        <div className="container">
          <div className="product-detail-layout">
            <div className="skeleton" style={{ aspectRatio: "1 / 1", borderRadius: "20px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="skeleton" style={{ height: "20px", width: "40%" }} />
              <div className="skeleton" style={{ height: "36px", width: "85%" }} />
              <div className="skeleton" style={{ height: "28px", width: "30%" }} />
              <div className="skeleton" style={{ height: "120px", width: "100%" }} />
              <div className="skeleton" style={{ height: "54px", width: "100%", borderRadius: "9999px" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ paddingTop: "calc(var(--nav-h) + 48px)", paddingBottom: "80px" }}>
        <div className="container">
          <div className="state-box">
            <div className="state-icon error">
              <AlertCircle size={32} />
            </div>
            <h2 className="state-title">Product not found</h2>
            <p className="state-desc">
              {error?.message || "We couldn't retrieve this product from the WeaveHub catalog."}
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button type="button" onClick={loadProduct} className="btn btn-outline">
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

  // Active price & stock from selected variant if available
  const activePrice = selectedVariant?.price ?? product.price;
  const activeDiscountedPrice =
    selectedVariant?.discountedPrice ?? product.discountedPrice;
  const activeStock =
    selectedVariant?.inventory?.available ?? product.stock ?? 0;
  const isAvailable = activeStock > 0 && product.status !== "inactive";

  // Active media (variant media if present, otherwise product media)
  const activeMedia =
    selectedVariant?.media?.length > 0
      ? selectedVariant.media
      : product.media;

  return (
    <div style={{ paddingTop: "calc(var(--nav-h) + 24px)", paddingBottom: "80px" }}>
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products">Shop</Link>
          <ChevronRight size={14} />
          {product.categoryId ? (
            <>
              <Link to={`/categories/${product.categoryId}`}>{product.category}</Link>
              <ChevronRight size={14} />
            </>
          ) : null}
          <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{product.name}</span>
        </nav>

        {/* Main Details Layout */}
        <div className="product-detail-layout">
          {/* Left Column: Gallery */}
          <ProductImageGallery
            media={activeMedia}
            fallbackImage={product.image}
            productName={product.name}
          />

          {/* Right Column: Information & Actions */}
          <div className="product-info-panel">
            {/* Vendor / Store Pill */}
            <div className="product-vendor-badge">
              <Store size={14} style={{ color: "var(--primary-dark)" }} />
              <span>Sold by <strong>{product.storeName}</strong></span>
              <ShieldCheck size={14} style={{ color: "var(--primary-dark)" }} title="Verified Artisan Vendor" />
            </div>

            <h1 className="product-page-title">{product.name}</h1>

            {/* Price */}
            <ProductPrice
              price={activePrice}
              discountedPrice={activeDiscountedPrice}
              size="lg"
            />

            {/* Stock Status */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                className={`stock-status ${
                  !isAvailable ? "out-of-stock" : activeStock <= 3 ? "low-stock" : "in-stock"
                }`}
              >
                <span className="stock-dot" />
                <span>
                  {!isAvailable
                    ? "Sold out"
                    : activeStock <= 3
                    ? `Low Stock: Only ${activeStock} left`
                    : "In Stock & Ready to Ship"}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-light)", fontSize: "13px" }}>
                <Tag size={12} />
                <span>{product.category}</span>
              </div>
            </div>

            {/* Variants Selector */}
            <ProductVariants
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelectVariant={handleVariantSelect}
            />

            {/* CTA: Buy on WeaveHub */}
            <div style={{ marginTop: "10px" }}>
              <BuyOnAppButton
                productId={product.id}
                productName={product.name}
                isAvailable={isAvailable}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-light)",
                  textAlign: "center",
                  marginTop: "8px",
                }}
              >
                Safe in-app payment with buyer protection via WeaveHub mobile.
              </p>
            </div>

            {/* Trust Badges */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                padding: "16px",
                background: "var(--surface)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Truck size={20} style={{ color: "var(--primary-dark)" }} />
                <div>
                  <strong style={{ fontSize: "13px", display: "block" }}>Tracked Delivery</strong>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Doorstep dispatch</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <RotateCcw size={20} style={{ color: "var(--secondary)" }} />
                <div>
                  <strong style={{ fontSize: "13px", display: "block" }}>Artisan Guarantee</strong>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Direct from creator</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: "var(--secondary)",
                }}
              >
                About this Creation
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.7", whiteSpace: "pre-line" }}>
                {product.description}
              </p>
            </div>

            {/* Vendor Profile Card */}
            <div
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                padding: "18px",
                display: "flex",
                gap: "14px",
                alignItems: "center",
              }}
            >
              <img
                src={product.storeLogo || "/icon.png"}
                alt=""
                style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover" }}
                onError={(e) => {
                  e.currentTarget.src = "/icon.png";
                }}
              />
              <div style={{ flex: 1 }}>
                <strong style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", display: "block", color: "var(--secondary)" }}>
                  {product.storeName}
                </strong>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {product.storeDescription || "Verified WeaveHub artisan vendor."}
                </p>
              </div>
            </div>

            {/* Customer Reviews / Comments */}
            {(reviews.length > 0 || comments.length > 0) && (
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
                <h3
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "16px",
                    fontWeight: 700,
                    marginBottom: "12px",
                    color: "var(--secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Artisan Inquiries &amp; Reviews ({reviews.length + comments.length})</span>
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[...reviews, ...comments].slice(0, 4).map((item, idx) => (
                    <div
                      key={item._id || item.id || idx}
                      style={{
                        padding: "12px",
                        background: "var(--bg-alt)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "13px",
                      }}
                    >
                      <div style={{ fontWeight: 600, color: "var(--secondary)", marginBottom: "4px" }}>
                        {item.userName || item.user?.name || "Verified Shopper"}
                      </div>
                      <div style={{ color: "var(--text-muted)" }}>
                        {item.comment || item.review || item.message || "Great handcrafted item!"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
