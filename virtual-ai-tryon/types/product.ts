export interface ProductColorVariant {
  color: string;
  image: string;
  imagePublicId: string;
}

export type ProductGender = "Unisex" | "Men" | "Women";

// Product structure received from the Express backend.
export interface Product {
    // MongoDB automatically generates this ID.
    _id: string;

    // Basic product information.
    name: string;
    category: string;
    price: number;

    // Cloudinary image information.
    image: string;
    imagePublicId: string;

    // Gender 
    gender?: ProductGender;

    // Color Variant
    colorVariants?: ProductColorVariant[];

    // Additional product details.
    description: string;
    sizes?: string[];
    colors?: string[];
    createdAt?: string;
}

// Structure of the response returned by GET /api/products.
export interface ProductsApiResponse {
    success: boolean;
    count: number;
    data: Product[];
}
