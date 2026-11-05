"use client";

import { useState } from "react";

const productCategories = ["All", "Clothing", "Shoes", "Bags", "Accessories"];

export default function ProductCategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <section className="category-filter-section">
      <div className="category-filter-container">
        {productCategories.map((category) => (
          <button
            key={category}
            className={`category-filter-btn ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}
