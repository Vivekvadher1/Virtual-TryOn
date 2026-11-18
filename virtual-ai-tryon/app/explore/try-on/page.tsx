"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { exploreProducts } from "@/data/explore/explore-products";

import { useState, Suspense } from "react";

import Link from "next/link";

function TryOnContent() {
  // Store the uploaded photo preview URL.
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Track the Try-On generation status.
  const [isGenerating, setIsGenerating] = useState(false);

  // Store the generation result message.
  const [generationMessage, setGenerationMessage] = useState("");

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

    // Update the uploaded photo.
    setUploadedImage(imageUrl);

    // Clear the previous generation message.
    setGenerationMessage("");
  };

  // Simulate the Try-On generation process.
  const handleGenerateTryOn = () => {
    if (!isReadyToGenerate) return;

    setIsGenerating(true);
    setGenerationMessage("");

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationMessage(
        "Your Try-On request is ready! AI integration will be added later.",
      );
    }, 2000);
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
            <input
              type="file"
              id="photo-upload"
              accept="image/png, image/jpeg"
              onChange={handleImageUpload}
              onClick={(event) => {
                // Allow selecting the same image again.
                event.currentTarget.value = "";
              }}
              hidden
            />

            {uploadedImage ? (
              <>
                {/* Display uploaded photo */}
                <img
                  src={uploadedImage}
                  alt="Uploaded preview"
                  className="uploaded-photo-preview"
                />

                <p>Photo uploaded successfully!</p>

                <div className="photo-action-buttons">
                  {/* Allow users to upload a different photo */}
                  <label htmlFor="photo-upload" className="upload-photo-btn">
                    Change Photo
                  </label>

                  {/* Remove the current uploaded photo */}
                  <button
                    type="button"
                    className="remove-photo-btn"
                    onClick={() => {
                      setUploadedImage(null);
                      setGenerationMessage("");
                    }}
                  >
                    Remove Photo
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="upload-icon">＋</div>

                <h3>Upload Your Image</h3>

                <p>Select a photo to start your virtual try-on experience.</p>

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

      {/* Try-On Confirmation Summary */}
      <section className="try-on-summary-section">
        <h2>Review Your Try-On</h2>

        <div className="try-on-summary-card">
          <p>
            <strong>Photo:</strong>{" "}
            {uploadedImage ? "Photo uploaded" : "No photo uploaded"}
          </p>

          <p>
            <strong>Product:</strong>{" "}
            {selectedProduct ? selectedProduct.name : "No product selected"}
          </p>

          {requiresSize && (
            <p>
              <strong>Size:</strong> {selectedSize || "Not selected"}
            </p>
          )}

          {requiresColor && (
            <p>
              <strong>Color:</strong> {selectedColor || "Not selected"}
            </p>
          )}
        </div>
      </section>

      {/* Generate Try-On section */}
      <section className="generate-try-on-section">
        <button
          type="button"
          className="generate-try-on-btn"
          onClick={handleGenerateTryOn}
          disabled={!isReadyToGenerate || isGenerating}
        >
          {isGenerating ? "Generating Try-On..." : "Generate Try-On"}
        </button>

        {generationMessage && (
          <p className="generation-success-message">{generationMessage}</p>
        )}

        {/* Display validation messages */}
        {!uploadedImage && (
          <p className="try-on-validation-message">
            Please upload your photo to continue.
          </p>
        )}

        {!selectedProduct && (
          <p className="try-on-validation-message">
            Please select a product first.
          </p>
        )}

        {selectedProduct && requiresSize && !isSizeValid && (
          <p className="try-on-validation-message">
            Please select a valid product size.
          </p>
        )}

        {selectedProduct && requiresColor && !isColorValid && (
          <p className="try-on-validation-message">
            Please select a valid product color.
          </p>
        )}
      </section>

      {/* Try-On Result Preview Section */}
      <section className="try-on-result-section">
        <h2>Your Try-On Result</h2>

        <div className="try-on-comparison">
          {/* Original Uploaded Photo */}
          <div className="comparison-card">
            <h3>Original Photo</h3>

            <div className="comparison-image">
              {uploadedImage ? (
                <img src={uploadedImage} alt="Your original uploaded photo" />
              ) : (
                <div className="comparison-placeholder">
                  <span>📷</span>
                  <p>Your uploaded photo will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Virtual Try-On Result */}
          <div className="comparison-card">
            <h3>Virtual Try-On Result</h3>

            <div className="comparison-image">
              <div className="comparison-placeholder">
                <span>✨</span>

                <p>
                  {generationMessage
                    ? "Your AI-generated image will appear here after integration."
                    : "Your virtual try-on result will appear here."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Try-On Result */}
      <div className="download-result-section">
        <button type="button" className="download-result-btn" disabled>
          ↓ Download Try-On Result
        </button>

        <p>Download will be available once AI image generation is connected.</p>
      </div>
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
