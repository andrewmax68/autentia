import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Mail, Lock, Building2, User, Phone, ArrowRight, Upload, Globe, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBusinessAuth, BusinessFormData } from "@/hooks/useBusinessAuth";

const BusinessSignup = () => {
  const navigate = useNavigate();
  const { signUp, isLoading } = useBusinessAuth();
  
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
    primaryBrand: "", // New field
    secondaryBrands: [], // New field for multiple brands
    logo: null,
    acceptTerms: false
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [newBrand, setNewBrand] = useState("");

  const categories = ["Alimentari", "Bevande", "Cosmetici", "Artigianato", "Tessile", "Agricoltura", "Altro"];
  const regions = ["Lombardia", "Piemonte", "Toscana", "Umbria", "Lazio", "Campania", "Sicilia", "Altro"];

  const handleInputChange = (field: keyof BusinessFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSecondaryBrand = () => {
    if (newBrand.trim() && !formData.secondaryBrands.includes(newBrand.trim())) {
      handleInputChange('secondaryBrands', [...formData.secondaryBrands, newBrand.trim()]);
      setNewBrand("");
    }
  };

  const removeSecondaryBrand = (brandToRemove: string) => {
    handleInputChange('secondaryBrands', formData.secondaryBrands.filter(brand => brand !== brandToRemove));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Il file è troppo grande. Massimo 5MB.");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert("Per favore seleziona un'immagine valida.");
        return;
      }

      handleInputChange('logo', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Le password non coincidono");
      return;
    }

    if (!formData.primaryBrand.trim()) {
      alert("Il brand principale è obbligatorio");
      return;
    }
    
    const result = await signUp(formData);
    if (result.success) {
      navigate("/business-dashboard");
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Signup with ${provider}`);
    // In futuro integrazione con Supabase Auth
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
            Unisciti alla nostra piattaforma e fai conoscere i tuoi prodotti
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="bg-white/70 backdrop-blur-sm border-green-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center text-gray-900">
              {currentStep === 1 ? "Informazioni di Base" : "Dettagli Aziendali"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Nome dell'Impresa *
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Es. Azienda Agricola Rossi"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange('businessName', e.target.value)}
                          className="pl-10 rounded-xl border-green-200 focus:border-green-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Nome del Titolare *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Mario Rossi"
                          value={formData.ownerName}
                          onChange={(e) => handleInputChange('ownerName', e.target.value)}
                          className="pl-10 rounded-xl border-green-200 focus:border-green-400"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email Aziendale *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="email"
                        placeholder="info@aziendarossi.it"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 rounded-xl border-green-200 focus:border-green-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Telefono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="tel"
                        placeholder="+39 123 456 7890"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10 rounded-xl border-green-200 focus:border-green-400"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 rounded-xl border-green-200 focus:border-green-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Conferma Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="pl-10 rounded-xl border-green-200 focus:border-green-400"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary Brand Field - NEW */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Brand Principale * 
                      <span className="text-xs text-gray-500 block">
                        Nome con cui i clienti cercheranno i tuoi prodotti
                      </span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Es. Pasta Nonna Maria"
                        value={formData.primaryBrand}
                        onChange={(e) => handleInputChange('primaryBrand', e.target.value)}
                        className="pl-10 rounded-xl border-green-200 focus:border-green-400"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl py-3"
                  >
                    Continua
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Step 2: Business Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Logo Upload Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Logo Aziendale
                    </label>
                    <div className="border-2 border-dashed border-green-200 rounded-xl p-6 text-center">
                      {logoPreview ? (
                        <div className="space-y-3">
                          <img
                            src={logoPreview}
                            alt="Anteprima logo"
                            className="w-24 h-24 object-contain mx-auto rounded-lg border border-green-200"
                          />
                          <p className="text-sm text-gray-600">
                            {formData.logo?.name}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setLogoPreview(null);
                              handleInputChange('logo', null);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            Rimuovi
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-green-50 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                            <Upload className="h-8 w-8 text-green-600" />
                          </div>
                          <div>
                            <p className="text-gray-700 font-medium mb-1">
                              Carica il logo della tua azienda
                            </p>
                            <p className="text-sm text-gray-500">
                              PNG, JPG fino a 5MB
                            </p>
                          </div>
                          <input
                            type="file"
                            id="logo-upload"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                            className="border-green-200 hover:bg-green-50"
                          >
                            Seleziona File
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Secondary Brands Section - NEW */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Brand Secondari (Opzionale)
                      <span className="text-xs text-gray-500 block">
                        Se hai più brand, aggiungili qui
                      </span>
                    </label>
                    
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Es. Olio del Contadino"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        className="flex-1 rounded-xl border-green-200 focus:border-green-400"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSecondaryBrand())}
                      />
                      <Button
                        type="button"
                        onClick={addSecondaryBrand}
                        variant="outline"
                        className="border-green-200 hover:bg-green-50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {formData.secondaryBrands.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.secondaryBrands.map((brand, index) => (
                          <div
                            key={index}
                            className="bg-green-50 border border-green-200 px-3 py-1 rounded-full flex items-center space-x-2"
                          >
                            <span className="text-sm text-green-700">{brand}</span>
                            <button
                              type="button"
                              onClick={() => removeSecondaryBrand(brand)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Categoria Principale *
                      </label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="rounded-xl border-green-200">
                          <SelectValue placeholder="Seleziona categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Regione Principale
                      </label>
                      <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                        <SelectTrigger className="rounded-xl border-green-200">
                          <SelectValue placeholder="Seleziona regione" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map(region => (
                            <SelectItem key={region} value={region}>{region}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Website Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Sito Web Aziendale
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="url"
                        placeholder="https://www.aziendarossi.it"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="pl-10 rounded-xl border-green-200 focus:border-green-400"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Il sito web verrà mostrato nelle ricerche e nel profilo aziendale
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Descrizione dell'Azienda
                    </label>
                    <Textarea
                      placeholder="Racconta la storia della tua azienda, i tuoi prodotti e cosa ti rende unico..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="rounded-xl border-green-200 focus:border-green-400 min-h-[100px]"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                      className="mt-1 rounded border-gray-300"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      Accetto i{" "}
                      <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                        Termini di Servizio
                      </a>{" "}
                      e la{" "}
                      <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 rounded-xl border-green-200"
                    >
                      Indietro
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl py-3"
                      disabled={isLoading || !formData.acceptTerms}
                    >
                      {isLoading ? (
                        "Registrazione..."
                      ) : (
                        <>
                          Crea Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            {currentStep === 1 && (
              <>
                <div className="relative">
                  <Separator className="my-6" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">oppure</span>
                  </div>
                </div>

                {/* Social Signup Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl border-gray-200 hover:bg-gray-50"
                    onClick={() => handleSocialSignup('google')}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Registrati con Google
                  </Button>
                </div>
              </>
            )}

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Hai già un account?{" "}
                <Link to="/business-login" className="text-green-600 hover:text-green-700 font-medium">
                  Accedi qui
                </Link>
              </p>
            </div>
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
