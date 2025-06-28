
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminService } from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Download, Filter } from 'lucide-react';

interface Store {
  id: string;
  store_name: string;
  brand: string;
  address: string;
  city: string;
  province: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  business_id: string | null;
  businesses?: {
    business_name: string;
    primary_brand: string;
  };
}

interface Business {
  id: string;
  business_name: string;
}

const AdminStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const businessFromUrl = searchParams.get('business');
  const businessNameFromUrl = searchParams.get('name');

  useEffect(() => {
    const admin = adminService.getCurrentAdmin();
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  useEffect(() => {
    filterStores();
  }, [stores, selectedBusiness]);

  useEffect(() => {
    if (businessFromUrl) {
      setSelectedBusiness(businessFromUrl);
    }
  }, [businessFromUrl]);

  const loadData = async () => {
    try {
      const [storesData, businessesData] = await Promise.all([
        adminService.getStores(),
        adminService.getBusinesses()
      ]);
      setStores(storesData);
      setBusinesses(businessesData);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterStores = () => {
    if (selectedBusiness === 'all') {
      setFilteredStores(stores);
    } else {
      setFilteredStores(stores.filter(store => store.business_id === selectedBusiness));
    }
  };

  const handleExportCSV = () => {
    adminService.exportStoresCSV(filteredStores);
    toast({
      title: "Export completato",
      description: "Il file CSV è stato scaricato",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento punti vendita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Torna alla Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-green-700">
                  Gestione Punti Vendita
                </h1>
                {businessNameFromUrl && (
                  <p className="text-gray-600">
                    Brand: {decodeURIComponent(businessNameFromUrl)}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={handleExportCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Esporta CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Seleziona brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i brand</SelectItem>
                  {businesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.business_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stores Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Punti Vendita ({filteredStores.length})
            </CardTitle>
            <CardDescription>
              Lista completa dei punti vendita nel sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Negozio</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Indirizzo</TableHead>
                    <TableHead>Città</TableHead>
                    <TableHead>Provincia</TableHead>
                    <TableHead>Contatti</TableHead>
                    <TableHead>Stato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell className="font-medium">
                        {store.store_name}
                      </TableCell>
                      <TableCell>
                        {store.businesses?.business_name || store.brand}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {store.address}
                      </TableCell>
                      <TableCell>{store.city}</TableCell>
                      <TableCell>{store.province}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {store.phone && <div>Tel: {store.phone}</div>}
                          {store.email && <div>Email: {store.email}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          store.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {store.is_active ? 'Attivo' : 'Inattivo'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStores.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Nessun punto vendita trovato
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStores;
