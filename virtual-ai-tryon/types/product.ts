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

    // Additional product details.
    description: string;
    sizes?: string[];
    colors?: string[];
}

// Structure of the response returned by GET /api/products.
export interface ProductsApiResponse {
    success: boolean;
    count: number;
    data: Product[];
}
