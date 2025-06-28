
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowLeft, Phone, Mail, Globe, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Store {
  id: string;
  store_name: string;
  brand: string;
  address: string;
  city: string;
  province: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  services: string[] | null;
}

interface Producer {
  id: string;
  business_name: string;
  description: string | null;
  website: string | null;
  logo_url: string | null;
  primary_brand: string;
  secondary_brands: string[] | null;
  category: string | null;
  region: string | null;
}

const ProducerMapPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducerData = async () => {
      if (!slug) return;

      try {
        // Convert slug back to business name for search
        const searchName = slug.replace(/-/g, ' ');
        
        // Fetch producer data
        const { data: producerData, error: producerError } = await supabase
          .from('public_businesses')
          .select('*')
          .ilike('business_name', `%${searchName}%`)
          .single();

        if (producerError) {
          console.error('Error fetching producer:', producerError);
          setError('Produttore non trovato');
          return;
        }

        setProducer(producerData);

        // Fetch stores for this producer
        const { data: storesData, error: storesError } = await supabase
          .from('public_stores')
          .select('*')
          .eq('business_name', producerData.business_name);

        if (storesError) {
          console.error('Error fetching stores:', storesError);
        } else {
          setStores(storesData || []);
        }

      } catch (err) {
        console.error('Error:', err);
        setError('Errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    fetchProducerData();
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

  if (error || !producer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Produttore non trovato'}
          </h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna alla Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Indietro
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Dove Si Vende?
              </h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Producer Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white/70 backdrop-blur-sm border-green-100">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  {producer.logo_url && (
                    <img 
                      src={producer.logo_url} 
                      alt={producer.business_name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {producer.business_name}
                    </CardTitle>
                    <p className="text-green-600 font-medium">
                      {producer.primary_brand}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {producer.description && (
                  <p className="text-gray-600 text-sm">
                    {producer.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {producer.region} - {producer.category}
                </div>

                {producer.website && (
                  <a 
                    href={producer.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Visita il sito web
                  </a>
                )}

                {producer.secondary_brands && producer.secondary_brands.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Altri Brand:</p>
                    <div className="flex flex-wrap gap-2">
                      {producer.secondary_brands.map((brand, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stores List */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Store className="h-5 w-5 mr-2 text-green-600" />
                  Punti Vendita ({stores.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stores.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Nessun punto vendita ancora caricato per questo produttore.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stores.map((store) => (
                      <div key={store.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {store.store_name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {store.brand}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <p>{store.address}</p>
                              <p>{store.city}, {store.province}</p>
                            </div>
                          </div>
                          
                          {store.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <a href={`tel:${store.phone}`} className="hover:text-green-600">
                                {store.phone}
                              </a>
                            </div>
                          )}
                          
                          {store.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <a href={`mailto:${store.email}`} className="hover:text-green-600">
                                {store.email}
                              </a>
                            </div>
                          )}
                          
                          {store.services && store.services.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {store.services.map((service, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerMapPage;
