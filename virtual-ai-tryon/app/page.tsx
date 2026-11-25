import ExploreCTA from "@/components/common/ExploreCTA";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import Hero from "@/components/home/Hero";
import HomeProducts from "@/components/home/HomeProducts";
import NewArrivals from "@/components/home/NewArrival";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedCategories />
      <HomeProducts />
      <NewArrivals />
      <WhyChooseUs />
      <ExploreCTA />
    </main>
  );
}
