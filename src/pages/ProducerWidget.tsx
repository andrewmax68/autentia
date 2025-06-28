
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Store, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Store {
  id: string;
  store_name: string;
  brand: string;
  address: string;
  city: string;
  province: string;
  phone: string | null;
  email: string | null;
  services: string[] | null;
}

interface Producer {
  id: string;
  business_name: string;
  primary_brand: string;
  logo_url: string | null;
}

const ProducerWidget = () => {
  const { slug } = useParams<{ slug: string }>();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        const searchName = slug.replace(/-/g, ' ');
        
        const { data: producerData, error: producerError } = await supabase
          .from('public_businesses')
          .select('id, business_name, primary_brand, logo_url')
          .ilike('business_name', `%${searchName}%`)
          .single();

        if (producerError) {
          console.error('Error fetching producer:', producerError);
          return;
        }

        setProducer(producerData);

        const { data: storesData, error: storesError } = await supabase
          .from('public_stores')
          .select('id, store_name, brand, address, city, province, phone, email, services')
          .eq('business_name', producerData.business_name)
          .limit(6); // Limit for widget

        if (!storesError && storesData) {
          setStores(storesData);
        }

      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!producer) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm text-center">
        <p className="text-gray-600">Produttore non trovato</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm max-w-md mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4 pb-3 border-b">
        {producer.logo_url && (
          <img 
            src={producer.logo_url} 
            alt={producer.business_name}
            className="w-10 h-10 rounded-lg object-cover"
          />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">
            {producer.business_name}
          </h3>
          <p className="text-green-600 text-xs font-medium">
            {producer.primary_brand}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-1.5 rounded">
          <MapPin className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Stores */}
      {stores.length === 0 ? (
        <div className="text-center py-6">
          <Store className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">
            Nessun punto vendita disponibile
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Store className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">
              Punti Vendita ({stores.length})
            </span>
          </div>
          
          {stores.map((store) => (
            <div key={store.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">
                  {store.store_name}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {store.brand}
                </Badge>
              </div>
              
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-start gap-1">
                  <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{store.address}</p>
                    <p>{store.city}, {store.province}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {store.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{store.phone}</span>
                    </div>
                  )}
                  
                  {store.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{store.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {stores.length >= 6 && (
            <div className="text-center pt-2">
              <a 
                href={`${window.location.origin}/produttore/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                Vedi tutti i punti vendita →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t text-center">
        <a 
          href={window.location.origin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Powered by Dove Si Vende?
        </a>
      </div>
    </div>
  );
};

export default ProducerWidget;
