"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, Suspense, useEffect } from "react";
import type { Product } from "@/types/product";
import {
  ALL_VIRTUAL_MODELS,
  ModelGender,
  VIRTUAL_MODELS,
  VirtualModel,
} from "@/src/constant/VIrtualModels";
import {
  FiCamera,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiDownload,
  FiPlus,
} from "react-icons/fi";
import { HiOutlineLightBulb, HiOutlineSparkles } from "react-icons/hi";

const API_BASE = "http://localhost:5000";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function TryOnContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const selectedSize = searchParams.get("size");
  const selectedColor = searchParams.get("color");

  const [selectedMode, setSelectedMode] = useState<"personal" | "virtual">(
    "personal",
  );
  const [selectedModelGender, setSelectedModelGender] =
    useState<ModelGender>("male");
  const [modelIndex, setModelIndex] = useState(0);
  const [selectedVirtualModel, setSelectedVirtualModel] = useState<
    string | null
  >(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [uploadedPhotoPublicId, setUploadedPhotoPublicId] = useState<
    string | null
  >(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMessage, setGenerationMessage] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState("");

  const currentModels = VIRTUAL_MODELS[selectedModelGender];
  const activeModel = currentModels[modelIndex] ?? currentModels[0];
  const selectedVirtualModelDetails = ALL_VIRTUAL_MODELS.find(
    (m) => m.id === selectedVirtualModel,
  );

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
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

        const res = await fetch(`${API_BASE}/api/products/${productId}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        if (!res.ok || !data.success || !data.data) {
          throw new Error(data.message || "Unable to find this product.");
        }
        setSelectedProduct(data.data as Product);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setProductError(
          err instanceof Error ? err.message : "Failed to load product.",
        );
      } finally {
        if (!controller.signal.aborted) setProductLoading(false);
      }
    })();

    return () => controller.abort();
  }, [productId]);

  const requiresSize = Boolean(selectedProduct?.sizes?.length);
  const requiresColor = Boolean(selectedProduct?.colors?.length);
  const isSizeValid =
    !requiresSize ||
    Boolean(selectedSize && selectedProduct?.sizes?.includes(selectedSize));
  const isColorValid =
    !requiresColor ||
    Boolean(selectedColor && selectedProduct?.colors?.includes(selectedColor));

  const sourceReady =
    selectedMode === "personal"
      ? Boolean(uploadedImage && uploadedPhotoUrl && !isUploadingPhoto)
      : Boolean(selectedVirtualModelDetails);

  const isReadyToGenerate = Boolean(
    sourceReady && selectedProduct && isSizeValid && isColorValid,
  );

  const status = isGenerating
    ? { label: "Generating your Try-On...", cls: "generating" }
    : generatedImageUrl
      ? { label: "Try-On ready", cls: "ready" }
      : generationMessage
        ? { label: "Notice", cls: "prepared" }
        : isReadyToGenerate
          ? { label: "Ready to generate", cls: "ready" }
          : { label: "Waiting for required details", cls: "waiting" };

  const validationErrors = [
    selectedMode === "personal" && !uploadedImage
      ? "Please upload your photo to continue."
      : "",
    !productLoading && !selectedProduct
      ? "Please select a valid product first."
      : "",
    selectedProduct && requiresSize && !isSizeValid
      ? "Please select a valid product size."
      : "",
    selectedProduct && requiresColor && !isColorValid
      ? "Please select a valid product color."
      : "",
  ].filter(Boolean);

  const clearUploadedPhoto = () => {
    if (uploadedImage) URL.revokeObjectURL(uploadedImage);
    setUploadedImage(null);
    setUploadedPhotoUrl(null);
    setUploadedPhotoPublicId(null);
    setPhotoUploadError("");
    setGenerationMessage("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setPhotoUploadError("Only JPG, PNG and WEBP images are allowed!");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setPhotoUploadError("Image size must not exceed 5 MB.");
      return;
    }

    if (uploadedImage) URL.revokeObjectURL(uploadedImage);
    setUploadedImage(URL.createObjectURL(file));
    setUploadedPhotoUrl(null);
    setUploadedPhotoPublicId(null);
    setPhotoUploadError("");
    setGenerationMessage("");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setIsUploadingPhoto(true);
      const res = await fetch(`${API_BASE}/api/upload/user-photo`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Photo upload failed.");
      }
      setUploadedPhotoUrl(data.image.url);
      setUploadedPhotoPublicId(data.image.public_id);
    } catch (err) {
      setPhotoUploadError(
        err instanceof Error ? err.message : "Photo upload failed.",
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleGenerateTryOn = async () => {
    const personImageUrl =
      selectedMode === "personal"
        ? uploadedPhotoUrl
        : selectedVirtualModelDetails?.image;
    if (!isReadyToGenerate || !selectedProduct || !personImageUrl) return;

    setIsGenerating(true);
    setGenerationMessage("");
    setGeneratedImageUrl(null);

    try {
      const res = await fetch(`${API_BASE}/api/tryon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personImageUrl,
          garmentImageUrl: selectedProduct.image,
          garmentDescription: selectedProduct.category,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.imageUrl) {
        throw new Error(data.message || "Virtual Try-On generation failed.");
      }
      setGeneratedImageUrl(data.imageUrl);
      setGenerationMessage(
        "Your virtual try-on has been generated successfully!",
      );
    } catch (err) {
      setGenerationMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your Try-On.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetTryOn = () => {
    if (isGenerating) return;
    clearUploadedPhoto();
    setSelectedVirtualModel(null);
    setModelIndex(0);
    setGeneratedImageUrl(null);
  };

  const handleDownloadResult = async () => {
    if (!generatedImageUrl) return;
    try {
      const res = await fetch(generatedImageUrl);
      if (!res.ok) throw new Error("Download failed.");
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = "virtual-ai-tryon-result.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Unable to download the image. Please try again.");
    }
  };

  const previewImageSrc =
    selectedMode === "personal"
      ? uploadedImage
      : (selectedVirtualModelDetails?.image ?? null);

  return (
    <main className="try-on-page">
      <div className="try-on-header">
        <Link href="/explore" className="back-to-explore">
          <FiChevronsLeft aria-hidden="true" /> Back to Explore
        </Link>
        <h1>Virtual AI Try-On</h1>
        <p>
          Experience your style before you buy. Upload your photo or pick an AI
          model and preview your look before you buy.
        </p>
      </div>

      <section className="try-on-container">
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

        <div className="try-on-product">
          <h2>Selected Product</h2>
          {productLoading ? (
            <div className="selected-product-placeholder">
              <p>Loading selected product...</p>
            </div>
          ) : selectedProduct ? (
            <div className="selected-product-card">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={300}
                height={350}
                className="selected-product-image"
              />
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
              <p>
                {productError ||
                  "No product selected. Please choose a product first."}
              </p>
              <Link href="/explore" className="upload-photo-btn">
                Browse Products
              </Link>
            </div>
          )}
        </div>

        {selectedMode === "personal" ? (
          <div className="try-on-upload">
            <h2>Upload Your Photo</h2>
            <div className="upload-placeholder">
              <input
                type="file"
                id="photo-upload"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageUpload}
                onClick={(e) => {
                  e.currentTarget.value = "";
                }}
                hidden
              />
              {uploadedImage ? (
                <>
                  <img
                    src={uploadedImage}
                    alt="Uploaded preview"
                    className="uploaded-photo-preview"
                  />
                  <p>
                    {isUploadingPhoto
                      ? "Uploading your photo to Cloudinary..."
                      : uploadedPhotoUrl
                        ? "Photo uploaded successfully!"
                        : "Photo preview ready. Upload failed or incomplete."}
                  </p>
                  {photoUploadError && (
                    <p className="try-on-validation-message">
                      {photoUploadError}
                    </p>
                  )}
                  <div className="photo-action-buttons">
                    <label htmlFor="photo-upload" className="upload-photo-btn">
                      Change Photo
                    </label>
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={clearUploadedPhoto}
                    >
                      Remove Photo
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="upload-icon">
                    <FiPlus aria-hidden="true" />
                  </div>
                  <h3>Upload Your Image</h3>
                  <p>Select a photo to start your virtual try-on experience.</p>
                  <label htmlFor="photo-upload" className="upload-photo-btn">
                    Choose Photo
                  </label>
                  <span>PNG, JPG or JPEG</span>
                  <p className="upload-guidance-text">
                    <HiOutlineLightBulb aria-hidden="true" /> Use a clear,
                    well-lit photo. Keep your full body visible for clothing
                    try-on.
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="virtual-model-section">
            <h2>Choose Your AI Virtual Model</h2>
            <div className="virtual-model-panel">
              <div className="model-gender-options">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={selectedModelGender === g ? "active" : ""}
                    onClick={() => {
                      setSelectedModelGender(g);
                      setModelIndex(0);
                    }}
                  >
                    {g === "male" ? "Male" : "Female"}
                  </button>
                ))}
              </div>

              <div className="virtual-model-carousel">
                <button
                  type="button"
                  className="model-nav-btn"
                  aria-label="Previous model"
                  onClick={() =>
                    setModelIndex(
                      (i) =>
                        (i - 1 + currentModels.length) % currentModels.length,
                    )
                  }
                >
                  <FiChevronLeft aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className={
                    selectedVirtualModel === activeModel.id
                      ? "virtual-model-card selected"
                      : "virtual-model-card"
                  }
                  onClick={() =>
                    setSelectedVirtualModel((prev) =>
                      prev === activeModel.id ? null : activeModel.id,
                    )
                  }
                >
                  <div className="virtual-model-image-wrap">
                    <img
                      src={activeModel.image}
                      alt={activeModel.id}
                      className="virtual-model-image"
                    />
                  </div>
                  <div className="virtual-model-meta">
                    <span className="virtual-model-name">{activeModel.id}</span>
                    {selectedVirtualModel === activeModel.id ? (
                      <span className="model-selected-label">Selected</span>
                    ) : (
                      <span className="model-unselected-hint">Select</span>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  className="model-nav-btn"
                  aria-label="Next model"
                  onClick={() =>
                    setModelIndex((i) => (i + 1) % currentModels.length)
                  }
                >
                  <FiChevronRight aria-hidden="true" />
                </button>
              </div>

              <div className="model-carousel-dots">
                {currentModels.map((model: VirtualModel, idx: number) => (
                  <button
                    key={model.id}
                    type="button"
                    aria-label={`View ${model.id}`}
                    className={
                      idx === modelIndex ? "model-dot active" : "model-dot"
                    }
                    onClick={() => {
                      setModelIndex(idx);
                      setSelectedVirtualModel(model.id);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

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

      <section className="generate-try-on-section">
        <button
          type="button"
          className="generate-try-on-btn"
          onClick={handleGenerateTryOn}
          disabled={!isReadyToGenerate || isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="try-on-spinner" />
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
          <p
            className={
              generatedImageUrl
                ? "generation-success-message"
                : "try-on-validation-message"
            }
          >
            {generationMessage}
          </p>
        )}

        {validationErrors.map((msg) => (
          <p key={msg} className="try-on-validation-message">
            {msg}
          </p>
        ))}
      </section>

      <section className="try-on-result-section">
        <div className={`try-on-status ${status.cls}`}>
          <span className="status-dot" />
          <p>{status.label}</p>
        </div>

        <h2>Your Try-On Result</h2>

        <div className="try-on-comparison">
          <div className="comparison-card">
            <h3>Original Photo</h3>
            <div className="comparison-image">
              {previewImageSrc ? (
                <img src={previewImageSrc} alt="Selected try-on source" />
              ) : (
                <div className="comparison-placeholder">
                  <span>
                    <FiCamera aria-hidden="true" />
                  </span>
                  <p>Your uploaded photo will appear here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="comparison-card">
            <h3>Virtual Try-On Result</h3>
            <div
              className={
                isGenerating
                  ? "comparison-image is-scanning"
                  : "comparison-image"
              }
            >
              {generatedImageUrl ? (
                <img
                  src={generatedImageUrl}
                  alt="AI-generated virtual try-on result"
                />
              ) : (
                <div className="comparison-placeholder">
                  <span>
                    <HiOutlineSparkles aria-hidden="true" />
                  </span>
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

      <div className="download-result-section">
        <button
          type="button"
          className="download-result-btn"
          disabled={!generatedImageUrl}
          onClick={handleDownloadResult}
        >
          <FiDownload aria-hidden="true" /> Download Try-On Result
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
