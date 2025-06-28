
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/6b03f54d-ca30-4ce9-8444-aa880373241d.png" 
                alt="Dove Si Vende? Logo" 
                className="h-8 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-400">
              Trova facilmente dove comprare i tuoi brand preferiti nei negozi vicini
            </p>
          </div>
          <div>
            <h6 className="font-semibold mb-4">Per Consumatori</h6>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Cerca Brand</a></li>
              <li><a href="#" className="hover:text-white">Mappa Negozi</a></li>
              <li><a href="#" className="hover:text-white">Come Funziona</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-4">Per Produttori</h6>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Registra Prodotti</a></li>
              <li><a href="#" className="hover:text-white">Gestisci Punti Vendita</a></li>
              <li><a href="#" className="hover:text-white">Supporto</a></li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-4">Supporto</h6>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Contatti</a></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Dove Si Vende? - Tutti i diritti riservati</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
