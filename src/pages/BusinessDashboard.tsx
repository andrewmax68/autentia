
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Building2, MapPin, Phone, Mail, Globe } from "lucide-react";
import { useBusinessAuth } from "@/hooks/useBusinessAuth";
import { useNavigate } from "react-router-dom";

const BusinessDashboard = () => {
  console.log('BusinessDashboard - Component rendering');
  
  const { business, logout, isAuthenticated, isLoading } = useBusinessAuth();
  const navigate = useNavigate();

  console.log('BusinessDashboard - State:', { business, isAuthenticated, isLoading });

  const handleLogout = () => {
    console.log('BusinessDashboard - Logout clicked');
    logout();
    navigate("/business-login");
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Prossimi Passi</CardTitle>
            <CardDescription>
              Completa il setup della tua presenza online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
              
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Funzionalità di gestione punti vendita in arrivo...</p>
                <p className="text-sm text-gray-500">
                  Presto potrai caricare e gestire i tuoi punti vendita
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessDashboard;
