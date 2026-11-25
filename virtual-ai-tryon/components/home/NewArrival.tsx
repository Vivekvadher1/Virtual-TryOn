"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/explore/ProductCard";
import type { Product, ProductsApiResponse } from "@/types/product";
import Link from "next/link";

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result: ProductsApiResponse = await response.json();

        if (!result.success) {
          throw new Error("Unable to load products");
        }

        // Sort products by newest first.
        const latestProducts = [...result.data]
          .sort(
            (a, b) =>
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime(),
          )
          .slice(0, 4);

        setProducts(latestProducts);
      } catch (err) {
        console.error("New Arrivals error:", err);
        setError("Unable to load new arrivals.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="new-arrivals-section">
      <div className="new-arrivals-header">
        <span className="new-arrivals-label">JUST DROPPED</span>
        <h2>New Arrivals</h2>
        <p>Discover the latest additions to your wardrobe.</p>

        <Link href="/explore" className="new-arrivals-view-all">
          View All →
        </Link>
      </div>

      {loading ? (
        <p>Loading new arrivals...</p>
      ) : error ? (
        <p>{error}</p>
      ) : products.length === 0 ? (
        <p>No new arrivals available right now.</p>
      ) : (
        <div className="new-arrivals-grid">
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
      )}
    </section>
  );
}
