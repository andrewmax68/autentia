
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BusinessSection from "@/components/BusinessSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <Header />
      
      {/* Test Dashboard Access Button */}
      <div className="fixed top-4 right-4 z-50">
        <Link to="/business-dashboard">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg">
            🚀 Test Dashboard
          </button>
        </Link>
      </div>
      
      <HeroSection />
      <FeaturesSection />
      <BusinessSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
