import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { updateSEO } from "../utils/seo";
import {
  Lightbulb,
  Target,
  Rocket,
  Users,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Calendar,
  Globe,
  TrendingUp,
  Linkedin,
  Twitter,
} from "lucide-react";

const TEAM = [
  {
    name: "Wisdom Mmaduagwu",
    role: "Chief Executive Officer",
    roleShort: "CEO",
    image: "/team-ceo.jpg",
    bio: "Wisdom leads WeaveHub with a passion for empowering African artisans through technology. With a background in entrepreneurship and product strategy, he drives the company's vision to connect craft creators with a global audience.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Chibuika Andrew",
    role: "Marketing Manager",
    roleShort: "Marketing",
    image: "/team-marketing.jpg",
    bio: "Chibuika crafts WeaveHub's brand story and growth strategy. With expertise in digital marketing and community building, he ensures that every artisan's story reaches the right audience at the right time.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Uzoma Akachukwu Charles",
    role: "Lead Software Developer",
    roleShort: "Engineering",
    image: "/team-dev.jpg",
    bio: "Uzoma (Akasintech) architects and builds the technology that powers WeaveHub. From the mobile app to the web storefront, he ensures a seamless, performant experience for artisans and shoppers alike.",
    linkedin: "https://linkedin.com/in/akasintech",
    twitter: "https://twitter.com/akasintech",
  },
];

const TIMELINE = [
  { year: "2023", label: "Idea Born", desc: "Co-founders identified the gap in the artisan marketplace ecosystem across West Africa." },
  { year: "Q1 2024", label: "WeaveHub Founded", desc: "Company officially incorporated in Lagos, Nigeria. Development of the mobile app begins." },
  { year: "Q3 2024", label: "Beta Launch", desc: "First 50 artisan vendors onboarded. Over 500 products listed in the first month." },
  { year: "Q1 2025", label: "App Store Launch", desc: "WeaveHub goes live on iOS & Android. 1,000+ downloads in the first two weeks." },
  { year: "2025", label: "Growing Strong", desc: "500+ verified vendors, 10,000+ products, and expanding across Nigeria and West Africa." },
];

