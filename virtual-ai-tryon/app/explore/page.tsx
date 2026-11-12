"use client";

import { useState } from "react";

import ProductCard from "@/components/explore/ProductCard";
import ProductCategoryFilter from "@/components/explore/ProductCategoryFilter";

import { exploreProducts } from "@/data/explore/explore-products";

export default function ExplorePage() {
  // Stores the currently selected product category.
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Displays all products or only products from the selected category.
  const filteredProducts =
    selectedCategory === "All"
      ? exploreProducts
      : exploreProducts.filter(
          (product) => product.category === selectedCategory,
        );

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

      {/* Dynamically filtered product collection */}
      <section className="product-listing-section">
        <div className="product-listing-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              category={product.category}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
