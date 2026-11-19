"use client";

interface ProductCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// Available categories for filtering the product collection.
const productCategories = ["All", "Clothing", "Shoes", "Bags", "Accessories"];

export default function ProductCategoryFilter({
  selectedCategory,
  onCategoryChange,
}: ProductCategoryFilterProps) {
  return (
    <section className="category-filter-section">
      <div className="category-filter-container">
        {productCategories.map((category) => (
          <button
            key={category}
            className={`category-filter-btn ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}
