
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/6b03f54d-ca30-4ce9-8444-aa880373241d.png" 
            alt="Dove Si Vende? Logo" 
            className="h-10 w-auto"
          />
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#cerca-prodotti" className="text-gray-600 hover:text-gray-900">Cerca Prodotti</a>
          <a href="#per-negozi" className="text-gray-600 hover:text-gray-900">Per Negozi</a>
          <Button variant="outline">Accedi</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
