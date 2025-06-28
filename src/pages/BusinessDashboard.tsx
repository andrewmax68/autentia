
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Store, Plus, LogOut, Edit, Trash2, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBusinessAuth } from "@/hooks/useBusinessAuth";
import { supabase } from "@/integrations/supabase/client";
import StoresList from "@/components/StoresList";
import ManualStoreForm from "@/components/ManualStoreForm";
import StoreUploader from "@/components/StoreUploader";
import InteractiveMap from "@/components/InteractiveMap";
import ProducerLinkGenerator from "@/components/ProducerLinkGenerator";

const BusinessDashboard = () => {
  const { user, session, business, isLoading: authLoading, isInitializing } = useBusinessAuth();
  const [stores, setStores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddStore, setShowAddStore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('BusinessDashboard - Auth state changed:');
    console.log('- User:', user?.email);
    console.log('- Session:', !!session);
    console.log('- Business:', business?.business_name);
    console.log('- Auth loading:', authLoading);
    console.log('- Initializing:', isInitializing);

    if (!isInitializing) {
      if (!user || !session) {
        console.log("BusinessDashboard - No user/session, redirecting to login");
        navigate('/business-login');
        return;
      }

      if (business) {
        console.log("BusinessDashboard - Business found, loading stores");
        loadStores();
      } else if (!authLoading) {
        console.log("BusinessDashboard - No business found and not loading");
        setError("Nessuna impresa associata a questo account");
        setIsLoading(false);
      }
    }
  }, [user, session, business, authLoading, isInitializing, navigate]);

  const loadStores = async () => {
    if (!business) {
      console.log("BusinessDashboard - No business available for loading stores");
      return;
    }

    try {
      console.log("BusinessDashboard - Loading stores for business:", business.id);
      
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .eq('business_id', business.id)
        .eq('is_active', true);

      if (storesError) {
        console.error("BusinessDashboard - Error loading stores:", storesError);
        throw storesError;
      }

      console.log("BusinessDashboard - Stores loaded:", storesData);
      setStores(storesData || []);
      setError("");
      
    } catch (error) {
      console.error("BusinessDashboard - Error loading stores:", error);
      setError("Errore nel caricamento dei punti vendita");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log("BusinessDashboard - Logging out");
    navigate('/business-login');
  };

  const handleStoreAdded = () => {
    setShowAddStore(false);
    loadStores();
  };

  // Generate slug from business name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  if (isInitializing || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    console.log("BusinessDashboard - Rendering: No user or session");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertDescription className="text-red-800">
                Sessione scaduta. Per favore accedi di nuovo.
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/business-login')}>
              Vai al Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()}>
                Ricarica Pagina
              </Button>
              <Button variant="outline" onClick={() => navigate('/business-login')}>
                Torna al Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Caricamento impresa...</h3>
            <p className="text-gray-600 mb-4">
              Attendere il caricamento dei dati dell'impresa.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const businessSlug = generateSlug(business.business_name);
  const validStores = stores.filter(store => store.latitude && store.longitude);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {business.business_name}
                </h1>
                <p className="text-sm text-gray-600">Dashboard Impresa</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Esci
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Panoramica</TabsTrigger>
            <TabsTrigger value="stores">Punti Vendita</TabsTrigger>
            <TabsTrigger value="map">Mappa</TabsTrigger>
            <TabsTrigger value="share">Condividi</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Informazioni Impresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Nome Impresa</p>
                      <p className="text-lg">{business.business_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Proprietario</p>
                      <p className="text-lg">{business.owner_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Brand Principale</p>
                      <p className="text-lg">{business.primary_brand}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categoria</p>
                      <p className="text-lg">{business.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Regione</p>
                      <p className="text-lg">{business.region}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-lg">{business.email}</p>
                    </div>
                  </div>
                  {business.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Descrizione</p>
                      <p className="text-gray-800">{business.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiche</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{stores.length}</div>
                      <p className="text-sm text-gray-600">Punti Vendita Totali</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{validStores.length}</div>
                      <p className="text-sm text-gray-600">Con Coordinate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-emerald-600">
                        {business.is_verified ? 'Verificata' : 'In Verifica'}
                      </div>
                      <p className="text-sm text-gray-600">Stato Account</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stores Tab */}
          <TabsContent value="stores">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Store className="h-5 w-5 mr-2" />
                    Punti Vendita ({stores.length})
                  </CardTitle>
                  <Button
                    onClick={() => setShowAddStore(!showAddStore)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi Punto Vendita
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddStore && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Aggiungi Nuovo Punto Vendita</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Inserimento Manuale</h4>
                        <ManualStoreForm
                          businessId={business.id}
                          onStoreAdded={handleStoreAdded}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Caricamento File</h4>
                        <StoreUploader
                          businessId={business.id}
                          onStoresUploaded={handleStoreAdded}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <StoresList businessId={business.id} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Mappa Punti Vendita
                </CardTitle>
              </CardHeader>
              <CardContent>
                {validStores.length > 0 ? (
                  <InteractiveMap stores={validStores} className="w-full h-96" />
                ) : (
                  <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">Nessun punto vendita con coordinate</p>
                      <p className="text-sm text-gray-400">
                        Aggiungi punti vendita con indirizzo per visualizzarli sulla mappa
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Share Tab */}
          <TabsContent value="share">
            <ProducerLinkGenerator 
              producerSlug={businessSlug}
              producerName={business.business_name}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessDashboard;
