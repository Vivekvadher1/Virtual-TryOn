import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  name,
  category,
  price,
  image,
}: ProductCardProps) {
  return (
    <article className="product-card">
      {/* Product image and category */}
      <div className="product-card-image">
        <Image src={image} alt={name} width={400} height={500} />

        <span className="product-card-category">{category}</span>
      </div>

      {/* Product information */}
      <div className="product-card-details">
        <h3>{name}</h3>

        <p className="product-card-price">₹{price.toLocaleString("en-IN")}</p>

        {/* Opens the selected product's details page */}
        <Link href={`/explore/${id}`} className="product-try-on-btn">
          View Details
        </Link>
      </div>
    </article>
  );
}
