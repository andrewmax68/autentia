
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, ShoppingBag } from "lucide-react";

const FeaturesSection = () => {
  return (
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
              <CardTitle>Cerca il Brand</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Digita il nome del brand che stai cercando: Barilla, De Cecco, Ferrero, Lavazza e migliaia di altri
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
                Visualizza sulla mappa tutti i punti vendita vicino a te che hanno il brand disponibile
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
                Ottieni indicazioni, orari di apertura e disponibilità per organizzare al meglio la tua spesa
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
