
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const BrandSearch = () => {
  const [searchParams] = useSearchParams();
  const [brandSearch, setBrandSearch] = useState(searchParams.get('brand') || '');
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);

  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      setBrandSearch(brandParam);
      handleSearch(brandParam);
    }
  }, [searchParams]);

  const handleSearch = async (searchTerm?: string) => {
    const term = searchTerm || brandSearch;
    if (!term.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      console.log('Searching for brand:', term);
      
      const { data, error } = await supabase
        .from('public_stores')
        .select('*')
        .or(`brand.ilike.%${term}%,business_name.ilike.%${term}%`)
        .order('store_name');

      if (error) {
        console.error('Error searching stores:', error);
        setStores([]);
      } else {
        console.log('Found stores:', data);
        setStores(data || []);
        
        // Calculate map bounds
        if (data && data.length > 0) {
          const validStores = data.filter(store => 
            store.latitude !== null && store.longitude !== null
          );
          
          if (validStores.length > 0) {
            const bounds = new LatLngBounds([]);
            validStores.forEach(store => {
              bounds.extend([
                parseFloat(store.latitude.toString()),
                parseFloat(store.longitude.toString())
              ]);
            });
            setMapBounds(bounds);
          }
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setStores([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const defaultCenter: [number, number] = [41.9028, 12.4964]; // Rome, Italy

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            
            <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
              <Input
                type="text"
                placeholder="Cerca brand o azienda (es. Salumificio Rossi, Ceramiche Blu)"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? 'Cercando...' : 'Trova Punti Vendita'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1">
        {hasSearched && (
          <div className="container mx-auto px-4 py-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Risultati per "{brandSearch}" ({stores.length} punti vendita trovati)
              </h2>
            </div>
          </div>
        )}

        {hasSearched && stores.length === 0 && !isLoading && (
          <div className="container mx-auto px-4">
            <Card className="max-w-md mx-auto mt-8">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Brand non trovato</h3>
                <p className="text-gray-600">
                  "{brandSearch}" non è presente nel nostro database.
                </p>
                <Button className="mt-4" onClick={() => window.location.href = '/'}>
                  Nuova Ricerca
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {hasSearched && stores.length > 0 && (
          <div className="h-[calc(100vh-200px)]">
            <MapContainer
              bounds={mapBounds || undefined}
              style={{ height: '100%', width: '100%' }}
              boundsOptions={{ padding: [20, 20] }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {stores
                .filter(store => store.latitude && store.longitude)
                .map((store) => (
                  <Marker
                    key={store.id}
                    position={[
                      parseFloat(store.latitude.toString()),
                      parseFloat(store.longitude.toString())
                    ]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-lg">{store.store_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{store.brand}</p>
                        <p className="text-sm mb-1">
                          <strong>Indirizzo:</strong> {store.address}, {store.city}
                        </p>
                        {store.phone && (
                          <p className="text-sm mb-1">
                            <strong>Telefono:</strong> {store.phone}
                          </p>
                        )}
                        {store.email && (
                          <p className="text-sm mb-1">
                            <strong>Email:</strong> {store.email}
                          </p>
                        )}
                        {store.website && (
                          <p className="text-sm mb-1">
                            <strong>Sito:</strong> 
                            <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                              Visita
                            </a>
                          </p>
                        )}
                        {store.opening_hours && (
                          <div className="text-sm mt-2">
                            <strong>Orari:</strong>
                            <pre className="text-xs mt-1 whitespace-pre-wrap">
                              {JSON.stringify(store.opening_hours, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandSearch;
