
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-green-600">Dove Si Vende?</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#cerca-prodotti" className="text-gray-600 hover:text-gray-900">Cerca Prodotti</a>
          <a href="#per-produttori" className="text-gray-600 hover:text-gray-900">Per Produttori</a>
          <Button variant="outline">Accedi</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
