import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { exploreProducts } from "@/data/explore/explore-products";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Main page
export default function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  return (
    <Suspense fallback={<p>Loading product details...</p>}>
      {params.then(({ id }) => (
        <ProductDetails id={id} />
      ))}
    </Suspense>
  );
}

// Product details component
function ProductDetails({ id }: { id: string }) {
  // Convert URL ID into a number
  const productId = Number(id);

  // Find matching product
  const product = exploreProducts.find((item) => item.id === productId);

  // Product not found
  if (!product) {
    return (
      <main className="product-not-found">
        <h1>Product Not Found</h1>
        <p>Sorry, we couldn't find this product.</p>

        <Link href="/explore">Back to Explore</Link>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <Link href="/explore" className="back-to-explore">
        ← Back to Explore
      </Link>

      <section className="product-details-container">
        <div className="product-details-image">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={700}
          />
        </div>

        <div className="product-details-info">
          <p className="product-details-category">{product.category}</p>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="product-details-description">{product.description}</p>

          <button type="button" className="product-try-on-btn">
            Try On
          </button>
        </div>
      </section>
    </main>
  );
}
