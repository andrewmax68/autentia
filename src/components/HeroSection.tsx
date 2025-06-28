
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Scopri dove <span className="text-green-600">comprare</span> l'eccellenza artigianale
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Hai assaggiato un formaggio incredibile a una festa? Scoperto un vino locale a una fiera? 
          Letto di una startup che produce pasta artigianale? Trova subito dove comprare questi prodotti di eccellenza nei negozi della tua zona!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            <Search className="mr-2 h-5 w-5" />
            Cerca Prodotti Artigianali
          </Button>
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
