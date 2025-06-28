
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-black mb-8">DOVE SI VENDE?</h1>
      
      <div className="bg-yellow-100 p-4 rounded mb-8">
        <p className="text-lg font-semibold mb-4">🚧 NAVIGAZIONE TEST:</p>
        <div className="space-x-4">
          <Button 
            onClick={() => navigate("/business-login")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
          >
            Vai al Login Business
          </Button>
          <Button 
            onClick={() => navigate("/business-dashboard")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
          >
            Vai al Dashboard Business
          </Button>
        </div>
      </div>

      <div className="bg-gray-100 p-6 rounded">
        <h2 className="text-2xl font-semibold mb-4">Stato del Progetto</h2>
        <p className="text-lg">✅ Homepage funzionante</p>
        <p className="text-lg">✅ Navigazione attiva</p>
        <p className="text-lg">🔧 Dashboard in sviluppo</p>
      </div>
    </div>
  );
};

export default Index;
