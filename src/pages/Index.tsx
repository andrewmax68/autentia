
import React from 'react';
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BusinessSection from "@/components/BusinessSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <BusinessSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
