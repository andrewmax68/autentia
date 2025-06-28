
import { Button } from "@/components/ui/button";
import { Search, Store } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 bg-green-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold mb-4">Inizia Subito la Ricerca</h3>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Trova i negozi che vendono i tuoi brand preferiti e scopri nuovi prodotti locali
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary">
            <Search className="mr-2 h-5 w-5" />
            Cerca Brand
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
            <Store className="mr-2 h-5 w-5" />
            Registra il tuo Negozio
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
