
import { Button } from "@/components/ui/button";

const BusinessSection = () => {
  return (
    <section id="per-negozi" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Per i Negozi</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fai conoscere i brand che vendi e attira clienti che cercano prodotti specifici
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-2xl font-semibold text-gray-900 mb-6">
              Aumenta la visibilità del tuo negozio
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Elenca tutti i brand e prodotti che vendi</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Appari quando i clienti cercano quei brand</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Gestisci orari, contatti e disponibilità prodotti</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Attrai clienti che cercano brand specifici</span>
              </li>
            </ul>
            <Button className="mt-6 bg-green-600 hover:bg-green-700">
              Registra il tuo Negozio
            </Button>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">Esempi di Ricerche</h5>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                <p className="text-sm text-green-800">"Pasta Barilla"</p>
              </div>
              <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                <p className="text-sm text-blue-800">"Caffè Lavazza"</p>
              </div>
              <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-500">
                <p className="text-sm text-purple-800">"Nutella Ferrero"</p>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">
                  I tuoi clienti ti troveranno quando cercano questi brand!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;
