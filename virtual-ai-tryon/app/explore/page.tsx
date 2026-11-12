import ProductCard from "@/components/explore/ProductCard";
import ProductCategoryFilter from "@/components/explore/ProductCategoryFilter";
import { exploreProducts } from "@/data/explore/explore-products";

export default function ExplorePage() {
  return (
    <main className="explore-page">
      {/* Explore page heading and introduction */}
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

      {/* Product category selection buttons */}
      <ProductCategoryFilter />

      {/* Display all products from the product data file */}
      <section className="product-listing-section">
        <div className="product-listing-grid">
          {exploreProducts.map((product) => (
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
