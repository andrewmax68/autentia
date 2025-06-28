import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Building2, 
  Package, 
  Store, 
  BarChart3, 
  Settings, 
  Plus,
  Edit,
  Eye,
  Trash2,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StoreUploader from "@/components/StoreUploader";

const BusinessDashboard = () => {
  const [businessData] = useState({
    name: "Azienda Agricola Rossi",
    category: "Alimentari",
    region: "Toscana",
    description: "Produttori di olio extravergine di oliva biologico dal 1950",
    logo: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=center",
    products: [
      { id: 1, name: "Olio EVO Classico", category: "Olio", active: true },
      { id: 2, name: "Olio EVO Biologico", category: "Olio", active: true },
      { id: 3, name: "Olive Taggiasche", category: "Conserve", active: true },
      { id: 4, name: "Pesto Genovese", category: "Conserve", active: false }
    ],
    stores: [
      { 
        id: 1, 
        name: "Supermercato Bio Verde", 
        address: "Via Roma 123, Milano", 
        city: "Milano",
        active: true,
        products: ["Olio EVO Classico", "Olive Taggiasche"]
      },
      { 
        id: 2, 
        name: "Market Locale", 
        address: "Via Brera 78, Milano", 
        city: "Milano",
        active: true,
        products: ["Olio EVO Biologico", "Pesto Genovese"]
      },
      { 
        id: 3, 
        name: "Alimentari Centrale", 
        address: "Corso Italia 45, Torino", 
        city: "Torino",
        active: false,
        products: ["Olio EVO Classico"]
      }
    ],
    stats: {
      totalStores: 15,
      activeProducts: 3,
      totalViews: 1240,
      monthlyGrowth: 12
    }
  });

  const [showUploader, setShowUploader] = useState(false);

  const handleStoresUploaded = (newStores: any[]) => {
    console.log("Nuovi punti vendita caricati:", newStores);
    setShowUploader(false);
    // Qui integrerai il salvataggio nel database
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-2 rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Dove Si Vende?
              </h1>
            </Link>
            <nav className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Dashboard Impresa
              </Badge>
              <Button variant="outline" className="border-green-200">
                <Settings className="h-4 w-4 mr-2" />
                Impostazioni
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={businessData.logo}
              alt={businessData.name}
              className="w-16 h-16 rounded-xl border-2 border-white/20"
            />
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Benvenuto, {businessData.name}!
              </h2>
              <p className="text-green-100 text-lg">
                Gestisci i tuoi prodotti e punti vendita dalla dashboard
              </p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Store className="h-8 w-8 mx-auto mb-2 text-green-200" />
              <div className="text-2xl font-bold">{businessData.stats.totalStores}</div>
              <div className="text-sm text-green-100">Punti Vendita</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{businessData.stats.activeProducts}</div>
              <div className="text-sm text-blue-100">Prodotti Attivi</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Eye className="h-8 w-8 mx-auto mb-2 text-green-200" />
              <div className="text-2xl font-bold">{businessData.stats.totalViews}</div>
              <div className="text-sm text-green-100">Visualizzazioni</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">+{businessData.stats.monthlyGrowth}%</div>
              <div className="text-sm text-blue-100">Crescita Mensile</div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm border border-green-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-100">
              Panoramica
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-green-100">
              Prodotti
            </TabsTrigger>
            <TabsTrigger value="stores" className="data-[state=active]:bg-green-100">
              Punti Vendita
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-100">
              Profilo
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Package className="h-5 w-5 mr-2 text-green-600" />
                    Prodotti Più Popolari
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {businessData.products.filter(p => p.active).map(product => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Attivo
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Store className="h-5 w-5 mr-2 text-blue-600" />
                    Punti Vendita Recenti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {businessData.stores.filter(s => s.active).slice(0, 3).map(store => (
                      <div key={store.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{store.name}</h4>
                          <p className="text-sm text-gray-600">{store.city}</p>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {store.products.length} prodotti
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Gestione Prodotti</h3>
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Prodotto
              </Button>
            </div>

            <Card className="bg-white/70 backdrop-blur-sm border-green-100">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome Prodotto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Punti Vendita</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {businessData.products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <Badge variant={product.active ? "default" : "secondary"} 
                                className={product.active ? "bg-green-100 text-green-700" : ""}>
                            {product.active ? "Attivo" : "Inattivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {businessData.stores.filter(s => s.products.includes(product.name)).length}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stores Tab */}
          <TabsContent value="stores" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Punti Vendita</h3>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  className="border-green-200"
                  onClick={() => setShowUploader(!showUploader)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Importa Excel/CSV
                </Button>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuovo Punto Vendita
                </Button>
              </div>
            </div>

            {/* Store Uploader */}
            {showUploader && (
              <StoreUploader onStoresUploaded={handleStoresUploaded} />
            )}

            {/* Existing stores table */}
            <Card className="bg-white/70 backdrop-blur-sm border-green-100">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome Negozio</TableHead>
                      <TableHead>Indirizzo</TableHead>
                      <TableHead>Città</TableHead>
                      <TableHead>Prodotti</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {businessData.stores.map(store => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">{store.name}</TableCell>
                        <TableCell>{store.address}</TableCell>
                        <TableCell>{store.city}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {store.products.length} prodotti
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={store.active ? "default" : "secondary"} 
                                className={store.active ? "bg-green-100 text-green-700" : ""}>
                            {store.active ? "Attivo" : "Inattivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <MapPin className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Profilo Aziendale</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <Building2 className="h-5 w-5 mr-2 text-green-600" />
                    Informazioni Base
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={businessData.logo}
                      alt={businessData.name}
                      className="w-16 h-16 rounded-xl border-2 border-green-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{businessData.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-green-100 text-green-700">{businessData.category}</Badge>
                        <Badge variant="outline">{businessData.region}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Descrizione</h5>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {businessData.description}
                    </p>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifica Profilo
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-900">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Statistiche
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Punti Vendita Totali</span>
                      <span className="font-bold text-green-600">{businessData.stats.totalStores}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Prodotti Attivi</span>
                      <span className="font-bold text-blue-600">{businessData.stats.activeProducts}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Visualizzazioni Profilo</span>
                      <span className="font-bold text-green-600">{businessData.stats.totalViews}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Crescita Mensile</span>
                      <span className="font-bold text-blue-600">+{businessData.stats.monthlyGrowth}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessDashboard;
