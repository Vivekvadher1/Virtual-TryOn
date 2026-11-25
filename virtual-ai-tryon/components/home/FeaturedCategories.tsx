import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Top",
    image: "/images/Clothing/white-shirt.jpg",
    value: "Tops",
  },
  {
    name: "Bottom",
    image: "/images/Clothing/black-tshirt.jpg",
    value: "Bottoms",
  },
  {
    name: "Dress",
    image: "/images/Clothing/white-shirt.jpg",
    value: "Dresses",
  },
  {
    name: "Outerwear",
    image: "/images/Clothing/denim-jacket.jpg",
    value: "Outerwear",
  },
  {
    name: "Ethnic Wear",
    image: "/images/Clothing/hoddie.jpg",
    value: "Ethnic Wear",
  },
];

export default function FeaturedCategories() {
  return (
    <section className="categories-section">
      <div className="categories-header">
        <p className="categories-label">EXPLORE OUR COLLECTION</p>

        <h2>
          Find Your <span>Style</span>
        </h2>

        <p className="categories-description">
          Explore different clothing categories and discover your next favorite
          look.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <Link
            key={category.value}
            href={`/explore?category=${encodeURIComponent(category.value)}`}
            className="category-card"
          >
            <Image
              src={category.image}
              alt={`${category.name} collection`}
              fill
              sizes="(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 22vw"
            />

            <h3>{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
