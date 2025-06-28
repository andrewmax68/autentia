
import { Button } from "@/components/ui/button";

const BusinessSection = () => {
  return (
    <section id="per-imprese" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Per le Micro e Piccole Imprese Artigianali</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fai conoscere i tuoi brand artigianali di eccellenza e indica ai consumatori dove trovarli. 
            Raggiungi food lovers, artisan lovers e consumatori curiosi che cercano qualità e artigianalità.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-2xl font-semibold text-gray-900 mb-6">
              Valorizza la tua eccellenza artigianale
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Registra i tuoi brand artigianali di eccellenza</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Indica tutti i punti vendita che distribuiscono i tuoi prodotti</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Raggiungi consumatori che apprezzano qualità e artigianalità</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">Strategie sostenibili per farsi trovare nei negozi fisici</span>
              </li>
            </ul>
            <Button className="mt-6 bg-green-600 hover:bg-green-700">
              Registra la tua Impresa Artigianale
            </Button>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">Esempi di Eccellenze Artigianali</h5>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                <p className="text-sm text-green-800 font-medium">Pastificio del Borgo</p>
                <p className="text-xs text-green-600">Pasta artigianale con grani antichi</p>
              </div>
              <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                <p className="text-sm text-blue-800 font-medium">Atelier Sofia</p>
                <p className="text-xs text-blue-600">Borse in pelle lavorate a mano</p>
              </div>
              <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-500">
                <p className="text-sm text-purple-800 font-medium">Essenza Naturale</p>
                <p className="text-xs text-purple-600">Cosmetici biologici e saponi artigianali</p>
              </div>
              <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-500">
                <p className="text-sm text-orange-800 font-medium">Ceramiche d'Arte</p>
                <p className="text-xs text-orange-600">Oggettistica unica fatta a mano</p>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">
                  <strong>Eccellenza artigianale che merita di essere scoperta!</strong> Food lovers, artisan lovers e consumatori curiosi troveranno i tuoi prodotti di qualità.
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
