
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Building2, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  console.log("Index component started rendering");
  
  const [searchQuery, setSearchQuery] = useState("");
  console.log("State initialized");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  console.log("About to render JSX");

  // Versione semplificata per test
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Dove Si Vende?</h1>
      <p className="text-center text-gray-600 mb-8">Test rendering - se vedi questo, il componente funziona</p>
      
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <Input
            type="text"
            placeholder="Test search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full">
            Cerca Test
          </Button>
        </form>
      </div>
      
      <div className="text-center mt-8">
        <Link to="/search" className="text-blue-600 hover:underline mr-4">
          Vai alla ricerca
        </Link>
        <Link to="/business-login" className="text-green-600 hover:underline">
          Area Business
        </Link>
      </div>
    </div>
  );
};

export default Index;
