
import { useState } from "react";
import { Copy, QrCode, Code, ExternalLink, Check, MapPin, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ProducerLinkGeneratorProps {
  producerSlug?: string;
  producerName?: string;
}

const ProducerLinkGenerator = ({ 
  producerSlug = "pastificio-del-borgo", 
  producerName = "Pastificio del Borgo" 
}: ProducerLinkGeneratorProps) => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const baseUrl = window.location.origin;
  const producerUrl = `${baseUrl}/produttore/${producerSlug}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(producerUrl)}`;
  
  const embedCode = `<!-- Widget Mappa Punti Vendita per ${producerName} -->
<iframe 
  src="${producerUrl}" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
</iframe>`;

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      toast({
        title: "Copiato!",
        description: `${item} copiato negli appunti`,
      });
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      toast({
        title: "Errore",
        description: "Impossibile copiare negli appunti",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Preview della Mappa */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-100">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Eye className="h-5 w-5 mr-2 text-green-600" />
            Anteprima Mappa Pubblica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <h3 className="font-medium text-green-800">La tua mappa è pronta!</h3>
                <p className="text-sm text-green-700">
                  Mostra tutti i tuoi punti vendita attivi su una mappa interattiva
                </p>
              </div>
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700"
              >
                <a href={producerUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="h-4 w-4 mr-2" />
                  Visualizza Mappa
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Link e Codici */}
      <Card className="bg-white/70 backdrop-blur-sm border-green-100">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <QrCode className="h-5 w-5 mr-2 text-green-600" />
            Link e Codici di Condivisione
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="link" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="link">Link Diretto</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="embed">Codice Embed</TabsTrigger>
            </TabsList>

            {/* Link Diretto */}
            <TabsContent value="link" className="space-y-4">
              <div>
                <Label htmlFor="producer-url" className="text-sm font-medium text-gray-700">
                  URL della tua mappa pubblica
                </Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input 
                    id="producer-url"
                    value={producerUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(producerUrl, "Link")}
                  >
                    {copiedItem === "Link" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={producerUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Condividi questo link per far trovare ai tuoi clienti tutti i tuoi punti vendita
                </p>
              </div>
            </TabsContent>

            {/* QR Code */}
            <TabsContent value="qr" className="space-y-4">
              <div className="text-center">
                <div className="inline-block p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img 
                    src={qrCodeUrl}
                    alt={`QR Code per ${producerName}`}
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    Scarica e stampa questo QR code per i tuoi materiali promozionali
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={qrCodeUrl} download={`qr-code-${producerSlug}.png`}>
                        Scarica PNG
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(producerUrl, "URL QR Code")}
                    >
                      {copiedItem === "URL QR Code" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      Copia Link
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Codice Embed */}
            <TabsContent value="embed" className="space-y-4">
              <div>
                <Label htmlFor="embed-code" className="text-sm font-medium text-gray-700">
                  Codice da inserire nel tuo sito web
                </Label>
                <div className="mt-2">
                  <div className="relative">
                    <textarea
                      id="embed-code"
                      value={embedCode}
                      readOnly
                      className="w-full h-32 p-3 text-sm font-mono bg-gray-50 border border-gray-200 rounded-md resize-none"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(embedCode, "Codice Embed")}
                    >
                      {copiedItem === "Codice Embed" ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <div className="flex items-start space-x-2">
                      <Code className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Come utilizzare:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Copia il codice sopra</li>
                          <li>Incollalo nella pagina del tuo sito web</li>
                          <li>La mappa si aggiornerà automaticamente quando modifichi i punti vendita</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Istruzioni */}
      <Card className="bg-white/70 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <Code className="h-5 w-5 mr-2 text-blue-600" />
            Come Funziona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <p>La mappa mostra automaticamente tutti i tuoi punti vendita <strong>attivi</strong></p>
            </div>
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <p>Quando aggiungi o modifichi punti vendita, il link si aggiorna automaticamente</p>
            </div>
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <p>I clienti possono vedere dettagli, telefono e sito web di ogni punto vendita</p>
            </div>
            <div className="flex items-start space-x-2">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <p>La mappa funziona su tutti i dispositivi e non richiede registrazione</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProducerLinkGenerator;
