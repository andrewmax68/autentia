import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Building2, MapPin, Phone, Mail, Globe, Store, Link, Eye, Plus } from "lucide-react";
import { useBusinessAuth } from "@/hooks/useBusinessAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StoreUploader from "@/components/StoreUploader";
import ProducerLinkGenerator from "@/components/ProducerLinkGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ManualStoreForm from "@/components/ManualStoreForm";

interface StoreData {
  nomeNegozio: string;
  brand: string;
  indirizzoCompleto: string;
  citta: string;
  provincia: string;
  categoria: string;
  latitudine?: number;
  longitudine?: number;
  status?: 'pending' | 'geocoded' | 'error';
  error?: string;
}

const BusinessDashboard = () => {
  console.log('BusinessDashboard - Component rendering');
  
  const { business, logout, isAuthenticated, isLoading } = useBusinessAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'stores' | 'manual' | 'links'>('overview');
  const { toast } = useToast();

  console.log('BusinessDashboard - State:', { business, isAuthenticated, isLoading });

  const handleLogout = () => {
    console.log('BusinessDashboard - Logout clicked');
    logout();
    navigate("/business-login");
  };

  const handleStoresUploaded = async (stores: StoreData[]) => {
    if (!business) return;

    try {
      const storesToInsert = stores.map(store => ({
        business_id: business.id,
        store_name: store.nomeNegozio,
        brand: store.brand,
        address: store.indirizzoCompleto,
        city: store.citta,
        province: store.provincia,
        latitude: store.latitudine,
        longitude: store.longitudine,
        services: [store.categoria]
      }));

      const { data, error } = await supabase
        .from('stores')
        .insert(storesToInsert);

      if (error) throw error;

      toast({
        title: "Punti vendita salvati!",
        description: `${stores.length} punti vendita sono stati aggiunti con successo`,
      });

      // Switch to overview tab to show success
      setActiveTab('overview');
    } catch (error) {
      console.error('Error saving stores:', error);
      toast({
        title: "Errore nel salvataggio",
        description: "Si è verificato un errore durante il salvataggio dei punti vendita",
        variant: "destructive",
      });
    }
  };

  const handleManualStoreAdded = async (storeData: any) => {
    if (!business) return;

    try {
      const storeToInsert = {
        business_id: business.id,
        store_name: storeData.store_name,
        brand: storeData.brand,
        address: storeData.address,
        city: storeData.city,
        province: storeData.province,
        latitude: storeData.latitude,
        longitude: storeData.longitude,
        phone: storeData.phone,
        website: storeData.website,
        services: storeData.services
      };

      const { data, error } = await supabase
        .from('stores')
        .insert([storeToInsert]);

      if (error) throw error;

      toast({
        title: "Punto vendita aggiunto!",
        description: "Il nuovo punto vendita è stato salvato con successo",
      });

    } catch (error) {
      console.error('Error saving manual store:', error);
      toast({
        title: "Errore nel salvataggio",
        description: "Si è verificato un errore durante il salvataggio",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (isLoading) {
    console.log('BusinessDashboard - Showing loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Show login required if not authenticated
  if (!isAuthenticated) {
    console.log('BusinessDashboard - Not authenticated, showing login prompt');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Accesso richiesto</p>
          <Button onClick={() => navigate("/business-login")}>
            Accedi
          </Button>
        </div>
      </div>
    );
  }

  // Show business registration required if no business data
  if (!business) {
    console.log('BusinessDashboard - No business data, redirect to signup');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Completa la registrazione della tua azienda</p>
          <Button onClick={() => navigate("/business-signup")}>
            Registra Azienda
          </Button>
        </div>
      </div>
    );
  }

  console.log('BusinessDashboard - Rendering main dashboard');

  // Generate producer slug from business name
  const producerSlug = business?.business_name?.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-') || 'producer';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Produttore</h1>
              <p className="text-gray-600">Benvenuto, {business.business_name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Esci
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2"
          >
            <Building2 className="h-4 w-4" />
            Panoramica
          </Button>
          <Button
            variant={activeTab === 'stores' ? 'default' : 'outline'}
            onClick={() => setActiveTab('stores')}
            className="flex items-center gap-2"
          >
            <Store className="h-4 w-4" />
            Carica File CSV
          </Button>
          <Button
            variant={activeTab === 'manual' ? 'default' : 'outline'}
            onClick={() => setActiveTab('manual')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Aggiungi Manualmente
          </Button>
          <Button
            variant={activeTab === 'links' ? 'default' : 'outline'}
            onClick={() => setActiveTab('links')}
            className="flex items-center gap-2"
          >
            <Link className="h-4 w-4" />
            Link e Condivisione
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    Informazioni Azienda
                  </CardTitle>
                  <CardDescription>
                    Dettagli della tua attività
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{business.business_name}</p>
                        <p className="text-sm text-gray-600">Proprietario: {business.owner_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">{business.email}</p>
                    </div>
                    
                    {business.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <p className="text-sm">{business.phone}</p>
                      </div>
                    )}
                    
                    {business.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a href={business.website} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-blue-600 hover:underline">
                          {business.website}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">{business.region} - {business.category}</p>
                    </div>
                  </div>
                  
                  {business.description && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600">{business.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Brand Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>I Tuoi Brand</CardTitle>
                  <CardDescription>
                    Brand e prodotti che offri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-green-600">Brand Principale</p>
                      <p className="text-lg">{business.primary_brand}</p>
                    </div>
                    
                    {business.secondary_brands && business.secondary_brands.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-700">Brand Secondari</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {business.secondary_brands.map((brand, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {brand}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Azioni Rapide</CardTitle>
                <CardDescription>
                  Gestisci i tuoi punti vendita e condividi la tua mappa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => navigate(`/produttore/${producerSlug}`)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizza Mappa Pubblica
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('stores')}
                    className="flex items-center gap-2"
                  >
                    <Store className="h-4 w-4" />
                    Carica Punti Vendita
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('links')}
                    className="flex items-center gap-2"
                  >
                    <Link className="h-4 w-4" />
                    Genera Link e QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Stato Account</CardTitle>
                <CardDescription>
                  Stato di verifica e prossimi passi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <h3 className="font-medium text-yellow-800">Account in attesa di verifica</h3>
                    <p className="text-sm text-yellow-700">
                      Il tuo account sarà verificato entro 24-48 ore. 
                      Nel frattempo puoi caricare i tuoi punti vendita.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      business.is_verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {business.is_verified ? 'Verificato' : 'In attesa'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <div>
            <StoreUploader onStoresUploaded={handleStoresUploaded} />
          </div>
        )}

        {/* Manual Store Tab */}
        {activeTab === 'manual' && (
          <div>
            <ManualStoreForm onStoreAdded={handleManualStoreAdded} />
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div>
            <ProducerLinkGenerator 
              producerSlug={producerSlug}
              producerName={business?.business_name || "Tua Azienda"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
