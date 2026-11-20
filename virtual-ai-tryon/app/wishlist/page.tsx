"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";

// Key used to store wishlist product IDs in localStorage.
const WISHLIST_KEY = "wishlist";

// Wishlist page
export default function WishlistPage() {
  // Stores the products saved by the customer.
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  // Tracks whether wishlist products are loading.
  const [loading, setLoading] = useState(true);

  // Stores any error.
  const [error, setError] = useState("");

  // Fetch wishlist products.
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError("");

        // Read saved product IDs from localStorage.
        const savedWishlist = localStorage.getItem(WISHLIST_KEY);

        // If no wishlist exists, display an empty wishlist.
        const productIds: string[] = savedWishlist
          ? JSON.parse(savedWishlist)
          : [];

        if (!Array.isArray(productIds) || productIds.length === 0) {
          setWishlistProducts([]);
          return;
        }

        // Fetch all products from the backend.
        const response = await fetch("http://localhost:5000/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const result: { success: boolean; data: Product[] } =
          await response.json();

        if (!result.success) {
          throw new Error("Unable to load wishlist products.");
        }

        // Keep only products whose IDs exist in the wishlist.
        const filteredProducts = result.data.filter((product) =>
          productIds.includes(product._id),
        );

        setWishlistProducts(filteredProducts);
      } catch (err) {
        console.error("Wishlist fetching error:", err);

        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Remove a product from the wishlist.
  const removeFromWishlist = (productId: string) => {
    const savedWishlist = localStorage.getItem(WISHLIST_KEY);

    const productIds: string[] = savedWishlist ? JSON.parse(savedWishlist) : [];

    // Remove the selected product ID.
    const updatedWishlist = productIds.filter((id) => id !== productId);

    // Update localStorage.
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));

    // Update the displayed products.
    setWishlistProducts((previousProducts) =>
      previousProducts.filter((product) => product._id !== productId),
    );
  };

  // Loading state.
  if (loading) {
    return (
      <main className="wishlist-page">
        <p>Loading your wishlist...</p>
      </main>
    );
  }

  // Error state.
  if (error) {
    return (
      <main className="wishlist-page">
        <h1>Unable to Load Wishlist</h1>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <section className="wishlist-container">
        <h1>My Wishlist</h1>

        <p>
          {wishlistProducts.length} saved{" "}
          {wishlistProducts.length === 1 ? "product" : "products"}
        </p>

        {/* Empty wishlist state */}
        {wishlistProducts.length === 0 ? (
          <div className="wishlist-empty">
            <h2>Your wishlist is empty</h2>
            <p>Save your favourite products to find them here.</p>

            <Link href="/explore">Explore Products</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistProducts.map((product) => (
              <div key={product._id} className="wishlist-card">
                <Link href={`/explore/${product._id}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={450}
                  />

                  <h2>{product.name}</h2>
                </Link>

                <p>{product.category}</p>

                <p>₹{product.price.toLocaleString("en-IN")}</p>

                <button
                  type="button"
                  onClick={() => removeFromWishlist(product._id)}
                >
                  ♥ Remove from Wishlist
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
