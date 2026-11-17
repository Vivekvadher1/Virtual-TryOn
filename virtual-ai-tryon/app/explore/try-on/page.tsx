"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { exploreProducts } from "@/data/explore/explore-products";

import { useState, Suspense } from "react";

import Link from "next/link";

function TryOnContent() {
  // Store the uploaded photo preview URL.
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Read selected product options from the URL.
  const searchParams = useSearchParams();

  const productId = Number(searchParams.get("productId"));
  const selectedSize = searchParams.get("size");
  const selectedColor = searchParams.get("color");

  // Find the selected product from our product data.
  const selectedProduct = exploreProducts.find(
    (product) => product.id === productId,
  );

  // Check whether the selected product has size options.
  const requiresSize = Boolean(selectedProduct?.sizes?.length);

  // Check whether the selected product has color options.
  const requiresColor = Boolean(selectedProduct?.colors?.length);

  // Validate the selected size and color against available options.
  const isSizeValid =
    !requiresSize ||
    Boolean(selectedSize && selectedProduct?.sizes?.includes(selectedSize));

  const isColorValid =
    !requiresColor ||
    Boolean(selectedColor && selectedProduct?.colors?.includes(selectedColor));

  // Check whether all required information is available.
  const isReadyToGenerate = Boolean(
    uploadedImage && selectedProduct && isSizeValid && isColorValid,
  );

  // Handle the selected image file.
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Allow only image files.
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    // Create a temporary URL for the image preview.
    const imageUrl = URL.createObjectURL(file);

    setUploadedImage(imageUrl);
  };
  return (
    <main className="try-on-page">
      {/* Page heading */}
      <div className="try-on-header">
        <Link href="/explore" className="back-to-explore">
          ← Back to Explore
        </Link>

        <h1>Virtual AI Try-On</h1>

        <p>
          Experience your style before you buy. Upload your photo and get ready
          to try your favorite products virtually.
        </p>
      </div>

      {/* Main Try-On workspace */}
      <section className="try-on-container">
        {/* User photo upload section */}
        <div className="try-on-upload">
          <h2>Upload Your Photo</h2>

          <div className="upload-placeholder">
            {uploadedImage ? (
              <>
                {/* Display uploaded photo */}
                <img
                  src={uploadedImage}
                  alt="Uploaded preview"
                  className="uploaded-photo-preview"
                />

                <p>Photo uploaded successfully!</p>

                <button
                  type="button"
                  className="upload-photo-btn"
                  onClick={() => setUploadedImage(null)}
                >
                  Remove Photo
                </button>
              </>
            ) : (
              <>
                <div className="upload-icon">＋</div>

                <h3>Upload Your Image</h3>

                <p>Select a photo to start your virtual try-on experience.</p>

                {/* Hidden file input */}
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/png, image/jpeg"
                  onChange={handleImageUpload}
                  hidden
                />

                {/* Button that opens the file picker */}
                <label htmlFor="photo-upload" className="upload-photo-btn">
                  Choose Photo
                </label>

                <span>PNG, JPG or JPEG</span>
              </>
            )}
          </div>
        </div>

        {/* Product preview section */}
        <div className="try-on-product">
          <h2>Selected Product</h2>

          {selectedProduct ? (
            <div className="selected-product-card">
              {/* Product image */}
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={300}
                height={350}
                className="selected-product-image"
              />

              {/* Product information */}
              <div className="selected-product-info">
                <h3>{selectedProduct.name}</h3>

                <p>{selectedProduct.category}</p>

                <h4>₹{selectedProduct.price.toLocaleString("en-IN")}</h4>

                <p>Selected Size: {selectedSize || "Not selected"}</p>

                <p>Selected Color: {selectedColor || "Not selected"}</p>
              </div>
            </div>
          ) : (
            <div className="selected-product-placeholder">
              <p>No product selected. Please choose a product first.</p>

              <Link href="/explore">Browse Products</Link>
            </div>
          )}
        </div>
           </section>

      {/* Generate Try-On section */}
      <section className="generate-try-on-section">
        <button
          type="button"
          className="generate-try-on-btn"
          disabled={!isReadyToGenerate}
        >
          Generate Try-On
        </button>

        {!uploadedImage && (
          <p>Please upload your photo to continue.</p>
        )}

        {!selectedProduct && (
          <p>Please select a product first.</p>
        )}

        {selectedProduct && requiresSize && !isSizeValid && (
          <p>Please select a valid product size.</p>
        )}

        {selectedProduct && requiresColor && !isColorValid && (
          <p>Please select a valid product color.</p>
        )}
      </section>

    </main>


  );
}

// Wrap the Try-On content in Suspense because it uses useSearchParams.
export default function TryOnPage() {
  return (
    <Suspense
      fallback={
        <main className="try-on-page">
          <p>Loading Try-On workspace...</p>
        </main>
      }
    >
      <TryOnContent />
    </Suspense>
  );
}
