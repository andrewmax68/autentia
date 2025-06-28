
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Save, X, MapPin, Phone, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Store {
  id: string;
  store_name: string;
  brand: string;
  address: string;
  city: string;
  province: string;
  phone?: string;
  website?: string;
  services?: string[];
  latitude?: number;
  longitude?: number;
  is_active: boolean;
}

interface StoresListProps {
  businessId: string;
}

const StoresList = ({ businessId }: StoresListProps) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [editingStore, setEditingStore] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Store>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStores();
  }, [businessId]);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStores(data || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i punti vendita",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (store: Store) => {
    setEditingStore(store.id);
    setEditData({
      store_name: store.store_name,
      brand: store.brand,
      address: store.address,
      city: store.city,
      province: store.province,
      phone: store.phone || '',
      website: store.website || '',
      services: store.services || []
    });
  };

  const cancelEdit = () => {
    setEditingStore(null);
    setEditData({});
  };

  const saveEdit = async (storeId: string) => {
    try {
      const updateData = {
        ...editData,
        services: typeof editData.services === 'string' 
          ? editData.services.split(',').map(s => s.trim()).filter(s => s)
          : editData.services
      };

      const { error } = await supabase
        .from('stores')
        .update(updateData)
        .eq('id', storeId);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Punto vendita aggiornato con successo",
      });

      await fetchStores();
      setEditingStore(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating store:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il punto vendita",
        variant: "destructive",
      });
    }
  };

  const deleteStore = async (storeId: string, storeName: string) => {
    if (!confirm(`Sei sicuro di voler eliminare "${storeName}"?`)) return;

    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Punto vendita eliminato con successo",
      });

      await fetchStores();
    } catch (error) {
      console.error('Error deleting store:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il punto vendita",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (storeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('stores')
        .update({ is_active: !currentStatus })
        .eq('id', storeId);

      if (error) throw error;

      toast({
        title: "Successo",
        description: `Punto vendita ${!currentStatus ? 'attivato' : 'disattivato'} con successo`,
      });

      await fetchStores();
    } catch (error) {
      console.error('Error toggling store status:', error);
      toast({
        title: "Errore",
        description: "Impossibile modificare lo stato del punto vendita",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento punti vendita...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nessun punto vendita trovato</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Non hai ancora aggiunto nessun punto vendita. Usa le altre sezioni per aggiungerne.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          I Tuoi Punti Vendita ({stores.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Indirizzo</TableHead>
                <TableHead>Città</TableHead>
                <TableHead>Servizi</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>
                    {editingStore === store.id ? (
                      <Input
                        value={editData.store_name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, store_name: e.target.value }))}
                        className="w-full"
                      />
                    ) : (
                      <div>
                        <div className="font-medium">{store.store_name}</div>
                        {store.phone && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {store.phone}
                          </div>
                        )}
                        {store.website && (
                          <div className="text-xs text-blue-600 flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <a href={store.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              Sito Web
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingStore === store.id ? (
                      <Input
                        value={editData.brand || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, brand: e.target.value }))}
                      />
                    ) : (
                      store.brand
                    )}
                  </TableCell>
                  <TableCell>
                    {editingStore === store.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editData.address || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Indirizzo"
                        />
                      </div>
                    ) : (
                      <div className="text-sm">
                        {store.address}
                        {store.latitude && store.longitude && (
                          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            Geolocalizzato
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingStore === store.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editData.city || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Città"
                        />
                        <Input
                          value={editData.province || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, province: e.target.value }))}
                          placeholder="Provincia"
                        />
                      </div>
                    ) : (
                      <div className="text-sm">
                        {store.city}, {store.province}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingStore === store.id ? (
                      <Input
                        value={Array.isArray(editData.services) ? editData.services.join(', ') : (editData.services || '')}
                        onChange={(e) => setEditData(prev => ({ ...prev, services: e.target.value }))}
                        placeholder="Servizi separati da virgola"
                      />
                    ) : (
                      <div className="space-y-1">
                        {store.services && store.services.length > 0 ? (
                          store.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs mr-1">
                              {service}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">Nessun servizio</span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={store.is_active ? "default" : "secondary"}
                      size="sm"
                      onClick={() => toggleActive(store.id, store.is_active)}
                      className={store.is_active ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {store.is_active ? "Attivo" : "Inattivo"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingStore === store.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => saveEdit(store.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(store)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteStore(store.id, store.store_name)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoresList;
