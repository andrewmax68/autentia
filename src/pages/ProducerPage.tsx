
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Globe, Phone, Mail, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProducerPage = () => {
  const { slug } = useParams();
  const [producer, setProducer] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in realtà verrà dal database
  useEffect(() => {
    const mockProducer = {
      id: "pasta-del-borgo",
      slug: "pasta-del-borgo",
      name: "Pastificio del Borgo",
      description: "Pasta artigianale con grani antichi dal 1950. Tradizione e qualità che si tramandano di generazione in generazione.",
      logo: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop&crop=center",
      category: "Alimentari",
      region: "Toscana",
      website: "https://pastificiodelborgoo.it",
      phone: "+39 055 123456",
      email: "info@pastificiodelborgoo.it",
      products: ["Pasta di Grano Duro", "Pasta Integrale", "Pasta ai Cereali Antichi"]
    };

    const mockStores = [
      {
        id: 1,
        name: "Bio Market Centrale",
        address: "Via Roma 123, Firenze",
        city: "Firenze",
        latitude: 43.7696,
        longitude: 11.2558,
        phone: "+39 055 987654",
        products: ["Pasta di Grano Duro", "Pasta Integrale"]
      },
      {
        id: 2,
        name: "Alimentari Gourmet",
        address: "Corso Italia 45, Siena",
        city: "Siena", 
        latitude: 43.3188,
        longitude: 11.3307,
        phone: "+39 0577 123456",
        products: ["Pasta ai Cereali Antichi"]
      },
      {
        id: 3,
        name: "Supermercato Bio Verde",
        address: "Piazza del Campo 12, Siena",
        city: "Siena",
        latitude: 43.3181,
        longitude: 11.3316,
        products: ["Pasta di Grano Duro", "Pasta Integrale", "Pasta ai Cereali Antichi"]
      }
    ];

    setTimeout(() => {
      setProducer(mockProducer);
      setStores(mockStores);
      setLoading(false);
    }, 500);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!producer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produttore non trovato</h1>
          <p className="text-gray-600">Il produttore che stai cercando non esiste.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={producer.logo}
                alt={producer.name}
                className="w-16 h-16 rounded-xl border border-gray-200"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{producer.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-green-100 text-green-700">{producer.category}</Badge>
                  <Badge variant="outline">{producer.region}</Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-2">Trova dove acquistare</p>
              <div className="flex items-center space-x-2">
                {producer.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={producer.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-1" />
                      Sito Web
                    </a>
                  </Button>
                )}
                {producer.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${producer.phone}`}>
                      <Phone className="h-4 w-4 mr-1" />
                      Chiama
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-gray-600 max-w-3xl">{producer.description}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Prodotti */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Prodotti Disponibili
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {producer.products.map((product, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="font-medium text-green-800">{product}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Punti Vendita */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Punti Vendita ({stores.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stores.map((store) => (
                    <div key={store.id} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900">{store.name}</h4>
                          <p className="text-sm text-blue-700 mt-1">{store.address}</p>
                          {store.phone && (
                            <p className="text-sm text-blue-600 mt-1">{store.phone}</p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {store.products.map((product, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <a 
                              href={`https://maps.google.com/maps?q=${store.latitude},${store.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Mappa
                            </a>
                          </Button>
                          {store.phone && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={`tel:${store.phone}`}>
                                <Phone className="h-3 w-3 mr-1" />
                                Chiama
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerPage;
