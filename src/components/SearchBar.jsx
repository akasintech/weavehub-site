import React from "react";
import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search handmade products, artisans, crafts...",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  const handleClear = () => {
    if (onChange) onChange("");
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar-wrap">
      <Search size={18} className="search-icon-pos" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        aria-label="Search products"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="search-clear-btn"
          aria-label="Clear search text"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
