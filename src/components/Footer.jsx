import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Instagram, Mail, Shield, HelpCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="nav-logo" aria-label="WeaveHub Home">
              <img src="/icon.png" alt="WeaveHub logo" className="nav-logo-img" />
              <span className="nav-logo-text">WeaveHub</span>
            </Link>
            <p className="footer-tagline">
              The premier mobile marketplace for artisans &amp; craft lovers worldwide.
              Discover authentic handmade goods, connect with creators, and shop seamlessly.
            </p>
            <div className="footer-socials">
              <a
                href="https://twitter.com/weavehub"
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label="WeaveHub on Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com/weavehub"
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label="WeaveHub on Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:hello@weavehub.io"
                className="social-link"
                aria-label="Email WeaveHub Support"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Marketplace</h4>
            <ul className="footer-links" role="list">
              <li>
                <Link to="/products" className="footer-link">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="footer-link">
                  All Categories
                </Link>
              </li>
              <li>
                <Link to="/search" className="footer-link">
                  Search Crafts
                </Link>
              </li>
              <li>
                <Link to="/download" className="footer-link">
                  Download Mobile App
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Legal &amp; Support</h4>
            <ul className="footer-links" role="list">
              <li>
                <Link to="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="mailto:privacy@weavehub.io" className="footer-link">
                  Privacy Inquiries
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Mobile Experience</h4>
            <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "14px", lineHeight: "1.6" }}>
              Shop live streams, direct chat with artisans, and track orders inside the WeaveHub iOS &amp; Android app.
            </p>
            <Link to="/download" className="btn btn-accent btn-sm">
              Get App Free
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} Weavehub Technologies Ltd. Lagos, Nigeria. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy" className="footer-link">
              Privacy
            </Link>
            <span>·</span>
            <Link to="/contact" className="footer-link">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
