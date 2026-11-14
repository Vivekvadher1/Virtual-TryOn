// Product information used to display items in the Explore collection.
export interface ExploreProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  sizes?: string[];
  colors?: string[];
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
    image: "/images/Clothing/white-shirt.jpg",
    description:
      "A timeless white shirt with a clean look, perfect for casual and formal occasions.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Blue", "Grey"],
  },
  {
    id: 2,
    name: "Casual Black T-Shirt",
    category: "Clothing",
    price: 899,
    image: "/images/Clothing/black-tshirt.jpg",
    description:
      "A comfortable black T-shirt designed for effortless everyday styling.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Blue", "Grey"],
  },
  {
    id: 3,
    name: "Premium Denim Jacket",
    category: "Clothing",
    price: 3499,
    image: "/images/Clothing/denim-jacket.jpg",
    description:
      "A versatile denim jacket that adds a classic touch to your everyday outfit.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Blue", "Grey"],
  },
  {
    id: 4,
    name: "Comfort Fit Hoodie",
    category: "Clothing",
    price: 1799,
    image: "/images/Clothing/hoddie.jpg",
    description:
      "A relaxed-fit hoodie designed for comfort during casual outings.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Blue", "Grey"],
  },

  // ---------------- SHOES ----------------
  {
    id: 5,
    name: "Premium Fashion Shoes",
    category: "Shoes",
    price: 2499,
    image: "/images/Shoes/Shoes-1.png",
    description:
      "Stylish everyday shoes that combine a modern appearance with comfort.",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["White", "Black", "Brown"],
  },
  {
    id: 6,
    name: "Classic White Sneakers",
    category: "Shoes",
    price: 2999,
    image: "/images/Shoes/shoes.png",
    description:
      "Minimal white sneakers that pair easily with a variety of outfits.",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["White", "Black", "Brown"],
  },
  {
    id: 7,
    name: "Casual Leather Loafers",
    category: "Shoes",
    price: 2199,
    image: "/images/Shoes/shoes.png",
    description:
      "Elegant loafers that bring a refined look to casual and smart outfits.",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["White", "Black", "Brown"],
  },
  {
    id: 8,
    name: "Sport Running Shoes",
    category: "Shoes",
    price: 1899,
    image: "/images/Shoes/shoes.png",
    description:
      "Lightweight running shoes designed for active days and everyday movement.",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: ["White", "Black", "Brown"],
  },

  // ---------------- BAGS ----------------
  {
    id: 9,
    name: "Elegant Handbag",
    category: "Bags",
    price: 2999,
    image: "/images/Bags/bags.png",
    description:
      "A stylish handbag that complements both everyday and special-occasion outfits.",
    colors: ["Beige", "Black", "Brown"],
  },
  {
    id: 10,
    name: "Everyday Travel Backpack",
    category: "Bags",
    price: 1599,
    image: "/images/Bags/bags.png",
    description:
      "A practical backpack designed to carry your essentials while travelling or commuting.",
    colors: ["Beige", "Black", "Brown"],
  },
  {
    id: 11,
    name: "Minimalist Tote Bag",
    category: "Bags",
    price: 1299,
    image: "/images/Bags/bags.png",
    description: "A simple and spacious tote bag for everyday use.",
    colors: ["Beige", "Black", "Brown"],
  },
  {
    id: 12,
    name: "Premium Crossbody Bag",
    category: "Bags",
    price: 2399,
    image: "/images/Bags/bags.png",
    description:
      "A modern crossbody bag offering a convenient and stylish carrying option.",
    colors: ["Beige", "Black", "Brown"],
  },

  // ---------------- ACCESSORIES ----------------
  {
    id: 13,
    name: "Stylish Accessories",
    category: "Accessories",
    price: 999,
    image: "/images/Accessories/accessories.png",
    description:
      "A versatile accessory designed to add a finishing touch to your personal style.",
    colors: ["Gold", "Black", "Silver"],
  },
  {
    id: 14,
    name: "Classic Black Sunglasses",
    category: "Accessories",
    price: 799,
    image: "/images/Accessories/accessories.png",
    description:
      "Classic black sunglasses that add a bold touch to your everyday look.",
    colors: ["Gold", "Black", "Silver"],
  },
  {
    id: 15,
    name: "Premium Wrist Watch",
    category: "Accessories",
    price: 1999,
    image: "/images/Accessories/accessories.png",
    description:
      "A sophisticated wrist watch that complements both casual and formal outfits.",
    colors: ["Gold", "Black", "Silver"],
  },
  {
    id: 16,
    name: "Casual Baseball Cap",
    category: "Accessories",
    price: 599,
    image: "/images/Accessories/accessories.png",
    description:
      "A comfortable baseball cap that adds a relaxed finish to casual outfits.",
    colors: ["Gold", "Black", "Silver"],
  },
];
