import React, { useState } from "react";
import { Link } from "react-router-dom";

const TILE_TONES = ["brand", "gold", "violet", "sale", "ink"];

function toneFor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i)) % 997;
  return TILE_TONES[hash % TILE_TONES.length];
}

export function CategoryCard({ category }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (!category) return null;

  const showImage = category.image && !imageFailed;
  const initial = (category.name || "W").trim().charAt(0).toUpperCase();

  return (
    <Link
      to={`/categories/${category.id}`}
      className="category-card"
      aria-label={`Explore category ${category.name}`}
    >
      <div className={`category-card-icon tile--${toneFor(category.name)}`}>
        {showImage ? (
          <img src={category.image} alt="" loading="lazy" onError={() => setImageFailed(true)} />
        ) : (
          <span aria-hidden="true">{initial}</span>
        )}
      </div>
      <h3 className="category-card-title">{category.name}</h3>
      <p className="category-card-desc">{category.description || "Discover artisan crafts"}</p>
      <span className="category-card-link">Browse →</span>
    </Link>
  );
}

export function CategoryCardSkeleton() {
  return <div className="skeleton category-card-skeleton" aria-hidden="true" />;
}
