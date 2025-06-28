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
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const fetchStores = async () => {
      if (!slug) return;

      try {
        console.log('Fetching stores for slug:', slug);
        
        // Convert slug to different possible business name formats
        const businessName1 = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        const businessName2 = slug
          .split('-')
          .map(word => word.toUpperCase())
          .join(' ');
          
        const businessName3 = slug.replace(/-/g, ' ');

        console.log('Trying business names:', [businessName1, businessName2, businessName3]);

        setDebugInfo(prev => ({
          ...prev,
          slug,
          possibleNames: [businessName1, businessName2, businessName3]
        }));

        // First, try to find ALL businesses to see what's available
        const { data: allBusinesses, error: allBusinessError } = await supabase
          .from('businesses')
          .select('business_name, is_verified, id')
          .limit(20);

        console.log('All businesses in database:', allBusinesses);
        setDebugInfo(prev => ({ ...prev, allBusinesses }));

        // Try different name variations
        let businessData = null;
        let businessError = null;

        for (const searchName of [businessName1, businessName2, businessName3]) {
          const { data, error } = await supabase
            .from('businesses')
            .select('*')
            .ilike('business_name', `%${searchName}%`)
            .maybeSingle();

          if (data && !error) {
            businessData = data;
            businessError = null;
            break;
          }
          if (error) businessError = error;
        }

        if (businessError) {
          console.error('Error fetching business:', businessError);
        }

        if (businessData) {
          console.log('Business found:', businessData);
          setBusiness(businessData);
          setDebugInfo(prev => ({ ...prev, businessFound: true, businessData }));
          
          // Now get stores for this business
          const { data: storesData, error: storesError } = await supabase
            .from('stores')
            .select('*')
            .eq('business_id', businessData.id);

          console.log('Raw stores query result:', storesData);
          setDebugInfo(prev => ({ ...prev, rawStores: storesData }));

          if (storesError) {
            console.error('Error fetching stores:', storesError);
            throw storesError;
          }

          console.log('Stores data:', storesData);
          
          // Map the stores data to include business_name
          const mappedStores = storesData?.map(store => ({
            ...store,
            business_name: businessData.business_name,
            category: businessData.category,
            logo_url: businessData.logo_url
          })) || [];
          
          console.log('Mapped stores:', mappedStores);
          setDebugInfo(prev => ({ ...prev, mappedStores }));
          
          // Filter stores with coordinates
          const validStores = mappedStores.filter(store => store.latitude && store.longitude);
          console.log('Valid stores with coordinates:', validStores);
          
          setStores(validStores as Store[]);
        } else {
          // Fallback: try to find stores using public_stores view
          console.log('Business not found, trying public_stores fallback');
          setDebugInfo(prev => ({ ...prev, businessFound: false, tryingFallback: true }));
          
          let publicStoresData = null;
          
          for (const searchName of [businessName1, businessName2, businessName3]) {
            const { data, error } = await supabase
              .from('public_stores')
              .select('*')
              .ilike('business_name', `%${searchName}%`);

            if (data && data.length > 0) {
              publicStoresData = data;
              break;
            }
          }

          console.log('Public stores data:', publicStoresData);
          setDebugInfo(prev => ({ ...prev, publicStoresData }));

          if (publicStoresData && publicStoresData.length > 0) {
            const filteredStores = publicStoresData.filter(store => store.latitude && store.longitude);
            setStores(filteredStores as Store[]);
            setBusiness({
              business_name: publicStoresData[0].business_name,
              category: publicStoresData[0].category,
              logo_url: publicStoresData[0].logo_url
            });
            setDebugInfo(prev => ({ ...prev, fallbackSuccess: true, filteredStores }));
          }
        }

      } catch (err) {
        console.error('Error in fetchStores:', err);
        setError('Errore nel caricamento dei dati');
        setDebugInfo(prev => ({ ...prev, error: err }));
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
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle>Produttore Non Trovato</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Non sono stati trovati punti vendita attivi per questo produttore.
            </p>
            
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 space-y-3">
              <p className="text-sm text-yellow-800">
                <strong>Debug Info:</strong>
              </p>
              <p className="text-xs text-yellow-700">
                Slug cercato: "{debugInfo.slug}"
              </p>
              <p className="text-xs text-yellow-700">
                Nomi provati: {debugInfo.possibleNames?.join(', ')}
              </p>
              <p className="text-xs text-yellow-700">
                Business trovato: {debugInfo.businessFound ? 'Sì' : 'No'}
              </p>
              <p className="text-xs text-yellow-700">
                Stores trovati: {stores.length}
              </p>
              
              {debugInfo.allBusinesses && (
                <div className="mt-2">
                  <p className="text-xs text-yellow-800 font-medium">Imprese disponibili nel database:</p>
                  <div className="text-xs text-yellow-700 max-h-32 overflow-y-auto">
                    {debugInfo.allBusinesses.map((b: any, i: number) => (
                      <div key={i}>• {b.business_name} (verified: {b.is_verified ? 'Sì' : 'No'})</div>
                    ))}
                  </div>
                </div>
              )}
              
              {debugInfo.rawStores && (
                <div className="mt-2">
                  <p className="text-xs text-yellow-800 font-medium">Punti vendita grezzi:</p>
                  <p className="text-xs text-yellow-700">Trovati: {debugInfo.rawStores.length}</p>
                </div>
              )}
            </div>
            
            <Button asChild className="mt-4">
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
