import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductGrid } from "../components/ProductGrid";
import { CategoryCard } from "../components/CategoryCard";
import { DownloadAppCTA } from "../components/DownloadAppCTA";
import { getProducts } from "../api/products";
import { getCategories } from "../api/categories";
import { updateSEO } from "../utils/seo";
import { IOS_STORE_URL, ANDROID_STORE_URL } from "../utils/deepLinks";
import { ArrowRight, Sparkles, Smartphone, ShieldCheck, HeartHandshake } from "lucide-react";

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    updateSEO({
      title: "WeaveHub – The Marketplace for Artisans & Craft Lovers",
      description:
        "Discover authentic handmade products, support local artisans, watch live seller streams, and shop on WeaveHub.",
    });

    loadData();
  }, []);

  const loadData = async () => {
    setLoadingProducts(true);
    setProductsError(null);

    // Fetch categories first to provide category names to normalizer
    let fetchedCategories = [];
    try {
      setLoadingCategories(true);
      fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.warn("Could not fetch categories:", err.message);
    } finally {
      setLoadingCategories(false);
    }

    // Fetch featured / recent products
    try {
      const items = await getProducts({ categoriesList: fetchedCategories });
      setFeaturedProducts(items.slice(0, 8));
    } catch (err) {
      console.warn("Could not fetch featured products:", err.message);
      setProductsError(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-bg-orbs" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>

        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge" aria-label="Status">
              <span className="badge-dot" aria-hidden="true" />
              Now available on iOS &amp; Android
            </div>

            <h1 id="hero-heading" className="hero-title">
              The Marketplace<br />
              <span className="gradient-text">Built for Artisans</span><br />
              &amp; Craft Lovers
            </h1>

            <p className="hero-subtitle">
              Discover unique handmade creations, support talented independent makers,
              watch live stream showcases, and buy directly inside the WeaveHub app.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                <span>Explore Products</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/download" className="btn btn-outline btn-lg">
                <Smartphone size={18} />
                <span>Get the App</span>
              </Link>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-divider" aria-hidden="true" />
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Vendors</span>
              </div>
              <div className="stat-divider" aria-hidden="true" />
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Categories</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="phone-mockup" aria-hidden="true">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-notch" />
                  <div className="mock-screen">
                    <div className="mock-header">
                      <img src="/icon.png" alt="" className="mock-logo" />
                      <span className="mock-brand">WeaveHub</span>
                    </div>
                    <div className="mock-banner">
                      <img
                        src="/banner1.jpg"
                        alt="WeaveHub artisan products"
                        className="mock-banner-img"
                      />
                    </div>
                    <div className="mock-chips">
                      <div className="chip chip-active">Featured</div>
                      <div className="chip">Handmade</div>
                      <div className="chip">Braids</div>
                      <div className="chip">Art</div>
                    </div>
                    <div className="mock-grid">
                      <div className="mock-card">
                        <div className="mock-card-img" style={{ background: "#e2e8f0" }} />
                        <div className="mock-card-body">
                          <div className="mock-card-title" />
                          <div className="mock-card-price" />
                        </div>
                      </div>
                      <div className="mock-card">
                        <div className="mock-card-img" style={{ background: "#cbd5e1" }} />
                        <div className="mock-card-body">
                          <div className="mock-card-title" />
                          <div className="mock-card-price" />
                        </div>
                      </div>
                      <div className="mock-card">
                        <div className="mock-card-img" style={{ background: "#94a3b8" }} />
                        <div className="mock-card-body">
                          <div className="mock-card-title" />
                          <div className="mock-card-price" />
                        </div>
                      </div>
                      <div className="mock-card">
                        <div className="mock-card-img" style={{ background: "#64748b" }} />
                        <div className="mock-card-body">
                          <div className="mock-card-title" />
                          <div className="mock-card-price" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,60 C360,100 1080,0 1440,60 L1440,100 L0,100 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────── */}
      <div className="trust-bar" aria-label="Supported features">
        <div className="trust-marquee">
          <div className="trust-track">
            <span className="trust-item">
              <Sparkles className="icon" /> Authentic Handmade Crafts
            </span>
            <span className="trust-sep" aria-hidden="true">•</span>
            <span className="trust-item">
              <Smartphone className="icon" /> Live Stream Shopping
            </span>
            <span className="trust-sep" aria-hidden="true">•</span>
            <span className="trust-item">
              <HeartHandshake className="icon" /> Direct Artisan Messaging
            </span>
            <span className="trust-sep" aria-hidden="true">•</span>
            <span className="trust-item">
              <ShieldCheck className="icon" /> Verified Vendor Storefronts
            </span>
            <span className="trust-sep" aria-hidden="true">•</span>
            <span className="trust-item">
              <Sparkles className="icon" /> Curated Collections
            </span>
            <span className="trust-sep" aria-hidden="true">•</span>
            <span className="trust-item">
              <Smartphone className="icon" /> In-App Wallet Checkout
            </span>
          </div>
        </div>
      </div>

      {/* ── FEATURED PRODUCTS (REAL BACKEND DATA) ──────────────────────── */}
      <section className="section" aria-labelledby="featured-products-heading">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="section-badge">Marketplace</div>
              <h2 id="featured-products-heading" className="section-title" style={{ marginBottom: "6px" }}>
                Featured Creations
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
                Handpicked items crafted by verified artisans and sellers on WeaveHub.
              </p>
            </div>
            <Link to="/products" className="btn btn-outline">
              <span>View All Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <ProductGrid
            products={featuredProducts}
            loading={loadingProducts}
            error={productsError}
            onRetry={loadData}
            emptyTitle="No products currently listed"
            emptyMessage="New artisan collections are being added daily. Check back soon or download the app."
          />
        </div>
      </section>

      {/* ── POPULAR CATEGORIES ────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="section section--alt" aria-labelledby="categories-heading">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">Categories</div>
              <h2 id="categories-heading" className="section-title">
                Explore by <span className="gradient-text">Category</span>
              </h2>
              <p className="section-subtitle">
                Find exactly what you love across our vibrant artisan specialties.
              </p>
            </div>

            <div className="category-grid">
              {categories.slice(0, 8).map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <Link to="/categories" className="btn btn-outline">
                <span>View All Categories</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="section" id="how-it-works" aria-labelledby="how-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">How It Works</div>
            <h2 id="how-heading" className="section-title">
              Start shopping in<br />
              <span className="gradient-text">3 simple steps</span>
            </h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon-wrap" aria-hidden="true">
                <Smartphone className="icon" />
              </div>
              <h3 className="step-title">Discover on Web</h3>
              <p className="step-desc">
                Browse authentic items, explore categories, and find unique handmade creations right here.
              </p>
            </div>

            <div className="step-connector" aria-hidden="true">
              <ArrowRight className="icon" />
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon-wrap" aria-hidden="true">
                <Sparkles className="icon" />
              </div>
              <h3 className="step-title">Open WeaveHub App</h3>
              <p className="step-desc">
                Click "Buy on WeaveHub" or scan the QR code to deep-link directly into that exact product inside the app.
              </p>
            </div>

            <div className="step-connector" aria-hidden="true">
              <ArrowRight className="icon" />
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon-wrap" aria-hidden="true">
                <ShieldCheck className="icon" />
              </div>
              <h3 className="step-title">Purchase &amp; Track</h3>
              <p className="step-desc">
                Checkout securely in the mobile app, chat with the artisan, and track your doorstep delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR VENDORS ───────────────────────────────────────────────── */}
      <section className="section section--alt" id="vendors" aria-labelledby="vendors-heading">
        <div className="container">
          <div className="vendor-split">
            <div className="vendor-text">
              <div className="section-badge">For Vendors</div>
              <h2 id="vendors-heading" className="section-title">
                Grow your craft<br />
                <span className="gradient-text">business online</span>
              </h2>
              <p className="vendor-subtitle">
                WeaveHub gives artisans and sellers every tool to run a thriving storefront without technical complexity.
              </p>

              <ul className="vendor-features" role="list">
                <li className="vendor-feature-item">
                  <div className="vfi-icon" aria-hidden="true">
                    <Sparkles className="icon" />
                  </div>
                  <div>
                    <strong>Custom Storefront</strong>
                    <p>Set up your shop with your brand logo, banner, bio, and catalog listings.</p>
                  </div>
                </li>
                <li className="vendor-feature-item">
                  <div className="vfi-icon" aria-hidden="true">
                    <ShieldCheck className="icon" />
                  </div>
                  <div>
                    <strong>Live Stream Shopping</strong>
                    <p>Host live broadcasts to showcase items directly to active buyers and boost sales.</p>
                  </div>
                </li>
                <li className="vendor-feature-item">
                  <div className="vfi-icon" aria-hidden="true">
                    <HeartHandshake className="icon" />
                  </div>
                  <div>
                    <strong>Direct Customer Chat</strong>
                    <p>Communicate with buyers, answer questions in real time, and arrange custom orders.</p>
                  </div>
                </li>
              </ul>

              <Link to="/contact" className="btn btn-accent">
                Become a Vendor
              </Link>
            </div>

            <div className="vendor-visual" aria-hidden="true">
              <div className="dashboard-mock">
                <div className="dash-header">
                  <div className="dash-title-row">
                    <span className="dash-title">Artisan Dashboard</span>
                    <span className="dash-live-badge">LIVE</span>
                  </div>
                </div>
                <div className="dash-stats">
                  <div className="dash-stat">
                    <div className="dash-stat-val">₦284,500</div>
                    <div className="dash-stat-lbl">Revenue</div>
                  </div>
                  <div className="dash-stat">
                    <div className="dash-stat-val">142</div>
                    <div className="dash-stat-lbl">Orders</div>
                  </div>
                  <div className="dash-stat">
                    <div className="dash-stat-val">89</div>
                    <div className="dash-stat-lbl">Products</div>
                  </div>
                </div>
                <div className="dash-chart">
                  <div className="dash-bar" style={{ height: "40%" }} />
                  <div className="dash-bar" style={{ height: "65%" }} />
                  <div className="dash-bar" style={{ height: "55%" }} />
                  <div className="dash-bar" style={{ height: "80%" }} />
                  <div className="dash-bar" style={{ height: "70%" }} />
                  <div className="dash-bar dash-bar--active" style={{ height: "95%" }} />
                  <div className="dash-bar" style={{ height: "75%" }} />
                </div>
                <div className="dash-orders">
                  <div className="dash-order-row">
                    <div className="dash-order-dot" style={{ background: "#1E9E52" }} />
                    <span>Woven Basket Set</span>
                    <span className="dash-order-status">Shipped</span>
                  </div>
                  <div className="dash-order-row">
                    <div className="dash-order-dot" style={{ background: "#1F3A5F" }} />
                    <span>Handmade Clay Pot</span>
                    <span className="dash-order-status pending">Processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ──────────────────────────────────────────────── */}
      <DownloadAppCTA />
    </>
  );
}
