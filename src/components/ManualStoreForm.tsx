
import { useState } from "react";
import { Plus, MapPin, Building, Phone, Globe, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface StoreFormData {
  store_name: string;
  brand: string;
  address: string;
  city: string;
  province: string;
  phone?: string;
  website?: string;
  services?: string;
}

interface ManualStoreFormProps {
  onStoreAdded?: (store: StoreFormData & { latitude?: number; longitude?: number }) => void;
}

const ManualStoreForm = ({ onStoreAdded }: ManualStoreFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<StoreFormData>({
    store_name: '',
    brand: '',
    address: '',
    city: '',
    province: '',
    phone: '',
    website: '',
    services: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Geocodifica l'indirizzo
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: geocodeData, error: geocodeError } = await supabase.functions.invoke('geocode-address', {
        body: {
          address: formData.address,
          city: formData.city,
          province: formData.province
        }
      });

      let latitude: number | undefined;
      let longitude: number | undefined;

      if (!geocodeError && geocodeData) {
        latitude = geocodeData.lat;
        longitude = geocodeData.lng;
      }

      const storeData = {
        ...formData,
        latitude,
        longitude,
        services: formData.services ? formData.services.split(',').map(s => s.trim()) : undefined
      };

      if (onStoreAdded) {
        onStoreAdded(storeData);
      }

      toast({
        title: "Punto vendita aggiunto!",
        description: latitude && longitude ? "Indirizzo geocodificato con successo" : "Aggiunto senza coordinate GPS",
      });

      // Reset form
      setFormData({
        store_name: '',
        brand: '',
        address: '',
        city: '',
        province: '',
        phone: '',
        website: '',
        services: ''
      });
      setIsOpen(false);

    } catch (error) {
      console.error('Error adding store:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta del punto vendita",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof StoreFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Punto Vendita Manualmente
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Perfetto per pochi punti vendita (fino a 10-15)
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-green-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-gray-900">
            <Building className="h-5 w-5 mr-2 text-green-600" />
            Nuovo Punto Vendita
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="store_name">Nome Negozio *</Label>
              <Input
                id="store_name"
                value={formData.store_name}
                onChange={(e) => handleInputChange('store_name', e.target.value)}
                required
                placeholder="es. Conad Via Roma"
              />
            </div>
            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                required
                placeholder="es. Conad, Coop, Pam..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Indirizzo Completo *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
              placeholder="es. Via Roma 123"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Città *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
                placeholder="es. Ancona"
              />
            </div>
            <div>
              <Label htmlFor="province">Provincia *</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                required
                placeholder="es. AN"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="es. 071 1234567"
              />
            </div>
            <div>
              <Label htmlFor="website">Sito Web</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="es. https://negozio.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="services">Servizi (separati da virgola)</Label>
            <Input
              id="services"
              value={formData.services}
              onChange={(e) => handleInputChange('services', e.target.value)}
              placeholder="es. Alimentari, Bevande, Prodotti locali"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isSubmitting ? (
                <>
                  <MapPin className="h-4 w-4 mr-2 animate-pulse" />
                  Salvataggio...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salva Punto Vendita
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualStoreForm;
