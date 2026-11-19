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
            src="/images/Clothing/clothing.png"
            alt="Fashion clothing collection"
            fill
            sizes="(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 22vw"
            loading="eager"
          />
          <h3>Clothing</h3>
        </Link>

        <Link href="/explore?category=shoes" className="category-card">
          <Image
            src="/images/Shoes/shoes.png"
            alt="Fashion shoes collection"
            fill
            sizes="(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 22vw"
            loading="eager"
          />
          <h3>Shoes</h3>
        </Link>

        <Link href="/explore?category=bags" className="category-card">
          <Image
            src="/images/Bags/bags.png"
            alt="Fashion bags collection"
            fill
            sizes="(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 22vw"
            loading="eager"
          />
          <h3>Bags</h3>
        </Link>

        <Link href="/explore?category=accessories" className="category-card">
          <Image
            src="/images/Accessories/accessories.png"
            alt="Fashion accessories collection"
            fill
            sizes="(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 22vw"
            loading="eager"
          />
          <h3>Accessories</h3>
        </Link>
      </div>
    </section>
  );
}
