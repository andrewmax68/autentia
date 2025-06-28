
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBusinessAuth } from "@/hooks/useBusinessAuth";

const BusinessLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login, isLoading } = useBusinessAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Per favore inserisci email e password");
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      console.log("Login successful, redirecting to dashboard");
      navigate('/business-dashboard');
    } else {
      console.error("Login failed:", result.error);
      if (result.error?.message?.includes('Invalid login credentials')) {
        setError("Email o password non corretti");
      } else if (result.error?.message?.includes('Email not confirmed')) {
        setError("Per favore conferma la tua email prima di accedere");
      } else {
        setError(result.error?.message || "Errore durante il login");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white py-12 px-6">
      <div className="max-w-md mx-auto">
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
            <LogIn className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Accedi al Tuo Account
          </h2>
          <p className="text-gray-600">
            Gestisci la tua impresa e i tuoi punti vendita
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/70 backdrop-blur-sm border-green-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center text-gray-900">
              Accesso Imprese
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="password">Password</Label>
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Accedendo..."
                ) : (
                  <>
                    Accedi
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Non hai ancora un account?
              </p>
              <Link to="/business-signup">
                <Button variant="outline" className="w-full rounded-xl">
                  Registra la Tua Impresa
                </Button>
              </Link>
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

export default BusinessLogin;
