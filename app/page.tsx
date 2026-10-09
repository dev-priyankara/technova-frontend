"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import PromoBanner from "@/components/PromoBanner";
import AIRecommendations from "@/components/AIRecommendation";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <FeaturedProducts
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <PromoBanner />
        <AIRecommendations />
        <WhyChooseUs />
        <Footer />
      </main>
    </>
  );
}