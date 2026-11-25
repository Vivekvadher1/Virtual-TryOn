import FeaturedCategories from "@/components/home/FeaturedCategories";
import Hero from "@/components/home/Hero";
import HomeProducts from "@/components/home/HomeProducts";
import NewArrivals from "@/components/home/NewArrival";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedCategories />
      <HomeProducts />
      <NewArrivals />
    </main>
  );
}
