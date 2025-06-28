
import { useState } from "react";
import { MapPin, Navigation, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const MapPage = () => {
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Dati di esempio per i punti vendita
  const sampleStores = [
    {
      id: 1,
      name: "Supermercato Bio Verde",
      address: "Via Roma 123, Milano",
      businessName: "Azienda Agricola Rossi",
      products: ["Olio EVO", "Olive"],
      category: "Alimentari",
      coordinates: { lat: 45.4642, lng: 9.1900 }
    },
    {
      id: 2,
      name: "Erboristeria Natura",
      address: "Corso Italia 45, Milano",
      businessName: "Saponi Naturali Verde",
      products: ["Saponi", "Creme"],
      category: "Cosmetici",
      coordinates: { lat: 45.4654, lng: 9.1859 }
    },
    {
      id: 3,
      name: "Enoteca del Centro",
      address: "Piazza Duomo 12, Milano",
      businessName: "Birrificio delle Alpi",
      products: ["Birra IPA", "Birra Lager"],
      category: "Bevande",
      coordinates: { lat: 45.4640, lng: 9.1896 }
    },
    {
      id: 4,
      name: "Market Locale",
      address: "Via Brera 78, Milano",
      businessName: "Azienda Agricola Rossi",
      products: ["Conserve", "Olio EVO"],
      category: "Alimentari",
      coordinates: { lat: 45.4719, lng: 9.1881 }
    }
  ];

  const filteredStores = sampleStores.filter(store => 
    searchQuery === "" || 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Dove Si Vende?
              </h1>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link to="/search">
                <Button variant="ghost" className="hover:bg-green-50">
                  Cerca
                </Button>
              </Link>
              <Link to="/business-login">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  Area Imprese
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          
          {/* Sidebar con lista punti vendita */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Punti Vendita
              </h2>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Cerca punti vendita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-green-200 focus:border-green-400"
                />
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredStores.map(store => (
                  <Card 
                    key={store.id} 
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedStore === store.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-green-100 hover:border-green-300 bg-white/50'
                    }`}
                    onClick={() => setSelectedStore(store.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {store.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          {store.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{store.address}</span>
                      </div>
                      
                      <p className="text-xs text-green-600 font-medium mb-2">
                        {store.businessName}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {store.products.slice(0, 2).map(product => (
                          <Badge key={product} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                        {store.products.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{store.products.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Mappa */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-white/70 backdrop-blur-sm border-green-100">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-gray-900">
                    Mappa Punti Vendita
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="border-green-200">
                      <Navigation className="h-4 w-4 mr-2" />
                      La Mia Posizione
                    </Button>
                    <Button size="sm" variant="outline" className="border-green-200">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtri
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 h-full">
                {/* Placeholder per la mappa - in futuro integrazione con Mapbox */}
                <div className="relative w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-b-2xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Mappa Interattiva
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      La mappa interattiva mostrerà tutti i punti vendita geolocalizzati. 
                      Sarà integrata con Mapbox per una migliore esperienza utente.
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                      {filteredStores.slice(0, 4).map((store, index) => (
                        <div 
                          key={store.id}
                          className={`relative bg-white/80 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedStore === store.id 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-green-200 hover:border-green-300'
                          }`}
                          onClick={() => setSelectedStore(store.id)}
                        >
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <h4 className="font-medium text-xs text-gray-900 mb-1">
                            {store.name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {store.businessName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dettagli punto vendita selezionato */}
        {selectedStore && (
          <div className="mt-6">
            {(() => {
              const store = sampleStores.find(s => s.id === selectedStore);
              if (!store) return null;
              
              return (
                <Card className="bg-white/70 backdrop-blur-sm border-green-100">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900 mb-2">
                          {store.name}
                        </CardTitle>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{store.address}</span>
                        </div>
                        <p className="text-green-600 font-medium">
                          Prodotti di: {store.businessName}
                        </p>
                      </div>
                      <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                        {store.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Prodotti Disponibili</h4>
                        <div className="flex flex-wrap gap-2">
                          {store.products.map(product => (
                            <Badge key={product} variant="outline" className="border-green-200 text-green-700">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <Button variant="outline" className="border-green-200">
                          <Navigation className="h-4 w-4 mr-2" />
                          Indicazioni
                        </Button>
                        <Link to={`/business/${store.businessName.replace(/\s+/g, '-').toLowerCase()}`}>
                          <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                            Vedi Azienda
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
