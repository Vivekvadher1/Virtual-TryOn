"use client";

import { useState } from "react";

import Link from "next/link";

export default function TryOnPage() {
    // Store the uploaded photo preview URL.
const [uploadedImage, setUploadedImage] = useState<string | null>(null);

// Handle the selected image file.
const handleImageUpload = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
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

      <p>
        Select a photo to start your virtual try-on experience.
      </p>

      {/* Hidden file input */}
      <input
        type="file"
        id="photo-upload"
        accept="image/png, image/jpeg"
        onChange={handleImageUpload}
        hidden
      />

      {/* Button that opens the file picker */}
      <label
        htmlFor="photo-upload"
        className="upload-photo-btn"
      >
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

          <div className="selected-product-placeholder">
            <p>Your selected product will appear here.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
