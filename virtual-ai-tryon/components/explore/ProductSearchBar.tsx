"use client";

import { Search, X } from "lucide-react";
import { BiSearchAlt } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";

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
        <BiSearchAlt />
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
          <IoIosClose aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
