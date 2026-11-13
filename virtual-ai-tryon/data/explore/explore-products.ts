
// Product information used to display items in the Explore collection.
export interface ExploreProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

// Sample product data for the Explore page.
// Later, this data can come from our backend API.
export const exploreProducts: ExploreProduct[] = [
  // ---------------- CLOTHING ----------------
  {
    id: 1,
    name: "Classic White Shirt",
    category: "Clothing",
    price: 1999,
    image: "/images/Clothing/clothing.png",
  },
  {
    id: 2,
    name: "Casual Black T-Shirt",
    category: "Clothing",
    price: 899,
    image: "/images/Clothing/clothing.png",
  },
  {
    id: 3,
    name: "Premium Denim Jacket",
    category: "Clothing",
    price: 3499,
    image: "/images/Clothing/clothing.png",
  },
  {
    id: 4,
    name: "Comfort Fit Hoodie",
    category: "Clothing",
    price: 1799,
    image: "/images/Clothing/clothing.png",
  },

  // ---------------- SHOES ----------------
  {
    id: 5,
    name: "Premium Fashion Shoes",
    category: "Shoes",
    price: 2499,
    image: "/images/Shoes/shoes.png",
  },
  {
    id: 6,
    name: "Classic White Sneakers",
    category: "Shoes",
    price: 2999,
    image: "/images/Shoes/shoes.png",
  },
  {
    id: 7,
    name: "Casual Leather Loafers",
    category: "Shoes",
    price: 2199,
    image: "/images/Shoes/shoes.png",
  },
  {
    id: 8,
    name: "Sport Running Shoes",
    category: "Shoes",
    price: 1899,
    image: "/images/Shoes/shoes.png",
  },

  // ---------------- BAGS ----------------
  {
    id: 9,
    name: "Elegant Handbag",
    category: "Bags",
    price: 2999,
    image: "/images/Bags/bags.png",
  },
  {
    id: 10,
    name: "Everyday Travel Backpack",
    category: "Bags",
    price: 1599,
    image: "/images/Bags/bags.png",
  },
  {
    id: 11,
    name: "Minimalist Tote Bag",
    category: "Bags",
    price: 1299,
    image: "/images/Bags/bags.png",
  },
  {
    id: 12,
    name: "Premium Crossbody Bag",
    category: "Bags",
    price: 2399,
    image: "/images/Bags/bags.png",
  },

  // ---------------- ACCESSORIES ----------------
  {
    id: 13,
    name: "Stylish Accessories",
    category: "Accessories",
    price: 999,
    image: "/images/Accessories/accessories.png",
  },
  {
    id: 14,
    name: "Classic Black Sunglasses",
    category: "Accessories",
    price: 799,
    image: "/images/Accessories/accessories.png",
  },
  {
    id: 15,
    name: "Premium Wrist Watch",
    category: "Accessories",
    price: 1999,
    image: "/images/Accessories/accessories.png",
  },
  {
    id: 16,
    name: "Casual Baseball Cap",
    category: "Accessories",
    price: 599,
    image: "/images/Accessories/accessories.png",
  },
];
