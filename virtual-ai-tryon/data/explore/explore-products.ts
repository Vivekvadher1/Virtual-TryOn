export interface ExploreProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

export const exploreProducts: ExploreProduct[] = [
  {
    id: 1,
    name: "Classic White Shirt",
    category: "Clothing",
    price: 1999,
    image: "/images/clothing.png",
  },
  {
    id: 2,
    name: "Premium Fashion Shoes",
    category: "Shoes",
    price: 2499,
    image: "/images/shoes.png",
  },
  {
    id: 3,
    name: "Elegant Handbag",
    category: "Bags",
    price: 2999,
    image: "/images/bags.png",
  },
  {
    id: 4,
    name: "Stylish Accessories",
    category: "Accessories",
    price: 999,
    image: "/images/accessories.png",
  },
];