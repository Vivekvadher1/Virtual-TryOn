"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/explore/ProductCard";
import ProductCategoryFilter from "@/components/explore/ProductCategoryFilter";

import ProductSortDropdown from "@/components/explore/ProductSortDropdown";
 import ProductSearchBar from "@/components/explore/ProductSearchBar";
import type { Product, ProductsApiResponse } from "@/types/product";

export default function ExplorePage() {
  // Stores the currently selected product category.
  const [selectedCategory, setSelectedCategory] = useState("All");
  // Stores the selected product sorting option.
  const [sortOption, setSortOption] = useState("default");
  // Stores the user's product search query.
  const [searchTerm, setSearchTerm] = useState("");

  // Stores products received from the backend.
  const [products, setProducts] = useState<Product[]>([]);

  // Tracks whether products are being fetched.
  const [loading, setLoading] = useState(true);

  // Stores any error that occurs during API fetching.
  const [error, setError] = useState("");

  // Fetches products from the Express backend when the page loads.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/products");

        // Check whether the API request was successful.
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        // Convert the API response into JSON.
        const result: ProductsApiResponse = await response.json();

        // Check the backend response.
        if (!result.success) {
          throw new Error("Unable to load products.");
        }

        // Store the products received from MongoDB.
        setProducts(result.data);
      } catch (err) {
        console.error("Product fetching error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading products.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Resets all product filters and sorting options.
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setSortOption("default");
  };

  // Filters products based on the selected category and search term.
  const filteredProducts = products.filter((product) => {
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

      <div className="product-controls">
        <div className="sort-reset-group">
          <ProductSortDropdown
            sortOption={sortOption}
            onSortChange={setSortOption}
          />

          <button
            type="button"
            className="reset-filters-button"
            onClick={handleResetFilters}
          >
            Clear Filters
          </button>
        </div>

        <ProductSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <p className="product-count">
          Showing {sortedProducts.length} products
        </p>
      </div>

      {/* Dynamically filtered product collection */}
      <section className="product-listing-section">
        {loading ? (
          <p className="loading-products-message">Loading products...</p>
        ) : error ? (
          <p className="empty-products-message">{error}</p>
        ) : (
          <div className="product-listing-grid">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
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
        )}
      </section>
    </main>
  );
}
