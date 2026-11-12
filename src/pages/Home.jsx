import React, { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Flame,
  HeartHandshake,
  Search as SearchIcon,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Tag,
} from "lucide-react";
import { TTL } from "../api/cache";
import { getAllFeaturedProducts, getDeals, getFeaturedProducts, getProductsPage, getTrendingPage } from "../api/products";
import { getStoresPage } from "../api/stores";
import { FadeUp, FadeIn, SlideLeft, SlideRight, ScaleIn, StaggerParent, StaggerItem, PageTransition } from "../components/Animate";
import { CategoryCard, CategoryCardSkeleton } from "../components/CategoryCard";
import { Chip, ChipDivider, ChipRow } from "../components/ChipRow";
import { DownloadAppCTA } from "../components/DownloadAppCTA";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { ProductGrid } from "../components/ProductGrid";
import { ProductRail, StoreRail } from "../components/Rails";
import { LoadMore, ErrorState } from "../components/States";
import { useCategories, usePagedList, useQuery } from "../hooks/useApi";
import { updateSEO } from "../utils/seo";

const TAB_ALL = "all";
const TAB_TRENDING = "trending";
const TAB_DEALS = "deals";

function TrustItems({ hidden = false }) {
  return (
    <span className="trust-group" aria-hidden={hidden || undefined}>
      <span className="trust-item"><Sparkles className="icon" /> Authentic Handmade Crafts</span>
      <span className="trust-sep" aria-hidden="true">•</span>
      <span className="trust-item"><Smartphone className="icon" /> Live Stream Shopping</span>
      <span className="trust-sep" aria-hidden="true">•</span>
      <span className="trust-item"><HeartHandshake className="icon" /> Direct Artisan Messaging</span>
      <span className="trust-sep" aria-hidden="true">•</span>
      <span className="trust-item"><ShieldCheck className="icon" /> Verified Vendor Storefronts</span>
      <span className="trust-sep" aria-hidden="true">•</span>
      <span className="trust-item"><Sparkles className="icon" /> Curated Collections</span>
      <span className="trust-sep" aria-hidden="true">•</span>
      <span className="trust-item"><Smartphone className="icon" /> In-App Wallet Checkout</span>
      <span className="trust-sep" aria-hidden="true">•</span>
    </span>
  );
}

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || TAB_ALL;
  const chipsAnchorRef = useRef(null);

  const isTrendingTab = activeTab === TAB_TRENDING;
  const isDealsTab = activeTab === TAB_DEALS;
  const categoryId = activeTab !== TAB_ALL && !isTrendingTab && !isDealsTab ? activeTab : "";

  const categories = useCategories();
  const categoryList = categories.data || [];
  const activeCategory = categoryList.find((c) => c.id === categoryId) || null;

  const featured = useQuery("featured", (signal) => getFeaturedProducts({ signal }));
  const featuredAll = useQuery("featured:all", () => getAllFeaturedProducts());
  const featuredItems = featuredAll.data || [];
  const stores = useQuery(
    "stores:home",
    (signal) => getStoresPage({ page: 1, limit: 12, signal }).then((result) => result.items),
    { ttl: TTL.long }
  );
  const deals = useQuery("deals", (signal) => getDeals({ signal }));
  const trending = usePagedList("trending", ({ page, signal }) => getTrendingPage({ page, signal }));
  const feed = usePagedList(
    categoryId ? `category-products:${categoryId}` : "feed:all",
    ({ page, signal }) => getProductsPage({ page, categoryId, signal })
  );

  useEffect(() => {
    updateSEO({
      title: "WeaveHub – The Marketplace for Artisans & Craft Lovers",
      description:
        "Discover authentic handmade products, support local artisans, watch live seller streams, and shop on WeaveHub.",
    });
  }, []);

  const selectTab = (tab) => {
    setSearchParams(tab === TAB_ALL ? {} : { tab }, { replace: true });

    // If the chips are stuck to the top, jump back to the start of the new list.
    const anchor = chipsAnchorRef.current;
    if (!anchor) return;
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || 0;
    const top = anchor.getBoundingClientRect().top + window.scrollY - navHeight;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "instant" });
  };

  const dealItems = deals.data || [];

  const grid = isTrendingTab
    ? { products: trending.items, loading: trending.loading, error: trending.error, retry: trending.retry, paged: trending }
    : isDealsTab
    ? { products: dealItems, loading: deals.loading, error: deals.error, retry: deals.refetch, paged: null }
    : { products: feed.items, loading: feed.loading, error: feed.error, retry: feed.retry, paged: feed };

  const gridTitle = isTrendingTab
    ? "Trending now"
    : isDealsTab
    ? "Best deals"
    : activeCategory
    ? activeCategory.name
    : categoryId
    ? "Collection"
    : "Fresh on WeaveHub";

  const gridCount = grid.paged?.hasNext ? grid.paged.total : grid.products.length;

  return (
    <PageTransition>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container home-top">
          <div className="home-intro">
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
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/download" className="btn btn-outline btn-lg">
                <Smartphone size={18} aria-hidden="true" />
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

          <div className="home-showcase">
            <Link to="/search" className="search-pill" aria-label="Search WeaveHub">
              <SearchIcon size={19} aria-hidden="true" />
              <span>Search Ankara, Kente, beads…</span>
              <span className="search-pill-action" aria-hidden="true">
                <SlidersHorizontal size={16} />
              </span>
            </Link>
            <FeaturedCarousel
              products={featured.data || []}
              loading={featured.loading}
              error={featured.error}
              onRetry={featured.refetch}
            />
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────── */}
      <div className="trust-bar" aria-label="Supported features">
        <div className="trust-marquee">
          <div className="trust-track">
            <TrustItems />
            <TrustItems hidden />
          </div>
        </div>
      </div>

      {/* ── SHOP ──────────────────────────────────────────────────────── */}
      <div className="home-shop">
        <div ref={chipsAnchorRef} />
        <div className="chips-sticky">
          <div className="container">
            <ChipRow loading={categories.loading} error={categories.error} onRetry={categories.refetch}>
              <Chip active={activeTab === TAB_ALL} onClick={() => selectTab(TAB_ALL)}>
                All
              </Chip>
              <Chip active={isTrendingTab} icon={Flame} onClick={() => selectTab(TAB_TRENDING)}>
                Trending
              </Chip>
              {dealItems.length ? (
                <Chip active={isDealsTab} icon={Tag} onClick={() => selectTab(TAB_DEALS)}>
                  Deals
                </Chip>
              ) : null}
              {categoryList.length ? <ChipDivider /> : null}
              {categoryList.map((category) => (
                <Chip key={category.id} active={categoryId === category.id} onClick={() => selectTab(category.id)}>
                  {category.name}
                </Chip>
              ))}
            </ChipRow>
          </div>
        </div>

        <div className="container">
          {activeTab === TAB_ALL ? (
            <div className="home-rails">
              {featuredAll.loading || featuredAll.error || featuredItems.length ? (
                <ProductRail
                  title="Featured picks"
                  subtitle="Standout pieces hand-picked by the WeaveHub team."
                  icon={Sparkles}
                  products={featuredItems.slice(0, 10)}
                  loading={featuredAll.loading && !featuredItems.length}
                  error={featuredItems.length ? null : featuredAll.error}
                  onRetry={featuredAll.refetch}
                  errorTitle="Unable to load featured picks"
                  action={
                    featuredItems.length ? (
                      <Link to="/featured" className="link-action">
                        See all
                      </Link>
                    ) : null
                  }
                />
              ) : null}

              <ProductRail
                ranked
                title="Trending Products"
                subtitle="The hottest handcrafted picks right now — loved by shoppers across WeaveHub."
                icon={Flame}
                products={trending.items.slice(0, 10)}
                loading={trending.loading}
                error={trending.error}
                onRetry={trending.retry}
                emptyText="Nothing is trending just yet. Check back soon."
                action={
                  <button type="button" className="link-action" onClick={() => selectTab(TAB_TRENDING)}>
                    See all
                  </button>
                }
              />

              <StoreRail
                stores={stores.data || []}
                loading={stores.loading}
                error={stores.error}
                onRetry={stores.refetch}
                action={
                  <Link to="/stores" className="link-action">
                    See all
                  </Link>
                }
              />

              <ProductRail
                title="Deals worth weaving in"
                subtitle="Biggest markdowns right now"
                icon={Tag}
                products={dealItems.slice(0, 10)}
                loading={deals.loading}
                error={deals.error}
                onRetry={deals.refetch}
                emptyText="No markdowns running right now. Check back soon."
                errorTitle="Unable to load deals"
                action={
                  dealItems.length ? (
                    <button type="button" className="link-action" onClick={() => selectTab(TAB_DEALS)}>
                      See all
                    </button>
                  ) : null
                }
              />
            </div>
          ) : null}

          <section aria-labelledby="featured-products-heading">
            <div className="grid-head">
              <h2 id="featured-products-heading" className="grid-title">
                {gridTitle}
              </h2>
              {grid.products.length ? (
                <span className="caption">
                  {gridCount} item{gridCount === 1 ? "" : "s"}
                </span>
              ) : null}
            </div>

            <ProductGrid
              products={grid.products}
              loading={grid.loading}
              error={grid.error}
              onRetry={grid.retry}
              emptyTitle={activeCategory ? `Nothing in ${activeCategory.name} yet` : "No products currently listed"}
              emptyMessage="New artisan collections are being added daily. Check back soon or download the app."
            />
            {grid.paged ? <LoadMore list={grid.paged} /> : null}

            {activeTab === TAB_ALL && grid.products.length > 0 ? (
              <div className="center-action">
                <Link to="/products" className="btn btn-primary btn-lg">
                  <span>See All Products</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      {/* ── POPULAR CATEGORIES ────────────────────────────────────────── */}
      <section className="section section--alt" aria-labelledby="categories-heading">
        <div className="container">
          <FadeUp>
            <div className="section-header">
              <div className="section-badge">Categories</div>
              <h2 id="categories-heading" className="section-title">
                Explore by <span className="gradient-text">Category</span>
              </h2>
              <p className="section-subtitle">
                Find exactly what you love across our vibrant artisan specialties.
              </p>
            </div>
          </FadeUp>

          {categories.loading ? (
            <div className="category-grid" aria-label="Loading categories">
              {Array.from({ length: 8 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          ) : categories.error ? (
            <ErrorState compact title="Unable to load categories" error={categories.error} onRetry={categories.refetch} />
          ) : categoryList.length ? (
            <>
              <StaggerParent className="category-grid" stagger={0.07}>
                {categoryList.slice(0, 8).map((cat) => (
                  <StaggerItem key={cat.id}>
                    <CategoryCard category={cat} />
                  </StaggerItem>
                ))}
              </StaggerParent>

              <div className="center-action">
                <Link to="/categories" className="btn btn-outline">
                  <span>View All Categories</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </>
          ) : (
            <p className="list-note list-note--center">Categories will appear here once registered on the marketplace.</p>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="section" id="how-it-works" aria-labelledby="how-heading">
        <div className="container">
          <FadeUp>
            <div className="section-header">
              <div className="section-badge">How It Works</div>
              <h2 id="how-heading" className="section-title">
                Start shopping in<br />
                <span className="gradient-text">3 simple steps</span>
              </h2>
            </div>
          </FadeUp>

          <div className="steps-grid">
            <ScaleIn delay={0.1}>
              <div className="step-card">
                <div className="step-number">01</div>
                <div className="step-icon-wrap" aria-hidden="true"><Smartphone className="icon" /></div>
                <h3 className="step-title">Discover on Web</h3>
                <p className="step-desc">Browse authentic items, explore categories, and find unique handmade creations right here.</p>
              </div>
            </ScaleIn>
            <div className="step-connector" aria-hidden="true"><ArrowRight className="icon" /></div>
            <ScaleIn delay={0.2}>
              <div className="step-card">
                <div className="step-number">02</div>
                <div className="step-icon-wrap" aria-hidden="true"><Sparkles className="icon" /></div>
                <h3 className="step-title">Open WeaveHub App</h3>
                <p className="step-desc">Click "Buy on WeaveHub" or scan the QR code to deep-link directly into that exact product inside the app.</p>
              </div>
            </ScaleIn>
            <div className="step-connector" aria-hidden="true"><ArrowRight className="icon" /></div>
            <ScaleIn delay={0.3}>
              <div className="step-card">
                <div className="step-number">03</div>
                <div className="step-icon-wrap" aria-hidden="true"><ShieldCheck className="icon" /></div>
                <h3 className="step-title">Purchase &amp; Track</h3>
                <p className="step-desc">Checkout securely in the mobile app, chat with the artisan, and track your doorstep delivery.</p>
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* ── FOR VENDORS ───────────────────────────────────────────────── */}
      <section className="section section--alt" id="vendors" aria-labelledby="vendors-heading">
        <div className="container">
          <div className="vendor-split">
            <SlideLeft>
              <div className="vendor-text">
                <div className="section-badge">For Vendors</div>
                <h2 id="vendors-heading" className="section-title">
                  Grow your craft<br />
                  <span className="gradient-text">business online</span>
                </h2>
                <p className="vendor-subtitle">
                  WeaveHub gives artisans and sellers every tool to run a thriving storefront without technical complexity.
                </p>
                <StaggerParent className="vendor-features" stagger={0.12}>
                  <StaggerItem>
                    <div className="vendor-feature-item">
                      <div className="vfi-icon" aria-hidden="true"><Sparkles className="icon" /></div>
                      <div><strong>Custom Storefront</strong><p>Set up your shop with your brand logo, banner, bio, and catalog listings.</p></div>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="vendor-feature-item">
                      <div className="vfi-icon" aria-hidden="true"><ShieldCheck className="icon" /></div>
                      <div><strong>Live Stream Shopping</strong><p>Host live broadcasts to showcase items directly to active buyers and boost sales.</p></div>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="vendor-feature-item">
                      <div className="vfi-icon" aria-hidden="true"><HeartHandshake className="icon" /></div>
                      <div><strong>Direct Customer Chat</strong><p>Communicate with buyers, answer questions in real time, and arrange custom orders.</p></div>
                    </div>
                  </StaggerItem>
                </StaggerParent>
                <FadeUp delay={0.4}>
                  <Link to="/contact" className="btn btn-accent">Become a Vendor</Link>
                </FadeUp>
              </div>
            </SlideLeft>

            <SlideRight delay={0.15}>
              <div className="vendor-visual" aria-hidden="true">
                <div className="dashboard-mock">
                  <div className="dash-header">
                    <div className="dash-title-row">
                      <span className="dash-title">Artisan Dashboard</span>
                      <span className="dash-live-badge">LIVE</span>
                    </div>
                  </div>
                  <div className="dash-stats">
                    <div className="dash-stat"><div className="dash-stat-val">₦284,500</div><div className="dash-stat-lbl">Revenue</div></div>
                    <div className="dash-stat"><div className="dash-stat-val">142</div><div className="dash-stat-lbl">Orders</div></div>
                    <div className="dash-stat"><div className="dash-stat-val">89</div><div className="dash-stat-lbl">Products</div></div>
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
                    <div className="dash-order-row"><div className="dash-order-dot dash-order-dot--brand" /><span>Woven Basket Set</span><span className="dash-order-status">Shipped</span></div>
                    <div className="dash-order-row"><div className="dash-order-dot dash-order-dot--ink" /><span>Handmade Clay Pot</span><span className="dash-order-status pending">Processing</span></div>
                  </div>
                </div>
              </div>
            </SlideRight>
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ──────────────────────────────────────────────── */}
      <FadeUp>
        <DownloadAppCTA />
      </FadeUp>
    </PageTransition>
  );
}
