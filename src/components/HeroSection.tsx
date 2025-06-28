
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";

const HeroSection = () => {
  const [brandSearch, setBrandSearch] = useState('');
  const navigate = useNavigate();

  const handleBrandSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (brandSearch.trim()) {
      navigate(`/cerca-brand?brand=${encodeURIComponent(brandSearch.trim())}`);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Scopri dove <span className="text-green-600">comprare</span> l'eccellenza artigianale
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Trova subito dove comprare questi prodotti di eccellenza nei negozi della tua zona!
        </p>
        
        {/* Brand Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleBrandSearch} className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Cerca brand o azienda (es. Salumificio Rossi, Ceramiche Blu)"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="flex-1 h-12 text-base"
            />
            <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700 h-12">
              <Search className="mr-2 h-5 w-5" />
              Trova Punti Vendita
            </Button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline">
            <MapPin className="mr-2 h-5 w-5" />
            Esplora Eccellenze Locali
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
