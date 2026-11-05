import Image from "next/image";
import Link from "next/link";

export default function FeaturedCategories() {
  return (
    <section className="categories-section">
      <div className="categories-header">
        <p className="categories-label">EXPLORE OUR COLLECTION</p>

        <h2>
          Find Your <span>Style</span>
        </h2>

        <p className="categories-description">
          Explore different fashion categories and discover your next favorite
          look.
        </p>
      </div>

      <div className="categories-grid">
        <Link href="/explore?category=clothing" className="category-card">
          <Image
            src="/images/clothing.png"
            alt="Fashion clothing collection"
            width={400}
            height={500}
          />
          <h3>Clothing</h3>
        </Link>

        <Link href="/explore?category=shoes" className="category-card">
          <Image
            src="/images/shoes.png"
            alt="Fashion shoes collection"
            width={400}
            height={500}
          />
          <h3>Shoes</h3>
        </Link>

        <Link href="/explore?category=bags" className="category-card">
          <Image
            src="/images/bags.png"
            alt="Fashion bags collection"
            width={400}
            height={500}
          />
          <h3>Bags</h3>
        </Link>

        <Link href="/explore?category=accessories" className="category-card">
          <Image
            src="/images/accessories.png"
            alt="Fashion accessories collection"
            width={400}
            height={500}
          />
          <h3>Accessories</h3>
        </Link>
      </div>
    </section>
  );
}
