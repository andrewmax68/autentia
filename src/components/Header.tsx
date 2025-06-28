
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link to="/">
            <h1 className="text-2xl font-bold text-green-600">Dove Si Vende?</h1>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6 items-center">
          <a href="#cerca-prodotti" className="text-gray-600 hover:text-gray-900">Cerca Prodotti</a>
          <a href="#per-produttori" className="text-gray-600 hover:text-gray-900">Per Produttori</a>
          <Link to="/admin/login">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Admin
            </Button>
          </Link>
          <Link to="/business-login">
            <Button variant="outline">Accedi</Button>
          </Link>
          <Link to="/business-signup">
            <Button className="bg-green-600 hover:bg-green-700">Registra la Tua Impresa</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
