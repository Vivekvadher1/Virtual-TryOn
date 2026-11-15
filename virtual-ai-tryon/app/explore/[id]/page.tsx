"use client";

import { use, useState, Suspense } from "react";

import Image from "next/image";
import Link from "next/link";

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
      <ProductDetails params={params} />
    </Suspense>
  );
}

// Product details component
function ProductDetails({ params }: ProductDetailsPageProps) {
  // Unwrap the params Promise
  const { id } = use(params);

  // Store the selected size
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  // Store the color selected by the customer.
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  // Track whether the current product is in the wishlist.
  const [isWishlisted, setIsWishlisted] = useState(false);

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
            loading="eager"
          />
        </div>

        <div className="product-details-info">
          <p className="product-details-category">{product.category}</p>

          <h1>{product.name}</h1>

          <p className="product-details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="product-details-description">{product.description}</p>

          {/* Display size options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="product-size-section">
              <h3>Select Size</h3>

              <div className="product-size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`product-size-btn ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Display color options when available */}
          {product.colors && product.colors.length > 0 && (
            <div className="product-color-section">
              <h3>
                Select Color
                {selectedColor && `: ${selectedColor}`}
              </h3>

              <div className="product-color-options">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`product-color-btn ${
                      selectedColor === color ? "selected" : ""
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    aria-label={`Select ${color}`}
                    aria-pressed={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Add or remove the product from the wishlist */}
          <button
            type="button"
            className={`product-wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={() => setIsWishlisted(!isWishlisted)}
            aria-pressed={isWishlisted}
          >
            {isWishlisted ? "♥ Added to Wishlist" : "♡ Add to Wishlist"}
          </button>
          
          <button type="button" className="product-try-on-btn">
            Try On
          </button>
        </div>
      </section>
    </main>
  );
}
