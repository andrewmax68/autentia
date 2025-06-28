
import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Dati di esempio - in futuro verranno da Supabase
  const sampleData = [
    {
      id: 1,
      businessName: "Azienda Agricola Rossi",
      logo: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop&crop=center",
      description: "Produttori di olio extravergine di oliva biologico",
      category: "Alimentari",
      region: "Toscana",
      products: ["Olio EVO", "Olive", "Conserve"],
      storeCount: 12
    },
    {
      id: 2,
      businessName: "Saponi Naturali Verde",
      logo: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop&crop=center",
      description: "Saponi artigianali con ingredienti naturali",
      category: "Cosmetici",
      region: "Umbria",
      products: ["Saponi", "Creme", "Shampoo solidi"],
      storeCount: 8
    },
    {
      id: 3,
      businessName: "Birrificio delle Alpi",
      logo: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=150&h=150&fit=crop&crop=center",
      description: "Birre artigianali con ingredienti di montagna",
      category: "Bevande",
      region: "Piemonte",
      products: ["Birra IPA", "Birra Lager", "Birra Weiss"],
      storeCount: 15
    }
  ];

  const categories = ["Alimentari", "Bevande", "Cosmetici", "Artigianato", "Tessile"];
  const regions = ["Lombardia", "Piemonte", "Toscana", "Umbria", "Lazio", "Campania"];

  useEffect(() => {
    // Recupera query string dall'URL se presente
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, []);

  const filteredData = sampleData.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesRegion = selectedRegion === "all" || item.region === selectedRegion;
    
    return matchesSearch && matchesCategory && matchesRegion;
  });

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
              <Link to="/map">
                <Button variant="ghost" className="hover:bg-green-50">
                  Mappa
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
        {/* Search Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-green-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Trova i prodotti che cerchi
          </h2>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Cerca per brand, prodotto o categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-4 text-lg rounded-xl border-2 border-green-200 focus:border-green-400"
            />
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="rounded-xl border-green-200">
                  <SelectValue placeholder="Tutte le categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le categorie</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Regione</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="rounded-xl border-green-200">
                  <SelectValue placeholder="Tutte le regioni" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le regioni</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl">
                <Filter className="mr-2 h-4 w-4" />
                Applica Filtri
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Trovati <span className="font-semibold text-green-600">{filteredData.length}</span> risultati
            {searchQuery && <span> per "{searchQuery}"</span>}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map(business => (
            <Card key={business.id} className="bg-white/70 backdrop-blur-sm border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={business.logo}
                    alt={business.businessName}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-green-200"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 mb-2">
                      {business.businessName}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {business.category}
                      </Badge>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {business.region}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {business.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Prodotti:</h4>
                  <div className="flex flex-wrap gap-1">
                    {business.products.map(product => (
                      <Badge key={product} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{business.storeCount} punti vendita</span>
                  </div>
                  <Link to={`/business/${business.id}`}>
                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                      Dettagli
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nessun risultato trovato</h3>
            <p className="text-gray-600 mb-6">
              Prova a modificare i criteri di ricerca o esplora tutte le categorie.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedRegion("all");
              }}
            >
              Resetta Filtri
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
