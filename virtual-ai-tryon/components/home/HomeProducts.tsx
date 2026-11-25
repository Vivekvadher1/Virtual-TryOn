"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/explore/ProductCard";
import type { Product, ProductsApiResponse } from "@/types/product";

export default function HomeProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");

        if (!response.ok) {
          throw new Error("Failed to load products.");
        }

        const result: ProductsApiResponse = await response.json();

        if (!result.success) {
          throw new Error("Unable to load products.");
        }

        setProducts(result.data.slice(0, 8));
      } catch (err) {
        console.error("Homepage product fetching error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading products.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="home-products-section">
      <div className="home-products-header">
        <p className="home-products-label">OUR COLLECTION</p>

        <h2>
          Explore Our <span>Products</span>
        </h2>

        <p className="home-products-description">
          Discover our latest fashion collection and find your next favorite
          look.
        </p>
      </div>

      {loading ? (
        <p className="home-products-message">Loading products...</p>
      ) : error ? (
        <p className="home-products-message">{error}</p>
      ) : products.length > 0 ? (
        <>
          <div className="home-products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>

          <div className="home-products-footer">
            <Link href="/explore" className="view-all-products-btn">
              View All Products
            </Link>
          </div>
        </>
      ) : (
        <p className="home-products-message">
          No products available at the moment.
        </p>
      )}
    </section>
  );
}
