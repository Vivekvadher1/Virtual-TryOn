"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  name,
  category,
  price,
  image,
}: ProductCardProps) {
  return (
    <article className="product-card">
      {/* Product Image and Category */}
      <Link href={`/explore/${id}`} className="product-card-link">
        <div className="product-card-image">
          <Image
            src={image}
            alt={name}
            width={400}
            height={500}
            loading="eager"
          />

          <span className="product-card-category">{category}</span>
        </div>

        {/* Product Information */}
        <div className="product-card-details">
          <h3>{name}</h3>

          <p className="product-card-price">₹{price.toLocaleString("en-IN")}</p>
        </div>
      </Link>
    </article>
  );
}
