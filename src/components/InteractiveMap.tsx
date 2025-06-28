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
    console.log('InteractiveMap - Received stores:', stores);
    
    if (!mapRef.current) {
      console.log('InteractiveMap - No map ref');
      return;
    }

    if (stores.length === 0) {
      console.log('InteractiveMap - No stores provided');
      return;
    }

    // Initialize map only once
    if (!mapInstance.current) {
      console.log('InteractiveMap - Initializing map');
      mapInstance.current = L.map(mapRef.current).setView([43.6158, 13.5189], 8);

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
    let markersAdded = 0;

    stores.forEach((store) => {
      console.log('InteractiveMap - Processing store:', store.store_name, 'Lat:', store.latitude, 'Lng:', store.longitude);
      
      if (store.latitude && store.longitude) {
        const popupContent = `
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-lg text-gray-900 mb-1">${store.store_name}</h3>
            <p class="text-sm text-green-600 font-medium mb-2">${store.brand}</p>
            <p class="text-sm text-gray-700 mb-1">${store.address}</p>
            <p class="text-sm text-gray-700 mb-2">${store.city}, ${store.province}</p>
            ${store.phone ? `<p class="text-sm text-blue-600 mb-1">📞 <a href="tel:${store.phone}">${store.phone}</a></p>` : ''}
            ${store.website ? `<p class="text-sm text-blue-600 mb-1">🌐 <a href="${store.website}" target="_blank" class="underline">Sito Web</a></p>` : ''}
            ${store.services && store.services.length > 0 ? `<p class="text-xs text-gray-500 mt-2"><strong>Servizi:</strong> ${store.services.join(', ')}</p>` : ''}
          </div>
        `;

        const marker = L.marker([store.latitude, store.longitude])
          .addTo(mapInstance.current!)
          .bindPopup(popupContent, { 
            maxWidth: 300,
            className: 'custom-popup'
          });
        
        bounds.extend([store.latitude, store.longitude]);
        markersAdded++;
        console.log('InteractiveMap - Added marker for:', store.store_name);
      } else {
        console.log('InteractiveMap - Store missing coordinates:', store.store_name);
      }
    });

    console.log('InteractiveMap - Total markers added:', markersAdded);

    // Fit map to show all markers
    if (bounds.isValid() && markersAdded > 0) {
      mapInstance.current.fitBounds(bounds, { 
        padding: [20, 20],
        maxZoom: 12
      });
      console.log('InteractiveMap - Fitted bounds to markers');
    }

    // Cleanup function
    return () => {
      // Don't remove the map instance in cleanup, just clear markers
      if (mapInstance.current) {
        mapInstance.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            mapInstance.current?.removeLayer(layer);
          }
        });
      }
    };
  }, [stores]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

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
      <style>
        {`
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        `}
      </style>
    </div>
  );
};

export default InteractiveMap;
