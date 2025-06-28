
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowLeft, Building2, Phone, Globe, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import InteractiveMap from "@/components/InteractiveMap";

interface Store {
  id: string;
  store_name: string;
  brand: string;
  address: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  phone?: string;
  email?: string;
  website?: string;
  services?: string[];
  business_name: string;
  category?: string;
  logo_url?: string;
}

const ProducerMapPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [stores, setStores] = useState<Store[]>([]);
  const [business, setBusiness] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      if (!slug) return;

      try {
        console.log('Fetching stores for slug:', slug);
        
        // Converti slug in business name (rimuovi trattini e capitalizza)
        const businessName = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        console.log('Looking for business name:', businessName);

        const { data: storesData, error: storesError } = await supabase
          .from('public_stores')
          .select('*')
          .ilike('business_name', `%${businessName}%`);

        if (storesError) {
          console.error('Error fetching stores:', storesError);
          throw storesError;
        }

        console.log('Stores data:', storesData);

        if (!storesData || storesData.length === 0) {
          // Prova a cercare anche per slug esatto
          const { data: altStoresData, error: altStoresError } = await supabase
            .from('public_stores')
            .select('*')
            .textSearch('fts', slug.replace(/-/g, ' '));

          if (!altStoresError && altStoresData) {
            setStores(altStoresData.filter(store => store.latitude && store.longitude) as Store[]);
            if (altStoresData.length > 0) {
              setBusiness({
                business_name: altStoresData[0].business_name,
                category: altStoresData[0].category,
                logo_url: altStoresData[0].logo_url
              });
            }
          }
        } else {
          setStores(storesData.filter(store => store.latitude && store.longitude) as Store[]);
          if (storesData.length > 0) {
            setBusiness({
              business_name: storesData[0].business_name,
              category: storesData[0].category,
              logo_url: storesData[0].logo_url
            });
          }
        }

      } catch (err) {
        console.error('Error in fetchStores:', err);
        setError('Errore nel caricamento dei dati');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento mappa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Errore</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button asChild>
              <Link to="/">Torna alla Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!business || stores.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Produttore Non Trovato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Non sono stati trovati punti vendita per questo produttore.
            </p>
            <Button asChild>
              <Link to="/">Torna alla Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                {business.logo_url && (
                  <img 
                    src={business.logo_url} 
                    alt={business.business_name}
                    className="h-8 w-8 rounded object-cover"
                  />
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{business.business_name}</h1>
                  {business.category && (
                    <Badge variant="outline" className="text-xs">
                      {business.category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{stores.length} punti vendita</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Mappa Interattiva */}
        <Card className="bg-white/70 backdrop-blur-sm border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Dove Trovare i Nostri Prodotti
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InteractiveMap 
              stores={stores} 
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Lista Punti Vendita */}
        <Card className="bg-white/70 backdrop-blur-sm border-green-100">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              Elenco Punti Vendita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <Card key={store.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">{store.store_name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {store.brand}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {store.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {store.city}, {store.province}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {store.phone && (
                          <a 
                            href={`tel:${store.phone}`}
                            className="inline-flex items-center text-xs text-blue-600 hover:underline"
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            {store.phone}
                          </a>
                        )}
                        {store.website && (
                          <a 
                            href={store.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-green-600 hover:underline"
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            Sito
                          </a>
                        )}
                      </div>

                      {store.services && store.services.length > 0 && (
                        <div className="pt-2">
                          <div className="flex flex-wrap gap-1">
                            {store.services.slice(0, 3).map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {store.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{store.services.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProducerMapPage;
