
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Trova dove <span className="text-green-600">comprare</span> i tuoi brand preferiti
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Cerca pasta Barilla, olio Monini, formaggi Galbani e migliaia di altri brand. 
          Scopri subito quali negozi vicino a te li hanno disponibili!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            <Search className="mr-2 h-5 w-5" />
            Cerca un Brand
          </Button>
          <Button size="lg" variant="outline">
            <MapPin className="mr-2 h-5 w-5" />
            Negozi Vicini
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
