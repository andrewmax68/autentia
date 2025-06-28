
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Store, BarChart3, Share2, LogOut } from "lucide-react";
import { useBusinessAuth } from "@/hooks/useBusinessAuth";
import { useNavigate } from "react-router-dom";
import StoreUploader from "@/components/StoreUploader";
import ProducerLinkGenerator from "@/components/ProducerLinkGenerator";

const BusinessDashboard = () => {
  const { business, logout, isAuthenticated } = useBusinessAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    logout();
    navigate("/business-login");
  };

  // Show loading state if auth is being checked
  if (!isAuthenticated) {
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

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Caricamento dati azienda...</p>
        </div>
      </div>
    );
  }

  const mockStats = {
    totalStores: 12,
    activeStores: 10,
    monthlyViews: 245,
    weeklyGrowth: "+12%"
  };

  const handleStoresUploaded = (stores: any[]) => {
    console.log("Stores uploaded:", stores);
    // Here you would typically save to database
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Produttore</h1>
              <p className="text-gray-600">Benvenuto, {business.company_name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Esci
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Panoramica</TabsTrigger>
            <TabsTrigger value="stores">Punti Vendita</TabsTrigger>
            <TabsTrigger value="analytics">Statistiche</TabsTrigger>
            <TabsTrigger value="sharing">Condivisione</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Punti Vendita</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.totalStores}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockStats.activeStores} attivi
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visualizzazioni</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.monthlyViews}</div>
                  <p className="text-xs text-muted-foreground">
                    Questo mese
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Crescita</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStats.weeklyGrowth}</div>
                  <p className="text-xs text-muted-foreground">
                    Ultima settimana
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <Badge variant="default">Attivo</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Account verificato
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Azioni Rapide</CardTitle>
                <CardDescription>
                  Gestisci i tuoi punti vendita e condividi la tua presenza
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button onClick={() => setActiveTab("stores")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Carica Punti Vendita
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("sharing")}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Genera Link e QR
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores">
            <StoreUploader onStoresUploaded={handleStoresUploaded} />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Statistiche Dettagliate</CardTitle>
                <CardDescription>
                  Analisi delle performance dei tuoi punti vendita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  Statistiche dettagliate saranno disponibili a breve
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sharing">
            <ProducerLinkGenerator 
              producerSlug={business.slug}
              producerName={business.company_name}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessDashboard;
