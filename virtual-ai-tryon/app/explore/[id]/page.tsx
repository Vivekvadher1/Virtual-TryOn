"use client";

import { use, useState, Suspense, useEffect, useMemo } from "react";

import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";
import ProductNotFound from "@/components/explore/ProductNotFound";

// Shared key used by the Product Details and Wishlist pages.
const WISHLIST_KEY = "wishlist";

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

  // Stores the product received from the backend.
  const [product, setProduct] = useState<Product | null>(null);

  // Tracks whether the product is being fetched.
  const [loading, setLoading] = useState(true);

  // Stores any API fetching error.
  const [error, setError] = useState("");

  // Tracks whether the requested product does not exist.
  const [isNotFound, setIsNotFound] = useState(false);

  // Store the selected size
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Store the color selected by the customer.
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Track whether the current product is in the wishlist.
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Checks whether the provided ID is a valid MongoDB ObjectId.
  const isValidProductId = /^[0-9a-fA-F]{24}$/.test(id);

  // Fetches the selected product from the backend.
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        // Reset previous product states.
        setProduct(null);
        setIsNotFound(false);

        // Stop fetching if the product ID is invalid.
        if (!isValidProductId) {
          setIsNotFound(true);
          setLoading(false);
          return;
        }

        // Request the selected product using its MongoDB ID.
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
        );

        // Handle unsuccessful API responses.
        if (!response.ok) {
          if (response.status === 404) {
            setIsNotFound(true);
            return;
          }

          throw new Error("Failed to fetch product details.");
        }

        // Convert the API response into JSON.
        const result: { success: boolean; data: Product } =
          await response.json();

        // Check the backend response.
        if (!result.success) {
          throw new Error("Unable to load product details.");
        }

        // Store the selected product.
        setProduct(result.data);

        // Default to the first available variant or color so an active image & color are always ready.
        const defaultColor =
          result.data.colorVariants?.[0]?.color ??
          result.data.colors?.[0] ??
          null;
        setSelectedColor(defaultColor);
      } catch (err) {
        console.error("Product fetching error:", err);

        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isValidProductId]);

  // Resolve available color names from colorVariants first, falling back to product.colors.
  const colorOptions = useMemo(() => {
    if (!product) return [];
    if (product.colorVariants && product.colorVariants.length > 0) {
      return product.colorVariants.map((variant) => variant.color);
    }
    return product.colors ?? [];
  }, [product]);

  // Resolve the active image for the selected color.
  const activeImage = useMemo(() => {
    if (!product) return "";

    if (selectedColor && product.colorVariants?.length) {
      const matchedVariant = product.colorVariants.find(
        (variant) =>
          variant.color.toLowerCase() === selectedColor.toLowerCase(),
      );
      if (matchedVariant?.image) {
        return matchedVariant.image;
      }
    }

    return product.colorVariants?.[0]?.image || product.image;
  }, [product, selectedColor]);

  // Check whether the current product is already in the wishlist.
  useEffect(() => {
    if (!product) return;

    const savedWishlist = localStorage.getItem(WISHLIST_KEY);

    const wishlistIds: string[] = savedWishlist
      ? JSON.parse(savedWishlist)
      : [];

    setIsWishlisted(wishlistIds.includes(product._id));
  }, [product]);

  // Add or remove the current product from the wishlist.
  const toggleWishlist = () => {
    if (!product) return;

    const savedWishlist = localStorage.getItem(WISHLIST_KEY);

    const wishlistIds: string[] = savedWishlist
      ? JSON.parse(savedWishlist)
      : [];

    let updatedWishlist: string[];

    if (wishlistIds.includes(product._id)) {
      // Remove product if it already exists.
      updatedWishlist = wishlistIds.filter((id) => id !== product._id);
    } else {
      // Add product if it is not already saved.
      updatedWishlist = [...wishlistIds, product._id];
    }

    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));

    setIsWishlisted(updatedWishlist.includes(product._id));
  };

  // Display loading message while fetching the product.
  if (loading) {
    return (
      <main className="product-not-found">
        <p>Loading product details...</p>
      </main>
    );
  }

  // Display custom page when the product doesn't exist.
  if (isNotFound) {
    return <ProductNotFound />;
  }

  // Display error message if the API request fails.
  if (error) {
    return (
      <main className="product-not-found">
        <h1>Unable to Load Product</h1>
        <p>{error}</p>
        <Link href="/explore">Back to Explore</Link>
      </main>
    );
  }

  // Display message if the product doesn't exist.
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
            alt={
              selectedColor
                ? `${product.name} - ${selectedColor}`
                : product.name
            }
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
          {/* {product.colors && product.colors.length > 0 && (
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
          )} */}
          {colorOptions.length > 0 && (
            <div className="product-color-section">
              <h3>
                Select Color
                {selectedColor && `: ${selectedColor}`}
              </h3>

              <div className="product-color-options">
                {colorOptions.map((color) => (
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
          <div className="product-details-actions">
            <button
              type="button"
              className={`product-wishlist-btn ${isWishlisted ? "active" : ""}`}
              onClick={toggleWishlist}
              aria-pressed={isWishlisted}
            >
              {isWishlisted ? "♥ Added to Wishlist" : "♡ Add to Wishlist"}
            </button>

            {/* Navigate to Try-On with the selected product options */}
            <Link
              href={`/explore/try-on?productId=${product._id}&size=${encodeURIComponent(selectedSize ?? "")}&color=${encodeURIComponent(selectedColor ?? "")}`}
              className="product-try-on-btn"
            >
              Try On
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
