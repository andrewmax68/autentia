
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BusinessSection from "@/components/BusinessSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Debug Navigation - Rimuovi dopo il test */}
      <div className="bg-yellow-100 p-4 text-center">
        <p className="text-sm mb-2">🚧 Link di test per navigazione:</p>
        <div className="space-x-2">
          <Button onClick={() => navigate("/business-login")}>
            Business Login
          </Button>
          <Button onClick={() => navigate("/business-dashboard")}>
            Business Dashboard
          </Button>
        </div>
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
