
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProducerWidget = () => {
  const { slug } = useParams();
  const [producer, setProducer] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in realtà verrà dal database
  useEffect(() => {
    const mockProducer = {
      name: "Pastificio del Borgo",
      logo: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=50&h=50&fit=crop&crop=center"
    };

    const mockStores = [
      {
        id: 1,
        name: "Bio Market Centrale",
        address: "Via Roma 123, Firenze",
        city: "Firenze",
        latitude: 43.7696,
        longitude: 11.2558
      },
      {
        id: 2,
        name: "Alimentari Gourmet", 
        address: "Corso Italia 45, Siena",
        city: "Siena",
        latitude: 43.3188,
        longitude: 11.3307
      },
      {
        id: 3,
        name: "Supermercato Bio Verde",
        address: "Piazza del Campo 12, Siena", 
        city: "Siena",
        latitude: 43.3181,
        longitude: 11.3316
      }
    ];

    setTimeout(() => {
      setProducer(mockProducer);
      setStores(mockStores);
      setLoading(false);
    }, 300);
  }, [slug]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!producer) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm text-center">
        <p className="text-gray-500 text-sm">Produttore non trovato</p>
      </div>
    );
  }

  const baseUrl = window.location.origin;
  const fullPageUrl = `${baseUrl}/produttore/${slug}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header del widget */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={producer.logo}
              alt={producer.name}
              className="w-8 h-8 rounded-lg border border-white/20"
            />
            <div>
              <h3 className="font-semibold text-white text-sm">{producer.name}</h3>
              <p className="text-green-100 text-xs">Dove acquistare</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
            asChild
          >
            <a href={fullPageUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1" />
              Vedi tutto
            </a>
          </Button>
        </div>
      </div>

      {/* Lista punti vendita */}
      <div className="p-3 max-h-64 overflow-y-auto">
        <div className="space-y-3">
          {stores.slice(0, 4).map((store) => (
            <div key={store.id} className="flex items-start justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">{store.name}</h4>
                <p className="text-gray-600 text-xs truncate">{store.address}</p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {store.city}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-2 text-xs"
                asChild
              >
                <a 
                  href={`https://maps.google.com/maps?q=${store.latitude},${store.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-3 w-3" />
                </a>
              </Button>
            </div>
          ))}
          
          {stores.length > 4 && (
            <div className="text-center pt-2">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                asChild
              >
                <a href={fullPageUrl} target="_blank" rel="noopener noreferrer">
                  Vedi altri {stores.length - 4} punti vendita
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer del widget */}
      <div className="bg-gray-50 px-3 py-2 text-center border-t">
        <p className="text-xs text-gray-500">
          Powered by{" "}
          <a 
            href={baseUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700"
          >
            Dove Si Vende?
          </a>
        </p>
      </div>
    </div>
  );
};

export default ProducerWidget;
