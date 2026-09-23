import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { updateSEO } from "../utils/seo";
import { Compass, ArrowRight } from "lucide-react";

export function NotFound() {
  useEffect(() => {
    updateSEO({
      title: "Page Not Found | WeaveHub",
      description: "The page you requested could not be found.",
    });
  }, []);

  return (
    <div style={{ paddingTop: "calc(var(--nav-h) + 64px)", paddingBottom: "80px" }}>
      <div className="container" style={{ maxWidth: "540px", textAlign: "center" }}>
        <div className="state-box">
          <div className="state-icon empty" style={{ width: "72px", height: "72px" }}>
            <Compass size={36} />
          </div>
          <h1 className="section-title" style={{ fontSize: "28px", marginBottom: "8px" }}>
            Page Not Found
          </h1>
          <p className="state-desc" style={{ marginBottom: "24px" }}>
            The link you clicked may be broken, or the page may have been moved or removed.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <Link to="/" className="btn btn-primary">
              <span>Go to Home</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="btn btn-outline">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
