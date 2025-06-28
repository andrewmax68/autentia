import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Store, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/6b03f54d-ca30-4ce9-8444-aa880373241d.png" 
              alt="Dove Si Vende? Logo" 
              className="h-10 w-auto"
            />
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#acquirenti" className="text-gray-600 hover:text-gray-900">Per Acquirenti</a>
            <a href="#produttori" className="text-gray-600 hover:text-gray-900">Per Produttori</a>
            <Button variant="outline">Accedi</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connetti con i <span className="text-green-600">Produttori Locali</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La piattaforma che mette in contatto acquirenti e micro/piccole imprese produttrici locali. 
            Scopri dove trovare prodotti autentici della tua zona.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Search className="mr-2 h-5 w-5" />
              Trova Prodotti
            </Button>
            <Button size="lg" variant="outline">
              <Store className="mr-2 h-5 w-5" />
              Registra la tua Attività
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="acquirenti" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Per gli Acquirenti</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Scopri prodotti locali autentici e sostieni le piccole imprese del territorio
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Trova Vicino a Te</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Localizza facilmente produttori e punti vendita nella tua zona con la nostra mappa interattiva
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Search className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Ricerca Intelligente</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Filtra per categoria, distanza e tipo di prodotto per trovare esattamente quello che cerchi
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Sostieni il Locale</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Supporta l'economia locale e scopri la storia dietro ogni prodotto
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section id="produttori" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Per le Imprese</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aumenta la visibilità della tua attività e raggiungi nuovi clienti locali
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-2xl font-semibold text-gray-900 mb-6">
                Gestisci la tua presenza online
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">Profilo aziendale completo con foto e descrizioni</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">Gestione semplice di prodotti e punti vendita</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">Analytics per comprendere i tuoi clienti</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">Strumenti di comunicazione diretta</span>
                </li>
              </ul>
              <Button className="mt-6 bg-green-600 hover:bg-green-700">
                Inizia Gratuitamente
              </Button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Intuitiva</h5>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="mt-6 p-4 bg-green-50 rounded">
                  <p className="text-sm text-green-800">
                    "Interfaccia semplice e completa per gestire tutto in un posto"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Pronto a Iniziare?</h3>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Unisciti alla community di produttori e acquirenti che stanno trasformando 
            il commercio locale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Esplora la Mappa
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
              Registra la tua Attività
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/6b03f54d-ca30-4ce9-8444-aa880373241d.png" 
                  alt="Dove Si Vende? Logo" 
                  className="h-8 w-auto filter brightness-0 invert"
                />
              </div>
              <p className="text-gray-400">
                Connettendo comunità locali attraverso il commercio autentico
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Per Acquirenti</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Cerca Prodotti</a></li>
                <li><a href="#" className="hover:text-white">Mappa</a></li>
                <li><a href="#" className="hover:text-white">Come Funziona</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Per Imprese</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Registrati</a></li>
                <li><a href="#" className="hover:text-white">Dashboard</a></li>
                <li><a href="#" className="hover:text-white">Supporto</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Supporto</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contatti</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Dove Si Vende? - Tutti i diritti riservati</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
