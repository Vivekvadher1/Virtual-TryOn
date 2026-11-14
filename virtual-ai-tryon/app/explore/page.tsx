"use client";

import { useState } from "react";

import ProductCard from "@/components/explore/ProductCard";
import ProductCategoryFilter from "@/components/explore/ProductCategoryFilter";

import { exploreProducts } from "@/data/explore/explore-products";
import ProductSortDropdown from "@/components/explore/ProductSortDropdown";
import ProductSearchBar from "@/components/explore/ProductSearchBar";

export default function ExplorePage() {
  // Stores the currently selected product category.
  const [selectedCategory, setSelectedCategory] = useState("All");
  // Stores the selected product sorting option.
  const [sortOption, setSortOption] = useState("default");
  // Stores the user's product search query.
  const [searchTerm, setSearchTerm] = useState("");

  // Resets all product filters and sorting options.
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setSortOption("default");
  };

  // Filters products based on the selected category and search term.
  const filteredProducts = exploreProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());

    return matchesCategory && matchesSearch;
  });

  // Sorts the filtered products based on the selected sorting option.
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low-high":
        return a.price - b.price;

      case "price-high-low":
        return b.price - a.price;

      case "name-a-z":
        return a.name.localeCompare(b.name);

      default:
        return 0;
    }
  });
  return (
    <main className="explore-page">
      {/* Explore page heading */}
      <section className="explore-header">
        <p className="explore-label">DISCOVER YOUR STYLE</p>

        <h1>
          Explore the <span>Collection</span>
        </h1>

        <p className="explore-description">
          Discover fashion pieces and see how they look on you with our
          AI-powered virtual try-on experience.
        </p>
      </section>

      {/* Category filters */}
      <ProductCategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ProductSortDropdown
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      <ProductSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <button
        type="button"
        className="reset-filters-button"
        onClick={handleResetFilters}
      >
        Reset Filters
      </button>

      <p className="product-count">Showing {sortedProducts.length} products</p>

      {/* Dynamically filtered product collection */}
      <section className="product-listing-section">
        <div className="product-listing-grid">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
              />
            ))
          ) : (
            <p className="empty-products-message">
              No products found. Try a different search or category.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
