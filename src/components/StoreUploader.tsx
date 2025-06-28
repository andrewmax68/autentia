import { useState, useRef } from "react";
import { Upload, Download, MapPin, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface StoreUploaderProps {
  businessId: string;
  onStoresUploaded?: () => void;
}

const StoreUploader = ({ businessId, onStoresUploaded }: StoreUploaderProps) => {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const headers = ['Nome Negozio', 'Brand', 'Indirizzo completo', 'Città', 'Provincia', 'Categoria'];
    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_punti_vendita.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Il file deve contenere almeno una riga di dati oltre all\'header');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const requiredHeaders = ['Nome Negozio', 'Brand', 'Indirizzo completo', 'Città', 'Provincia', 'Categoria'];
      
      const missingHeaders = requiredHeaders.filter(req => 
        !headers.some(h => h.toLowerCase().includes(req.toLowerCase().replace(' ', '')))
      );

      if (missingHeaders.length > 0) {
        throw new Error(`Colonne mancanti: ${missingHeaders.join(', ')}`);
      }

      const parsedStores: StoreData[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length >= 6) {
          parsedStores.push({
            nomeNegozio: values[0] || '',
            brand: values[1] || '',
            indirizzoCompleto: values[2] || '',
            citta: values[3] || '',
            provincia: values[4] || '',
            categoria: values[5] || '',
            status: 'pending'
          });
        }
      }

      setStores(parsedStores);
      toast({
        title: "File caricato con successo",
        description: `${parsedStores.length} punti vendita importati`,
      });

    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Errore nel caricamento del file');
      toast({
        title: "Errore nel caricamento",
        description: "Controlla il formato del file e riprova",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const geocodeAddress = async (address: string, city: string, province: string): Promise<{lat: number, lng: number}> => {
    const { data, error } = await supabase.functions.invoke('geocode-address', {
      body: { address, city, province }
    });

    if (error) {
      console.error('Geocoding error:', error);
      throw new Error(`Geocoding failed for: ${address}, ${city}, ${province}`);
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return { lat: data.lat, lng: data.lng };
  };

  const startGeocoding = async () => {
    setIsGeocoding(true);
    const updatedStores = [...stores];
    
    for (let i = 0; i < updatedStores.length; i++) {
      try {
        const coordinates = await geocodeAddress(
          updatedStores[i].indirizzoCompleto,
          updatedStores[i].citta,
          updatedStores[i].provincia
        );
        
        updatedStores[i].latitudine = coordinates.lat;
        updatedStores[i].longitudine = coordinates.lng;
        updatedStores[i].status = 'geocoded';
        
        setStores([...updatedStores]);
        
        // Delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        updatedStores[i].status = 'error';
        updatedStores[i].error = error instanceof Error ? error.message : 'Errore geocodifica';
        setStores([...updatedStores]);
      }
    }
    
    setIsGeocoding(false);
    
    const successCount = updatedStores.filter(s => s.status === 'geocoded').length;
    toast({
      title: "Geocodifica completata",
      description: `${successCount}/${updatedStores.length} indirizzi geocodificati con successo`,
    });
  };

  const handleSaveStores = async () => {
    const geocodedStores = stores.filter(s => s.status === 'geocoded');
    
    try {
      const storesToInsert = geocodedStores.map(store => ({
        business_id: businessId,
        store_name: store.nomeNegozio,
        brand: store.brand,
        address: store.indirizzoCompleto,
        city: store.citta,
        province: store.provincia,
        latitude: store.latitudine,
        longitude: store.longitudine,
        services: [store.categoria]
      }));

      const { error } = await supabase
        .from('stores')
        .insert(storesToInsert);

      if (error) {
        throw error;
      }

      if (onStoresUploaded) {
        onStoresUploaded();
      }

      toast({
        title: "Punti vendita salvati",
        description: `${geocodedStores.length} punti vendita aggiunti al sistema`,
      });

      // Reset the form
      setStores([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error saving stores:', error);
      toast({
        title: "Errore",
        description: "Errore durante il salvataggio dei punti vendita",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">In attesa</Badge>;
      case 'geocoded':
        return <Badge className="bg-green-100 text-green-700">Geocodificato</Badge>;
      case 'error':
        return <Badge variant="destructive">Errore</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-100">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Upload className="h-5 w-5 mr-2 text-green-600" />
            Caricamento Punti Vendita
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="border-green-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Scarica Template
            </Button>
            
            <div className="flex-1">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="border-green-200"
                disabled={isUploading}
              />
            </div>
            
            {isUploading && <Loader2 className="h-4 w-4 animate-spin text-green-600" />}
          </div>

          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Geocoding Section - Simplified */}
      {stores.length > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Geocodifica Automatica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Converti automaticamente gli indirizzi in coordinate GPS per visualizzare i punti vendita sulla mappa.
            </p>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={startGeocoding}
                disabled={isGeocoding}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isGeocoding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Geocodifica in corso...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Avvia Geocodifica ({stores.length} indirizzi)
                  </>
                )}
              </Button>
              
              {stores.filter(s => s.status === 'geocoded').length > 0 && (
                <Button
                  onClick={handleSaveStores}
                  variant="outline"
                  className="border-green-200"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Salva Punti Vendita ({stores.filter(s => s.status === 'geocoded').length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Table */}
      {stores.length > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-green-100">
          <CardHeader>
            <CardTitle className="text-gray-900">
              Anteprima Dati ({stores.length} punti vendita)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Negozio</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Città</TableHead>
                    <TableHead>Provincia</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Stato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stores.map((store, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{store.nomeNegozio}</TableCell>
                      <TableCell>{store.brand}</TableCell>
                      <TableCell>{store.citta}</TableCell>
                      <TableCell>{store.provincia}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{store.categoria}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(store.status || 'pending')}
                        {store.error && (
                          <p className="text-xs text-red-600 mt-1">{store.error}</p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoreUploader;
