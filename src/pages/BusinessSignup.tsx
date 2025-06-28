import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBusinessAuth, BusinessFormData } from "@/hooks/useBusinessAuth";

const BusinessSignup = () => {
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    category: "",
    region: "",
    description: "",
    website: "",
    primaryBrand: "",
    secondaryBrands: [],
    logo: null,
    acceptTerms: false
  });

  const { signUp, isLoading } = useBusinessAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      alert("Devi accettare i termini e le condizioni per registrarti.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Le password non coincidono.");
      return;
    }

    const result = await signUp(formData);
    if (result.success) {
      navigate('/business-login');
    }
  };

  const handleInputChange = (field: keyof BusinessFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-xl">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Dove Si Vende?
            </h1>
          </Link>
          
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Registra la Tua Impresa
          </h2>
          <p className="text-gray-600">
            Unisciti alla community di produttori locali e fai conoscere i tuoi prodotti
          </p>
        </div>

        {/* Registration Form */}
        <Card className="bg-white/70 backdrop-blur-sm border-green-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center text-gray-900">
              Crea il tuo account aziendale
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome dell'Impresa</Label>
                  <Input
                    id="businessName"
                    placeholder="Nome della tua impresa"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="rounded-xl border-green-200 focus:border-green-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerName">Nome Proprietario</Label>
                  <Input
                    id="ownerName"
                    placeholder="Il tuo nome e cognome"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className="rounded-xl border-green-200 focus:border-green-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email aziendale</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="impresa@esempio.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="rounded-xl border-green-200 focus:border-green-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="rounded-xl border-green-200 focus:border-green-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Conferma Password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="rounded-xl border-green-200 focus:border-green-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    type="tel"
                    id="phone"
                    placeholder="+39 333 123 4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="rounded-xl border-green-200 focus:border-green-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="rounded-xl border-green-200">
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alimentari">Alimentari</SelectItem>
                      <SelectItem value="Bevande">Bevande</SelectItem>
                      <SelectItem value="Artigianato">Artigianato</SelectItem>
                      <SelectItem value="Tessile">Tessile</SelectItem>
                      <SelectItem value="Cosmesi">Cosmesi</SelectItem>
                      <SelectItem value="Altro">Altro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Regione</Label>
                  <Select onValueChange={(value) => handleInputChange('region', value)}>
                    <SelectTrigger className="rounded-xl border-green-200">
                      <SelectValue placeholder="Seleziona regione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abruzzo">Abruzzo</SelectItem>
                      <SelectItem value="Basilicata">Basilicata</SelectItem>
                      <SelectItem value="Calabria">Calabria</SelectItem>
                      <SelectItem value="Campania">Campania</SelectItem>
                      <SelectItem value="Emilia-Romagna">Emilia-Romagna</SelectItem>
                      <SelectItem value="Friuli-Venezia Giulia">Friuli-Venezia Giulia</SelectItem>
                      <SelectItem value="Lazio">Lazio</SelectItem>
                      <SelectItem value="Liguria">Liguria</SelectItem>
                      <SelectItem value="Lombardia">Lombardia</SelectItem>
                      <SelectItem value="Marche">Marche</SelectItem>
                      <SelectItem value="Molise">Molise</SelectItem>
                      <SelectItem value="Piemonte">Piemonte</SelectItem>
                      <SelectItem value="Puglia">Puglia</SelectItem>
                      <SelectItem value="Sardegna">Sardegna</SelectItem>
                      <SelectItem value="Sicilia">Sicilia</SelectItem>
                      <SelectItem value="Toscana">Toscana</SelectItem>
                      <SelectItem value="Trentino-Alto Adige">Trentino-Alto Adige</SelectItem>
                      <SelectItem value="Umbria">Umbria</SelectItem>
                      <SelectItem value="Valle d'Aosta">Valle d'Aosta</SelectItem>
                      <SelectItem value="Veneto">Veneto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryBrand">Brand Principale</Label>
                  <Input
                    id="primaryBrand"
                    placeholder="Nome del tuo brand principale"
                    value={formData.primaryBrand}
                    onChange={(e) => handleInputChange('primaryBrand', e.target.value)}
                    className="rounded-xl border-green-200 focus:border-green-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sito Web (opzionale)</Label>
                <Input
                  type="url"
                  id="website"
                  placeholder="https://www.tuosito.it"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="rounded-xl border-green-200 focus:border-green-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrizione dell'Impresa</Label>
                <Textarea
                  id="description"
                  placeholder="Racconta la storia della tua impresa e cosa offri"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="rounded-xl border-green-200 focus:border-green-400 resize-none"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo Aziendale (opzionale)</Label>
                <Input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={(e) => handleInputChange('logo', e.target.files?.[0] || null)}
                  className="rounded-xl border-green-200 focus:border-green-400"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', !!checked)}
                  className="rounded border-gray-300 focus:ring-green-400"
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  Accetto i <a href="#" className="text-green-600 hover:text-green-700">termini e condizioni</a>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Registrazione in corso..."
                ) : (
                  <>
                    Registra la Tua Impresa
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-800">
            ← Torna alla homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessSignup;
