
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Building2, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  console.log("Index component is rendering");
  
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  console.log("About to return JSX");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Dove Si Vende?
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/search">
                <Button variant="ghost" className="hover:bg-green-50">
                  Cerca
                </Button>
              </Link>
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

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Scopri dove trovare i
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {" "}prodotti locali{" "}
            </span>
            che ami
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Connetti con piccole e micro imprese produttrici. Trova i punti vendita 
            più vicini a te per prodotti unici e di qualità.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Cerca per brand o categoria di prodotto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-32 py-6 text-lg rounded-full border-2 border-green-200 focus:border-green-400 shadow-lg"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8"
              >
                Cerca
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/70 backdrop-blur-sm border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Ricerca Intelligente</h3>
                <p className="text-gray-600">
                  Trova facilmente prodotti per brand o categoria, 
                  scopri nuove realtà produttive locali.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Mappa Interattiva</h3>
                <p className="text-gray-600">
                  Visualizza tutti i punti vendita su una mappa, 
                  trova quello più vicino a te.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Profili Dettagliati</h3>
                <p className="text-gray-600">
                  Conosci meglio le imprese, i loro prodotti 
                  e la loro storia.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-16 px-6">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Sei un'impresa produttrice?
          </h3>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Registrati gratuitamente e fai conoscere i tuoi prodotti a migliaia di potenziali clienti.
          </p>
          <Link to="/business-signup">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
              Registra la Tua Impresa
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">Dove Si Vende?</span>
              </div>
              <p className="text-gray-400">
                Connettendo acquirenti e produttori locali per un commercio più sostenibile.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Per gli Acquirenti</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/search" className="hover:text-white transition-colors">Cerca Prodotti</Link></li>
                <li><Link to="/map" className="hover:text-white transition-colors">Mappa Punti Vendita</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Per le Imprese</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/business-signup" className="hover:text-white transition-colors">Registrati</Link></li>
                <li><Link to="/business-login" className="hover:text-white transition-colors">Area Riservata</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Supporto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Come Funziona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contatti</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Dove Si Vende? Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
