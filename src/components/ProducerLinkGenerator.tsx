
import { useState } from "react";
import { Copy, QrCode, Code, ExternalLink, Check } from "lucide-react";
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
  
  const embedCode = `<!-- Widget Dove Si Vende per ${producerName} -->
<iframe 
  src="${baseUrl}/widget/${producerSlug}" 
  width="100%" 
  height="400" 
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
                URL della tua pagina produttore
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
                Condividi questo link per far trovare ai tuoi clienti tutti i punti vendita
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
                    onClick={() => copyToClipboard(producerUrl, "QR Code URL")}
                  >
                    {copiedItem === "QR Code URL" ? (
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
                        <li>Incollalo nella pagina del tuo sito web dove vuoi mostrare i punti vendita</li>
                        <li>Il widget si aggiornerà automaticamente quando modifichi i punti vendita</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Statistiche */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">156</div>
              <div className="text-xs text-green-700">Visualizzazioni</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">23</div>
              <div className="text-xs text-blue-700">Click su Mappa</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">8</div>
              <div className="text-xs text-purple-700">Embed Attivi</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProducerLinkGenerator;
