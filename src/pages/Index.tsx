
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Store, ShoppingBag } from "lucide-react";

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
            <a href="#cerca-prodotti" className="text-gray-600 hover:text-gray-900">Cerca Prodotti</a>
            <a href="#per-negozi" className="text-gray-600 hover:text-gray-900">Per Negozi</a>
            <Button variant="outline">Accedi</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Trova dove <span className="text-green-600">comprare</span> i tuoi prodotti preferiti
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Scopri i negozi vicino a te che vendono i brand e prodotti che stai cercando. 
            Non perdere più tempo girando negozi: trova subito dove fare la spesa!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Search className="mr-2 h-5 w-5" />
              Cerca un Prodotto
            </Button>
            <Button size="lg" variant="outline">
              <MapPin className="mr-2 h-5 w-5" />
              Negozi Vicini
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="cerca-prodotti" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Come Funziona</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trova facilmente dove acquistare i tuoi brand preferiti nei negozi della tua zona
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Cerca il Prodotto</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Digita il nome del brand o prodotto che stai cercando: pasta, olio, vino, formaggi e molto altro
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Trova i Negozi</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Visualizza sulla mappa tutti i punti vendita vicino a te che hanno il prodotto disponibile
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <ShoppingBag className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Vai a Comprare</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Ottieni indicazioni, orari di apertura e contatti del negozio per organizzare la tua spesa
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section id="per-negozi" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Per i Negozi</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fai conoscere i prodotti che vendi e attira nuovi clienti nella tua zona
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
                  <span className="text-gray-700">Elenca tutti i prodotti e brand che vendi</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">Appari nelle ricerche dei clienti della zona</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">Gestisci orari, contatti e disponibilità prodotti</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                  <span className="text-gray-700">Attrai clienti che cercano prodotti specifici</span>
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
                  <p className="text-sm text-green-800">"Pasta Benedetto Cavalieri"</p>
                </div>
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-blue-800">"Olio extravergine biologico"</p>
                </div>
                <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-500">
                  <p className="text-sm text-purple-800">"Formaggi di capra"</p>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">
                    I tuoi clienti ti troveranno quando cercano i prodotti che vendi!
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
          <h3 className="text-3xl font-bold mb-4">Inizia Subito la Ricerca</h3>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Trova i negozi che vendono i tuoi prodotti preferiti e scopri nuovi brand locali
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Search className="mr-2 h-5 w-5" />
              Cerca Prodotti
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
              <Store className="mr-2 h-5 w-5" />
              Registra il tuo Negozio
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
                Trova facilmente dove comprare i tuoi prodotti preferiti nei negozi vicini
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Per Consumatori</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Cerca Prodotti</a></li>
                <li><a href="#" className="hover:text-white">Mappa Negozi</a></li>
                <li><a href="#" className="hover:text-white">Come Funziona</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Per Negozi</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Registrati</a></li>
                <li><a href="#" className="hover:text-white">Gestisci Prodotti</a></li>
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
