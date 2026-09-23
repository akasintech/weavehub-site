import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, Smartphone } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearch.trim())}`);
      setQuickSearch("");
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`navbar ${scrolled ? "scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav-container">
          <Link to="/" className="nav-logo" onClick={closeMenu} aria-label="WeaveHub Home">
            <img src="/icon.png" alt="WeaveHub logo" className="nav-logo-img" />
            <span className="nav-logo-text">WeaveHub</span>
          </Link>

          <ul className="nav-links" role="list">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/categories"
                className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}
              >
                Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/download"
                className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}
              >
                Download
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}
              >
                Support
              </NavLink>
            </li>
          </ul>

          <div className="nav-actions">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} style={{ position: "relative" }}>
                <input
                  type="search"
                  placeholder="Search crafts..."
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  autoFocus
                  style={{
                    padding: "8px 32px 8px 14px",
                    borderRadius: "9999px",
                    border: "1.5px solid var(--secondary)",
                    outline: "none",
                    fontSize: "13px",
                    width: "180px",
                  }}
                  onBlur={() => {
                    if (!quickSearch) setSearchOpen(false);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-light)",
                  }}
                >
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="nav-search-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search input"
              >
                <Search size={18} />
              </button>
            )}

            <Link to="/download" className="btn btn-primary nav-cta">
              <Smartphone size={16} />
              <span>Get the App</span>
            </Link>

            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      >
        <div
          className="mobile-drawer-content"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSearchSubmit} style={{ marginBottom: "12px" }}>
            <div style={{ position: "relative" }}>
              <input
                type="search"
                placeholder="Search products, artisans..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="search-input"
                style={{ paddingLeft: "38px" }}
              />
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-light)",
                }}
              />
            </div>
          </form>

          <NavLink
            to="/"
            end
            className="nav-link"
            onClick={closeMenu}
            style={{ fontSize: "16px", padding: "10px 14px" }}
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className="nav-link"
            onClick={closeMenu}
            style={{ fontSize: "16px", padding: "10px 14px" }}
          >
            Shop Products
          </NavLink>
          <NavLink
            to="/categories"
            className="nav-link"
            onClick={closeMenu}
            style={{ fontSize: "16px", padding: "10px 14px" }}
          >
            Categories
          </NavLink>
          <NavLink
            to="/download"
            className="nav-link"
            onClick={closeMenu}
            style={{ fontSize: "16px", padding: "10px 14px" }}
          >
            Download App
          </NavLink>
          <NavLink
            to="/privacy"
            className="nav-link"
            onClick={closeMenu}
            style={{ fontSize: "16px", padding: "10px 14px" }}
          >
            Privacy Policy
          </NavLink>
          <NavLink
            to="/contact"
            className="nav-link"
            onClick={closeMenu}
            style={{ fontSize: "16px", padding: "10px 14px" }}
          >
            Support Center
          </NavLink>

          <Link
            to="/download"
            className="btn btn-accent btn-block"
            onClick={closeMenu}
            style={{ marginTop: "8px" }}
          >
            <Smartphone size={18} />
            <span>Download WeaveHub</span>
          </Link>
        </div>
      </div>
    </>
  );
}
