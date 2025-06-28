
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import InteractiveMap from '@/components/InteractiveMap';

interface Store {
  id: string;
  store_name: string;
  brand: string;
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  opening_hours?: any;
  services?: string[];
  business_name: string;
}

const BrandSearch = () => {
  const [searchParams] = useSearchParams();
  const [brandName, setBrandName] = useState(searchParams.get('brand') || '');
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBrand = async (brand: string) => {
    if (!brand.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      console.log('Searching for brand:', brand);
      
      // Search in public_stores view for active stores
      const { data: storesData, error: storesError } = await supabase
        .from('public_stores')
        .select('*')
        .or(`brand.ilike.%${brand}%,business_name.ilike.%${brand}%`)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (storesError) {
        console.error('Error searching stores:', storesError);
        throw storesError;
      }

      console.log('Found stores:', storesData);
      
      const mappedStores = storesData?.map(store => ({
        ...store,
        latitude: parseFloat(store.latitude as string),
        longitude: parseFloat(store.longitude as string)
      })) || [];

      setStores(mappedStores as Store[]);
      
    } catch (err) {
      console.error('Error in brand search:', err);
      setError('Errore durante la ricerca. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBrand(brandName);
  };

  // Search on component mount if brand is in URL
  useEffect(() => {
    const urlBrand = searchParams.get('brand');
    if (urlBrand) {
      setBrandName(urlBrand);
      searchBrand(urlBrand);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Sticky Search Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Ricerca Brand</h1>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <Input
              type="text"
              placeholder="Cerca brand o nome azienda (es. Salumificio Rossi, Ceramiche Blu)"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !brandName.trim()}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Trova Punti Vendita
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {hasSearched && !isLoading && (
          <>
            {stores.length > 0 ? (
              <div className="space-y-6">
                {/* Results Summary */}
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">
                        {stores.length} punti vendita trovati per "{brandName}"
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBrandName('');
                        setStores([]);
                        setHasSearched(false);
                        setError(null);
                      }}
                    >
                      Nuova Ricerca
                    </Button>
                  </div>
                </div>

                {/* Interactive Map */}
                <Card className="bg-white/70 backdrop-blur-sm border-green-100">
                  <CardContent className="p-0">
                    <InteractiveMap stores={stores} className="w-full h-[600px] rounded-lg" />
                  </CardContent>
                </Card>

                {/* Store List */}
                <Card className="bg-white/70 backdrop-blur-sm border-green-100">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Elenco Punti Vendita</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {stores.map((store) => (
                        <Card key={store.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900">{store.store_name}</h4>
                              <p className="text-sm text-green-600 font-medium">{store.brand}</p>
                              <p className="text-sm text-gray-600">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {store.address}
                              </p>
                              <p className="text-sm text-gray-600">{store.city}, {store.province}</p>
                              
                              {store.phone && (
                                <p className="text-sm text-blue-600">
                                  📞 <a href={`tel:${store.phone}`} className="hover:underline">{store.phone}</a>
                                </p>
                              )}
                              
                              {store.website && (
                                <p className="text-sm text-blue-600">
                                  🌐 <a href={store.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    Sito Web
                                  </a>
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm border-yellow-100">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Brand non trovato</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Non abbiamo trovato punti vendita per "{brandName}" nel nostro database.
                      Prova con un nome diverso o contatta il brand direttamente.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setBrandName('');
                        setHasSearched(false);
                        setError(null);
                      }}
                    >
                      Prova un'altra ricerca
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {!hasSearched && (
          <Card className="bg-white/70 backdrop-blur-sm border-blue-100">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Cerca i tuoi brand preferiti</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Inserisci il nome del brand o dell'azienda che stai cercando per trovare tutti i punti vendita
                  dove acquistare i loro prodotti.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BrandSearch;
