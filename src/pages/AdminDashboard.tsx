import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { adminService, AdminUser } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Building2, Store, Users, Download, Home } from 'lucide-react';

interface DashboardStats {
  totalBrands: number;
  totalStores: number;
}

interface Business {
  id: string;
  business_name: string;
  owner_name: string;
  email: string;
  created_at: string;
  is_verified: boolean;
  primary_brand: string;
}

const AdminDashboard = () => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({ totalBrands: 0, totalStores: 0 });
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const admin = adminService.getCurrentAdmin();
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    setCurrentAdmin(admin);
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const [statsData, businessesData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getBusinesses()
      ]);
      setStats(statsData);
      setBusinesses(businessesData);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati della dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminService.logout();
    navigate('/admin/login');
  };

  const goToHome = () => {
    navigate('/');
  };

  const toggleBusinessStatus = async (businessId: string, currentStatus: boolean) => {
    try {
      await adminService.toggleBusinessStatus(businessId, !currentStatus);
      await loadDashboardData();
      toast({
        title: "Aggiornamento completato",
        description: `Brand ${!currentStatus ? 'attivato' : 'disattivato'} con successo`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare lo stato del brand",
        variant: "destructive",
      });
    }
  };

  const viewStores = (businessId: string, businessName: string) => {
    navigate(`/admin/stores?business=${businessId}&name=${encodeURIComponent(businessName)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-green-700">
                Dove Si Vende? - Admin
              </h1>
              <p className="text-gray-600">
                Benvenuto, {currentAdmin?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={goToHome}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Torna alla Home
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Esci
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brands Totali</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBrands}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Punti Vendita</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStores}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brands Attivi</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {businesses.filter(b => b.is_verified).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Businesses List */}
        <Card>
          <CardHeader>
            <CardTitle>Brands Registrati</CardTitle>
            <CardDescription>
              Lista completa dei brands nel sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businesses.map((business) => (
                <div 
                  key={business.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{business.business_name}</h3>
                      <Badge variant={business.is_verified ? "default" : "secondary"}>
                        {business.is_verified ? 'Attivo' : 'Inattivo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{business.email}</p>
                    <p className="text-xs text-gray-500">
                      Registrato: {new Date(business.created_at).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3 sm:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewStores(business.id, business.business_name)}
                    >
                      Vedi Negozi
                    </Button>
                    <Button
                      size="sm"
                      variant={business.is_verified ? "destructive" : "default"}
                      onClick={() => toggleBusinessStatus(business.id, business.is_verified)}
                    >
                      {business.is_verified ? 'Disattiva' : 'Attiva'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
