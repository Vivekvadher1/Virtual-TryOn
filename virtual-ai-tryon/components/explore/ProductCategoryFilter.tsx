"use client";

interface ProductCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

// Available categories for filtering the product collection.
const productCategories = [
  "All",
  "Tops",
  "Bottoms",
  "Dresses",
  "Outerwear",
  "Ethnic Wear",
];

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
