"use client";

import { Search, X } from "lucide-react";

interface ProductSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function ProductSearchBar({
  searchTerm,
  onSearchChange,
}: ProductSearchBarProps) {
  return (
    <div className="product-search">
      <span className="search-icon" aria-hidden="true">
        <Search size={18} strokeWidth={2} />
      </span>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Search products"
      />

      {/* Clear search button */}
      {searchTerm && (
        <button
          type="button"
          className="search-clear-button"
          onClick={() => onSearchChange("")}
          aria-label="Clear search"
        >
          <X size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}