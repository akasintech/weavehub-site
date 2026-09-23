import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      to={`/categories/${category.id}`}
      className="category-card"
      aria-label={`Explore category ${category.name}`}
    >
      <div className="category-card-icon">
        {category.image ? (
          <img
            src={category.image}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <Sparkles size={24} />
        )}
      </div>
      <h3 className="category-card-title">{category.name}</h3>
      <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", lineHeight: "1.4" }}>
        {category.description || "Discover artisan crafts"}
      </p>
      <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary-dark)", marginTop: "auto" }}>
        Browse →
      </span>
    </Link>
  );
}
