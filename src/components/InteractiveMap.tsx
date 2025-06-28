
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Store {
  id: string;
  store_name: string;
  brand: string;
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  services?: string[];
}

interface InteractiveMapProps {
  stores: Store[];
  className?: string;
}

const InteractiveMap = ({ stores, className = "" }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || stores.length === 0) return;

    // Initialize map
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([42.0, 12.0], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    // Add markers for stores
    const bounds = L.latLngBounds([]);
    stores.forEach((store) => {
      if (store.latitude && store.longitude) {
        const marker = L.marker([store.latitude, store.longitude])
          .addTo(mapInstance.current!)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-lg">${store.store_name}</h3>
              <p class="text-sm text-gray-600">${store.brand}</p>
              <p class="text-sm mt-1">${store.address}</p>
              <p class="text-sm">${store.city}, ${store.province}</p>
              ${store.phone ? `<p class="text-sm mt-1">📞 ${store.phone}</p>` : ''}
              ${store.website ? `<p class="text-sm"><a href="${store.website}" target="_blank" class="text-blue-600">🌐 Sito Web</a></p>` : ''}
              ${store.services && store.services.length > 0 ? `<p class="text-xs mt-1 text-gray-500">Servizi: ${store.services.join(', ')}</p>` : ''}
            </div>
          `);
        
        bounds.extend([store.latitude, store.longitude]);
      }
    });

    // Fit map to show all markers
    if (bounds.isValid()) {
      mapInstance.current.fitBounds(bounds, { padding: [20, 20] });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [stores]);

  if (stores.length === 0) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <p className="text-gray-500">Nessun punto vendita da visualizzare</p>
          <p className="text-sm text-gray-400">Carica i tuoi punti vendita per vederli sulla mappa</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-96 rounded-lg shadow-md" />
      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow-sm">
        <span className="text-xs text-gray-600">{stores.length} punti vendita</span>
      </div>
    </div>
  );
};

export default InteractiveMap;
