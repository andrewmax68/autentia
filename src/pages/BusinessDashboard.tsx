
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
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

  // Show business not found if no business data
  if (!business) {
    console.log('BusinessDashboard - No business data');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Caricamento dati azienda...</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Benvenuto nel tuo Dashboard</CardTitle>
            <CardDescription>
              Gestisci la tua presenza sui punti vendita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800">Azienda: {business.company_name}</h3>
                <p className="text-sm text-green-700">Proprietario: {business.owner_name}</p>
                <p className="text-sm text-green-700">Email: {business.email}</p>
                <p className="text-sm text-green-700">Categoria: {business.category}</p>
                <p className="text-sm text-green-700">Regione: {business.region}</p>
              </div>
              
              <div className="text-center py-8">
                <p className="text-gray-600">Dashboard in sviluppo...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Presto potrai gestire i tuoi punti vendita e visualizzare le statistiche
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
