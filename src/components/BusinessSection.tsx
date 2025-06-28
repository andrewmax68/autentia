
import { Button } from "@/components/ui/button";

const BusinessSection = () => {
  return (
    <section id="per-produttori" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Per i Produttori</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Registra i tuoi prodotti e indica dove trovarli
          </p>
        </div>

        <div className="text-center">
          <Button className="bg-green-600 hover:bg-green-700">
            Registrati come Produttore
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;
