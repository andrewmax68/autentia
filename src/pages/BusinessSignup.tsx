import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Mail, Lock, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

const BusinessSignup = () => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      toast({
        title: "Attenzione!",
        description: "Devi accettare i termini e le condizioni per registrarti.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            company_name: companyName,
            description: description,
          },
        },
      });

      if (error) {
        console.error("Errore durante la registrazione:", error.message);
        toast({
          title: "Errore!",
          description:
            error.message ||
            "Si è verificato un errore durante la registrazione. Riprova.",
        });
      } else {
        console.log("Registrazione avvenuta con successo!", data);
        toast({
          title: "Registrazione avvenuta!",
          description:
            "Ti abbiamo inviato una email di conferma. Per favore, verifica la tua casella di posta.",
        });
        navigate('/business-login');
      }
    } catch (error) {
      console.error("Si è verificato un errore inatteso:", error);
      toast({
        title: "Errore Inatteso!",
        description:
          "Si è verificato un errore inatteso. Per favore, riprova più tardi.",
      });
    } finally {
      setIsLoading(false);
    }
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
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                  Nome dell'Impresa
                </Label>
                <Input
                  type="text"
                  id="companyName"
                  placeholder="Nome della tua impresa"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="rounded-xl border-green-200 focus:border-green-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email aziendale
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="impresa@esempio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-green-200 focus:border-green-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-green-200 focus:border-green-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Descrizione dell'Impresa
                </Label>
                <Textarea
                  id="description"
                  placeholder="Racconta la storia della tua impresa e cosa offri"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl border-green-200 focus:border-green-400 resize-none"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
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
