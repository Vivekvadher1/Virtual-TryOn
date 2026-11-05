import Image from "next/image";

interface ProductCardProps {
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductCard({
  name,
  category,
  price,
  image,
}: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card-image">
        <Image
          src={image}
          alt={name}
          width={400}
          height={500}
        />

        <span className="product-card-category">
          {category}
        </span>
      </div>

      <div className="product-card-details">
        <h3>{name}</h3>

        <p className="product-card-price">
          ₹{price.toLocaleString("en-IN")}
        </p>

        <button className="product-try-on-btn" type="button">
          Try On
        </button>
      </div>
    </article>
  );
}