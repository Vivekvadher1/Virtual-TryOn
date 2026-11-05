import ProductCard from "@/components/explore/ProductCard";
import ProductCategoryFilter from "@/components/explore/ProductCategoryFilter";

export default function ExplorePage() {
  return (
    <main className="explore-page">
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

      <ProductCategoryFilter />

      <section className="product-listing-section">
        <ProductCard
          name="Classic White Shirt"
          category="Clothing"
          price={1999}
          image="/images/clothing.png"
        />
      </section>
    </main>
  );
}
