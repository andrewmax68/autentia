
import { Button } from "@/components/ui/button";

const BusinessSection = () => {
  return (
    <section id="per-imprese" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Per le Imprese Produttrici</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fai sapere ai consumatori dove possono acquistare i tuoi brand e prodotti
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-2xl font-semibold text-gray-900 mb-6">
              Connetti i tuoi brand con i consumatori
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Registra i tuoi brand e prodotti sulla piattaforma</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Indica tutti i punti vendita che distribuiscono i tuoi prodotti</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">I consumatori ti troveranno quando cercano i tuoi brand</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Aumenta la visibilità dei tuoi prodotti nei negozi fisici</span>
              </li>
            </ul>
            <Button className="mt-6 bg-green-600 hover:bg-green-700">
              Registra la tua Impresa
            </Button>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">Esempi di Brand</h5>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                <p className="text-sm text-green-800 font-medium">Barilla</p>
                <p className="text-xs text-green-600">Pasta, sughi, biscotti</p>
              </div>
              <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                <p className="text-sm text-blue-800 font-medium">Lavazza</p>
                <p className="text-xs text-blue-600">Caffè, capsule, macchine</p>
              </div>
              <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-500">
                <p className="text-sm text-purple-800 font-medium">Ferrero</p>
                <p className="text-xs text-purple-600">Nutella, Rocher, Kinder</p>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">
                  I consumatori cercheranno i tuoi brand e troveranno i tuoi punti vendita!
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
