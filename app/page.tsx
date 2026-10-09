import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBanner from "@/components/PromoBanner";
import AIRecommendations from "@/components/AIRecommendation";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection/>
        <FeaturedProducts/>
        <PromoBanner/>
        <AIRecommendations/>
        <WhyChooseUs/>
        <Footer/>
      </main>
    </>
  );
}