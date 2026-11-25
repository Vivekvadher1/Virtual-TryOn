"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { useState, Suspense, useEffect } from "react";
import type { Product } from "@/types/product";

import Link from "next/link";

function TryOnContent() {
  // Store the uploaded photo preview URL.
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Track whether the user wants to use a personal photo or an AI model.
  const [selectedMode, setSelectedMode] = useState<"personal" | "virtual">(
    "personal",
  );

  // Store the selected virtual model.
  const [selectedVirtualModel, setSelectedVirtualModel] = useState<
    string | null
  >(null);

  // Track the selected virtual model category.
  const [selectedModelGender, setSelectedModelGender] = useState<
    "male" | "female"
  >("male");

  // Store the permanent Cloudinary image URL.
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);

  // Store the Cloudinary public ID for future image management.
  const [uploadedPhotoPublicId, setUploadedPhotoPublicId] = useState<
    string | null
  >(null);

  // Track whether the photo is uploading to Cloudinary.
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Store photo upload errors.
  const [photoUploadError, setPhotoUploadError] = useState("");

  // Track the Try-On generation status.
  const [isGenerating, setIsGenerating] = useState(false);

  // Store the generation result message.
  const [generationMessage, setGenerationMessage] = useState("");

  // Store the AI-generated try-on image URL.
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );

  // Stores the selected product fetched from MongoDB.
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Tracks whether the selected product is loading.
  const [productLoading, setProductLoading] = useState(true);

  // Stores product fetching errors.
  const [productError, setProductError] = useState("");

  // Read selected product options from the URL.
  const searchParams = useSearchParams();

  // Available AI virtual models stored on Cloudinary.
  const virtualModels = {
    male: [
      {
        id: "Male-1",
        image:
          "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285938/Male-1.png",
      },
      {
        id: "Male-2",
        image:
          "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285939/Male-2.png",
      },
      {
        id: "Male-3",
        image:
          "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285940/Male-3.png",
      },
    ],
    female: [
      {
        id: "Female-1",
        image:
          "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285856/Female-1.png",
      },
      {
        id: "Female-2",
        image:
          "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285856/Female-2.png",
      },
      {
        id: "Female-3",
        image:
          "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285857/Female-3.png",
      },
    ],
  };

  // MongoDB product IDs are strings, not numbers.
  const productId = searchParams.get("productId");
  const selectedSize = searchParams.get("size");
  const selectedColor = searchParams.get("color");

  // Fetch the selected product from the backend using its MongoDB ID.
  useEffect(() => {
    const controller = new AbortController();

    const fetchSelectedProduct = async () => {
      if (!productId) {
        setSelectedProduct(null);
        setProductError(
          "No product was selected. Please choose a product first.",
        );
        setProductLoading(false);
        return;
      }

      try {
        setProductLoading(true);
        setProductError("");
        setSelectedProduct(null);

        const response = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          { signal: controller.signal },
        );

        const result = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.message || "Unable to find this product.");
        }

        setSelectedProduct(result.data as Product);
      } catch (error) {
        // Ignore errors caused by this request being cancelled.
        if (error instanceof Error && error.name === "AbortError") return;

        setProductError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading the product.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setProductLoading(false);
        }
      }
    };

    fetchSelectedProduct();

    // Cancel the request if the selected product changes or the page unmounts.
    return () => controller.abort();
  }, [productId]);

  // Check whether the selected product has size options.
  const requiresSize = Boolean(selectedProduct?.sizes?.length);

  // Get the details of the selected virtual model.
  const selectedVirtualModelDetails = virtualModels[selectedModelGender].find(
    (model) => model.id === selectedVirtualModel,
  );

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
    (selectedMode === "personal"
      ? uploadedImage && uploadedPhotoUrl && !isUploadingPhoto
      : selectedVirtualModelDetails) &&
    selectedProduct &&
    isSizeValid &&
    isColorValid,
  );

  // Determine the current Try-On status.
  const tryOnStatus = isGenerating
    ? "Generating your Try-On..."
    : generationMessage
      ? "Request prepared — AI integration pending"
      : isReadyToGenerate
        ? "Ready to generate"
        : "Waiting for required details";

  // Set a status class for styling.
  const tryOnStatusClass = isGenerating
    ? "generating"
    : generationMessage
      ? "prepared"
      : isReadyToGenerate
        ? "ready"
        : "waiting";

  // Handle user photo selection and Cloudinary upload.
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Allow only JPG, PNG and WEBP images.
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setPhotoUploadError("Only JPG, PNG and WEBP images are allowed!");
      return;
    }

    // Check the maximum file size (5 MB).
    if (file.size > 5 * 1024 * 1024) {
      setPhotoUploadError("Image size must not exceed 5 MB.");
      return;
    }

    // Release the previous browser preview if one exists.
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }

    // Create an instant browser preview.
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);

    // Clear previous upload information.
    setUploadedPhotoUrl(null);
    setUploadedPhotoPublicId(null);
    setPhotoUploadError("");
    setGenerationMessage("");

    // Prepare the image for the backend.
    const formData = new FormData();
    formData.append("photo", file);

    try {
      setIsUploadingPhoto(true);

      // Send the image to the Express backend.
      const response = await fetch(
        "http://localhost:5000/api/upload/user-photo",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Photo upload failed.");
      }

      // Save the Cloudinary image URL and public ID.
      setUploadedPhotoUrl(result.image.url);
      setUploadedPhotoPublicId(result.image.public_id);

      console.log("User photo uploaded successfully!");
      console.log("Cloudinary URL:", result.image.url);
      console.log("Cloudinary Public ID:", result.image.public_id);
    } catch (error) {
      console.error("User photo upload error:", error);

      setPhotoUploadError(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading your photo.",
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle real AI Try-On generation.
  const handleGenerateTryOn = async () => {
    if (!isReadyToGenerate || !selectedProduct) return;

    const personImageUrl =
      selectedMode === "personal"
        ? uploadedPhotoUrl
        : selectedVirtualModelDetails?.image;

    if (!personImageUrl) return;

    setIsGenerating(true);
    setGenerationMessage("");
    setGeneratedImageUrl(null);

    try {
      // Send the uploaded photo and selected product to the backend.
      const response = await fetch("http://localhost:5000/api/tryon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personImageUrl: personImageUrl,
          garmentImageUrl: selectedProduct.image,
          garmentDescription: selectedProduct.category,
        }),
      });

      const result = await response.json();

      // Check whether the backend generated the image successfully.
      if (!response.ok || !result.success || !result.imageUrl) {
        throw new Error(result.message || "Virtual Try-On generation failed.");
      }

      // Store the generated image URL.
      setGeneratedImageUrl(result.imageUrl);

      setGenerationMessage(
        "Your virtual try-on has been generated successfully!",
      );

      console.log("Generated Try-On Image:", result.imageUrl);
      console.log("Masked Image:", result.maskedImage);
    } catch (error) {
      console.error("Try-On generation error:", error);

      setGenerationMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while generating your Try-On.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset the current Try-On session.
  const handleResetTryOn = () => {
    // Prevent resetting while generation is in progress.
    if (isGenerating) return;

    // Release the temporary image URL.
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }

    // Remove the uploaded photo.
    setUploadedImage(null);
    setUploadedPhotoUrl(null);
    setUploadedPhotoPublicId(null);
    setSelectedVirtualModel(null);

    // Clear messages.
    setPhotoUploadError("");
    setGenerationMessage("");
    setGeneratedImageUrl(null);
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
        {/* Choose between personal photo and AI virtual model */}
        <section className="try-on-mode">
          <h2>Choose Your Try-On Mode</h2>

          <div className="mode-options">
            <button
              type="button"
              className={selectedMode === "personal" ? "active" : ""}
              onClick={() => setSelectedMode("personal")}
            >
              Personal Photo
            </button>

            <button
              type="button"
              className={selectedMode === "virtual" ? "active" : ""}
              onClick={() => setSelectedMode("virtual")}
            >
              AI Virtual Model
            </button>
          </div>
        </section>

        {/* User photo upload section */}
        {selectedMode === "personal" && (
          <div className="try-on-upload">
            <h2>Upload Your Photo</h2>

            <div className="upload-placeholder">
              <input
                type="file"
                id="photo-upload"
                accept="image/png, image/jpeg, image/webp"
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

                  {isUploadingPhoto ? (
                    <p>Uploading your photo to Cloudinary...</p>
                  ) : uploadedPhotoUrl ? (
                    <p>Photo uploaded successfully!</p>
                  ) : (
                    <p>Photo preview ready. Upload failed or incomplete.</p>
                  )}

                  {photoUploadError && (
                    <p className="try-on-validation-message">
                      {photoUploadError}
                    </p>
                  )}

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
                        if (uploadedImage) {
                          URL.revokeObjectURL(uploadedImage);
                        }

                        setUploadedImage(null);
                        setUploadedPhotoUrl(null);
                        setUploadedPhotoPublicId(null);
                        setPhotoUploadError("");
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

                  <p className="upload-guidance-text">
                    💡 Use a clear, well-lit photo. Keep your full body visible
                    for clothing try-on.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
        {/* Product preview section */}
        <div className="try-on-product">
          <h2>Selected Product</h2>

          {productLoading ? (
            <div className="selected-product-placeholder">
              <p>Loading selected product...</p>
            </div>
          ) : productError ? (
            <div className="selected-product-placeholder">
              <p>{productError}</p>
              <Link href="/explore">Browse Products</Link>
            </div>
          ) : selectedProduct ? (
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

      {/* AI Virtual Model Selection Section */}
      {selectedMode === "virtual" && (
        <div className="virtual-model-section">
          <h2>Choose Your AI Virtual Model</h2>

          {/* Select Model Gender */}
          <div className="model-gender-options">
            <button
              type="button"
              className={selectedModelGender === "male" ? "active" : ""}
              onClick={() => {
                setSelectedModelGender("male");
                setSelectedVirtualModel(null);
              }}
            >
              Male
            </button>

            <button
              type="button"
              className={selectedModelGender === "female" ? "active" : ""}
              onClick={() => {
                setSelectedModelGender("female");
                setSelectedVirtualModel(null);
              }}
            >
              Female
            </button>
          </div>

          {/* Display Available Virtual Models */}
          <div className="virtual-model-grid">
            {virtualModels[selectedModelGender].map((model) => (
              <button
                type="button"
                key={model.id}
                className={
                  selectedVirtualModel === model.id
                    ? "virtual-model-card selected"
                    : "virtual-model-card"
                }
                onClick={() => setSelectedVirtualModel(model.id)}
              >
                <img
                  src={model.image}
                  alt={model.id}
                  className="virtual-model-image"
                />

                <span>{model.id}</span>

                {selectedVirtualModel === model.id && (
                  <span className="model-selected-label">Selected</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Try-On Confirmation Summary */}
      <section className="try-on-summary-section">
        <h2>Review Your Try-On</h2>

        <div className="try-on-summary-card">
          <p>
            <strong>Photo:</strong>{" "}
            {selectedMode === "personal"
              ? uploadedImage
                ? "Personal Photo"
                : "No photo uploaded"
              : selectedVirtualModelDetails
                ? "AI Virtual Model"
                : "No model selected"}
          </p>

          {selectedMode === "virtual" && selectedVirtualModelDetails && (
            <>
              <p>
                <strong>Model:</strong> {selectedVirtualModelDetails.id}
              </p>
              <p>
                <strong>Gender:</strong>{" "}
                {selectedModelGender === "male" ? "Male" : "Female"}
              </p>
            </>
          )}

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
          {isGenerating ? (
            <>
              <span className="try-on-spinner"></span>
              Generating your virtual try-on...
            </>
          ) : (
            "Generate Try-On"
          )}
        </button>

        <button
          type="button"
          className="reset-try-on-btn"
          onClick={handleResetTryOn}
          disabled={isGenerating}
        >
          Reset Try-On
        </button>

        {generationMessage && (
          <p className="generation-success-message">{generationMessage}</p>
        )}

        {/* Display validation messages */}
        {selectedMode === "personal" && !uploadedImage && (
          <p className="try-on-validation-message">
            Please upload your photo to continue.
          </p>
        )}

        {!productLoading && !selectedProduct && (
          <p className="try-on-validation-message">
            Please select a valid product first.
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
        {/* Try-On Status Indicator */}
        <div className={`try-on-status ${tryOnStatusClass}`}>
          <span className="status-dot"></span>
          <p>{tryOnStatus}</p>
        </div>

        <h2>Your Try-On Result</h2>

        <div className="try-on-comparison">
          {/* Original Uploaded Photo */}
          <div className="comparison-card">
            <h3>Original Photo</h3>

            <div className="comparison-image">
              {selectedMode === "personal" && uploadedImage ? (
                <img src={uploadedImage} alt="Your original uploaded photo" />
              ) : selectedMode === "virtual" && selectedVirtualModelDetails ? (
                <img
                  src={selectedVirtualModelDetails.image}
                  alt={`Selected virtual model ${selectedVirtualModelDetails.id}`}
                />
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
              {generatedImageUrl ? (
                <img
                  src={generatedImageUrl}
                  alt="AI-generated virtual try-on result"
                  className="uploaded-photo-preview"
                />
              ) : (
                <div className="comparison-placeholder">
                  <span>✨</span>

                  <p>
                    {isGenerating
                      ? "Generating your virtual try-on..."
                      : "Your virtual try-on result will appear here."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Download Try-On Result */}
      <div className="download-result-section">
        <button
          type="button"
          className="download-result-btn"
          disabled={!generatedImageUrl}
          onClick={async () => {
            if (!generatedImageUrl) return;

            try {
              const response = await fetch(generatedImageUrl);

              if (!response.ok) {
                throw new Error("Unable to download the generated image.");
              }

              const blob = await response.blob();
              const downloadUrl = URL.createObjectURL(blob);

              const link = document.createElement("a");
              link.href = downloadUrl;
              link.download = "virtual-ai-tryon-result.png";

              document.body.appendChild(link);
              link.click();
              link.remove();

              URL.revokeObjectURL(downloadUrl);
            } catch (error) {
              console.error("Image download error:", error);
              alert("Unable to download the image. Please try again.");
            }
          }}
        >
          ↓ Download Try-On Result
        </button>

        <p>
          {generatedImageUrl
            ? "Your generated Try-On image is ready to download."
            : "Generate your virtual try-on first to download the result."}
        </p>
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