export function About() {
  useEffect(() => {
    updateSEO({
      title: "About WeaveHub – Our Story, Mission & Team",
      description:
        "Learn about WeaveHub — the mobile marketplace built to empower African artisans and craft lovers. Meet our team and discover our mission.",
    });
  }, []);

  return (
    <>
      {/* ── PAGE HERO ──────────────────────────────────────────────────── */}
      <div className="page-hero">
        <div className="container">
          <div className="section-badge">Our Story</div>
          <h1 className="page-hero-title">
            Weaving Craftsmanship &amp;{" "}
            <span className="gradient-text">Community Together</span>
          </h1>
          <p className="page-hero-subtitle">
            WeaveHub is a mobile-first marketplace that celebrates authentic handmade
            craftsmanship, empowers independent artisans with modern digital tools,
            and connects craft lovers to unique creations from across Africa and beyond.
          </p>
        </div>
      </div>

      {/* ── WHO WE ARE ─────────────────────────────────────────────────── */}
      <section className="section" aria-labelledby="who-heading">
        <div className="container">
          <div className="about-split">
            <div className="about-split-text">
              <div className="section-badge">Who We Are</div>
              <h2 id="who-heading" className="section-title">
                A team on a mission to{" "}
                <span className="gradient-text">uplift artisans</span>
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "16px" }}>
                WeaveHub Technologies Ltd is a Lagos-based technology company founded in 2024.
                We build tools that help African artisans — weavers, potters, textile makers,
                jewelers, and craft creators — run thriving online businesses without needing
                any technical expertise.
              </p>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "24px" }}>
                We believe that every handmade creation tells a story, and every artisan
                deserves a fair, transparent platform to share their craft with the world.
                Our web storefront lets anyone discover these creations, while all purchases
                happen securely within the WeaveHub mobile app.
              </p>
              <div className="about-stats-row">
                <div className="about-stat">
                  <span className="about-stat-num">10K+</span>
                  <span className="about-stat-lbl">Products Listed</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-num">500+</span>
                  <span className="about-stat-lbl">Verified Artisans</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat-num">2024</span>
                  <span className="about-stat-lbl">Year Founded</span>
                </div>
              </div>
            </div>
            <div className="about-split-visual">
              <div className="about-values-card">
                <div className="about-value-item">
                  <div className="about-value-icon">
                    <HeartHandshake size={22} />
                  </div>
                  <div>
                    <strong>Artisan-First</strong>
                    <p>We put the creator's success at the centre of every decision we make.</p>
                  </div>
                </div>
                <div className="about-value-item">
                  <div className="about-value-icon">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <strong>Trust &amp; Transparency</strong>
                    <p>Verified storefronts, secure payments, and honest buyer protection policies.</p>
                  </div>
                </div>
                <div className="about-value-item">
                  <div className="about-value-icon">
                    <Globe size={22} />
                  </div>
                  <div>
                    <strong>African Heritage, Global Reach</strong>
                    <p>Rooted in Africa's rich craft traditions, built to serve the world.</p>
                  </div>
                </div>
                <div className="about-value-item">
                  <div className="about-value-icon">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <strong>Growth for All</strong>
                    <p>Tools, insights, and live-streaming features that grow artisan revenues.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ────────────────────────────────────────────────── */}
      <section className="section section--alt" aria-labelledby="problem-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">The Problem</div>
            <h2 id="problem-heading" className="section-title">
              Talented artisans are{" "}
              <span className="gradient-text">invisible online</span>
            </h2>
            <p className="section-subtitle">
              Despite producing world-class handmade goods, most African artisans struggle
              to reach buyers beyond their local markets.
            </p>
          </div>

          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon" aria-hidden="true">😔</div>
              <h3>No Digital Presence</h3>
              <p>
                Over 80% of African craft makers have no online storefront. They rely
                entirely on physical markets, word-of-mouth, and inconsistent social
                media exposure.
              </p>
            </div>
            <div className="problem-card">
              <div className="problem-icon" aria-hidden="true">💸</div>
              <h3>Exploitative Middlemen</h3>
              <p>
                Artisans who do sell online often do so through platforms that charge
                prohibitive commissions, leaving creators with a fraction of what buyers pay.
              </p>
            </div>
            <div className="problem-card">
              <div className="problem-icon" aria-hidden="true">🌍</div>
              <h3>Limited Market Access</h3>
              <p>
                Generic e-commerce platforms are not designed for the unique needs of
                African craft economies — different payment rails, logistics realities,
                and cultural context.
              </p>
            </div>
            <div className="problem-card">
              <div className="problem-icon" aria-hidden="true">🔇</div>
              <h3>No Authentic Voice</h3>
              <p>
                Buyers cannot connect with the real story behind a product. The handmade
                journey, the artisan's craft, and the cultural significance get lost in
                transactional marketplaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR SOLUTION ───────────────────────────────────────────────── */}
      <section className="section" aria-labelledby="solution-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Our Solution</div>
            <h2 id="solution-heading" className="section-title">
              How WeaveHub{" "}
              <span className="gradient-text">changes the game</span>
            </h2>
            <p className="section-subtitle">
              We built a mobile-first platform designed specifically for the artisan
              economy — where every feature serves the creator and the craft lover equally.
            </p>
          </div>

          <div className="solution-grid">
            <div className="solution-card solution-card--featured">
              <div className="solution-card-icon">
                <Rocket size={28} />
              </div>
              <h3>Zero-Barrier Storefronts</h3>
              <p>
                Any artisan can set up a fully branded digital shop in minutes — no
                coding, no design skills required. Custom banners, product catalogs,
                and bio pages come built-in.
              </p>
            </div>
            <div className="solution-card">
              <div className="solution-card-icon">
                <Sparkles size={28} />
              </div>
              <h3>Live Stream Shopping</h3>
              <p>
                Artisans broadcast live to active buyers, showcasing their craft process
                and driving direct sales in real time — like QVC, but for handmade goods.
              </p>
            </div>
            <div className="solution-card">
              <div className="solution-card-icon">
                <HeartHandshake size={28} />
              </div>
              <h3>Direct Buyer-Artisan Chat</h3>
              <p>
                Buyers can message creators directly to ask questions, commission custom
                orders, and build authentic relationships with the makers they love.
              </p>
            </div>
            <div className="solution-card">
              <div className="solution-card-icon">
                <ShieldCheck size={28} />
              </div>
              <h3>Secure In-App Payments</h3>
              <p>
                Our built-in wallet supports local payment methods. Buyers are protected
                and artisans receive earnings reliably with transparent settlement.
              </p>
            </div>
            <div className="solution-card">
              <div className="solution-card-icon">
                <Target size={28} />
              </div>
              <h3>Discovery &amp; SEO Web Presence</h3>
              <p>
                This web storefront lets buyers discover products via Google, social shares,
                and QR codes, with deep-links that open directly in the app for checkout.
              </p>
            </div>
            <div className="solution-card">
              <div className="solution-card-icon">
                <Lightbulb size={28} />
              </div>
              <h3>Vendor Analytics &amp; Insights</h3>
              <p>
                Artisans get a powerful dashboard showing revenue, orders, top-performing
                products, and audience insights to make smarter business decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────────────────────────── */}
      <section className="section section--alt" aria-labelledby="timeline-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Our Journey</div>
            <h2 id="timeline-heading" className="section-title">
              From idea to{" "}
              <span className="gradient-text">growing marketplace</span>
            </h2>
          </div>

          <div className="timeline">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-marker">
                  <Calendar size={16} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-year">{item.year}</div>
                  <h3 className="timeline-label">{item.label}</h3>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ───────────────────────────────────────────────────────── */}
      <section className="section" aria-labelledby="team-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Meet the Team</div>
            <h2 id="team-heading" className="section-title">
              The people behind{" "}
              <span className="gradient-text">WeaveHub</span>
            </h2>
            <p className="section-subtitle">
              A passionate, diverse team united by a belief that African artisans deserve
              a world-class platform to share their craft.
            </p>
          </div>

          <div className="team-grid">
            {TEAM.map((member) => (
              <div key={member.name} className="team-card">
                <div className="team-card-img-wrap">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-card-img"
                    onError={(e) => { e.currentTarget.src = "/icon.png"; }}
                  />
                  <div className="team-card-role-badge">{member.roleShort}</div>
                </div>
                <div className="team-card-body">
                  <h3 className="team-card-name">{member.name}</h3>
                  <div className="team-card-title">{member.role}</div>
                  <p className="team-card-bio">{member.bio}</p>
                  <div className="team-card-socials">
                    <a href={member.linkedin} aria-label={`${member.name} on LinkedIn`} className="team-social-link">
                      <Linkedin size={16} />
                    </a>
                    <a href={member.twitter} aria-label={`${member.name} on Twitter`} className="team-social-link">
                      <Twitter size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="section section--alt">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="section-badge">Join WeaveHub</div>
          <h2 className="section-title">
            Ready to explore authentic{" "}
            <span className="gradient-text">handmade crafts?</span>
          </h2>
          <p className="section-subtitle" style={{ maxWidth: "520px", margin: "0 auto 32px" }}>
            Browse thousands of unique products from verified artisans or download the
            WeaveHub app to shop, chat, and watch live artisan streams.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/products" className="btn btn-primary btn-lg">
              <span>Shop the Marketplace</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/download" className="btn btn-outline btn-lg">
              <span>Download the App</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
