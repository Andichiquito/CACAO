/**
 * Utilidades para Leaflet (OpenStreetMap) - Versión Simple y Gratuita
 */

import L from 'leaflet';

let mapInstance: L.Map | null = null;
let markerInstance: L.Marker | null = null;
let onLocationChange: ((address: string, lat: number, lng: number) => void) | null = null;

// Fix para los iconos de Leaflet en React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/**
 * Obtiene la ubicación del usuario usando geolocalización
 */
export const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no está disponible'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

// Límites de Cochabamba, Bolivia (más flexibles)
const COCHABAMBA_BOUNDS = {
  north: -17.0,
  south: -17.8,
  east: -65.7,
  west: -66.6
};

const COCHABAMBA_CENTER: [number, number] = [-17.3935, -66.1570];

/**
 * Verifica si las coordenadas están dentro de Cochabamba (más flexible)
 */
const isWithinCochabamba = (lat: number, lng: number): boolean => {
  // Límites más flexibles para permitir más resultados
  return (
    lat >= COCHABAMBA_BOUNDS.south &&
    lat <= COCHABAMBA_BOUNDS.north &&
    lng >= COCHABAMBA_BOUNDS.west &&
    lng <= COCHABAMBA_BOUNDS.east
  );
};

/**
 * Geocodificación usando solo OpenStreetMap/Nominatim (sin Google Maps)
 */
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number; displayName: string } | null> => {
  const addressLower = address.toLowerCase().trim();
  
  // Intentar múltiples variaciones de búsqueda
  const searchVariations = [
    address, // Búsqueda exacta primero
    `${address}, Cochabamba`, // Con Cochabamba
    `${address}, Cochabamba, Bolivia`, // Con Cochabamba, Bolivia
  ];
  
  // Si la dirección no menciona Cochabamba, agregar variaciones
  if (!addressLower.includes('cochabamba') && !addressLower.includes('cbba')) {
    searchVariations.push(`${address} Cochabamba`);
    searchVariations.push(`${address} Cbba`);
  }
  
  // Intentar con OpenStreetMap/Nominatim
  for (const searchQuery of searchVariations) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=10&countrycodes=bo&addressdetails=1&bounded=1&viewbox=${COCHABAMBA_BOUNDS.west},${COCHABAMBA_BOUNDS.south},${COCHABAMBA_BOUNDS.east},${COCHABAMBA_BOUNDS.north}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Priorizar resultados dentro de Cochabamba
        const results = data.sort((a: any, b: any) => {
          const aLat = parseFloat(a.lat);
          const aLng = parseFloat(a.lon);
          const bLat = parseFloat(b.lat);
          const bLng = parseFloat(b.lon);
          const aInBounds = isWithinCochabamba(aLat, aLng);
          const bInBounds = isWithinCochabamba(bLat, bLng);
          if (aInBounds && !bInBounds) return -1;
          if (!aInBounds && bInBounds) return 1;
          return 0;
        });
        
        // Buscar el primer resultado (priorizando los que están en Cochabamba)
        for (const item of results) {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          
          if (isWithinCochabamba(lat, lng)) {
            return {
              lat: lat,
              lng: lng,
              displayName: item.display_name
            };
          }
        }
        
        // Si no hay ninguno en Cochabamba pero hay resultados, usar el primero
        if (results.length > 0) {
          const firstItem = results[0];
          return {
            lat: parseFloat(firstItem.lat),
            lng: parseFloat(firstItem.lon),
            displayName: firstItem.display_name
          };
        }
      }
    } catch (error) {
      // Continuar con la siguiente variación
      continue;
    }
  }
  
  return null;
};

/**
 * Geocodificación inversa: convierte coordenadas a dirección
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error('Error en geocodificación inversa:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

/**
 * Inicializa el mapa de Leaflet con geolocalización del usuario
 */
export const initializeMap = async (
  mapContainer: HTMLElement,
  onLocationUpdate?: (address: string, lat: number, lng: number) => void
): Promise<L.Map | null> => {
  if (!mapContainer) {
    return null;
  }

  onLocationChange = onLocationUpdate || null;

  try {
    // Intentar obtener la ubicación del usuario
    let center: [number, number] = COCHABAMBA_CENTER; // Cochabamba por defecto
    let isUserLocation = false;

    try {
      const userLocation = await getUserLocation();
      // Solo usar la ubicación del usuario si está dentro de Cochabamba
      if (isWithinCochabamba(userLocation.lat, userLocation.lng)) {
        center = [userLocation.lat, userLocation.lng];
        isUserLocation = true;
      }
    } catch (error) {
      // Usar ubicación por defecto si no se puede obtener
    }

    // Crear mapa limitado a Cochabamba
    mapInstance = L.map(mapContainer, {
      center: center,
      zoom: center[0] === COCHABAMBA_CENTER[0] ? 13 : 15,
      zoomControl: true,
      maxBounds: [
        [COCHABAMBA_BOUNDS.south, COCHABAMBA_BOUNDS.west],
        [COCHABAMBA_BOUNDS.north, COCHABAMBA_BOUNDS.east]
      ],
      maxBoundsViscosity: 1.0 // Fuerza a mantener los límites
    });

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapInstance);

    // Agregar marcador arrastrable
    markerInstance = L.marker(center, {
      draggable: true,
      title: isUserLocation ? 'Tu ubicación' : 'Ubicación seleccionada'
    }).addTo(mapInstance);

    // Obtener dirección inicial
    if (isUserLocation) {
      const address = await reverseGeocode(center[0], center[1]);
      if (onLocationChange) {
        onLocationChange(address, center[0], center[1]);
      }
    }

    // Evento cuando se arrastra el marcador
    markerInstance.on('dragend', async () => {
      if (!markerInstance || !mapInstance) return;
      const position = markerInstance.getLatLng();
      
      // Validación más flexible - solo si está muy fuera de Cochabamba
      if (!isWithinCochabamba(position.lat, position.lng)) {
        // Permitir un poco fuera pero no demasiado
        const margin = 0.1; // Margen de 0.1 grados
        const wayOut = (
          position.lat < COCHABAMBA_BOUNDS.south - margin ||
          position.lat > COCHABAMBA_BOUNDS.north + margin ||
          position.lng < COCHABAMBA_BOUNDS.west - margin ||
          position.lng > COCHABAMBA_BOUNDS.east + margin
        );
        
        if (wayOut) {
          markerInstance.setLatLng(COCHABAMBA_CENTER);
          return; // No mostrar alerta
        }
      }
      
      const address = await reverseGeocode(position.lat, position.lng);
      if (onLocationChange) {
        onLocationChange(address, position.lat, position.lng);
      }
    });

    // Evento cuando se hace clic en el mapa
    mapInstance.on('click', async (e: L.LeafletMouseEvent) => {
      if (!mapInstance) return;
      
      const { lat, lng } = e.latlng;
      
      // Verificar que el clic esté dentro de Cochabamba
      // Validación más flexible - permitir clics cerca de Cochabamba
      const margin = 0.1;
      const wayOut = (
        lat < COCHABAMBA_BOUNDS.south - margin ||
        lat > COCHABAMBA_BOUNDS.north + margin ||
        lng < COCHABAMBA_BOUNDS.west - margin ||
        lng > COCHABAMBA_BOUNDS.east + margin
      );
      
      if (wayOut) {
        return; // Solo no hacer nada si está muy fuera
      }
      
      // Mover el marcador a la posición del clic
      if (markerInstance) {
        markerInstance.setLatLng([lat, lng]);
      } else {
        markerInstance = L.marker([lat, lng], {
          draggable: true
        }).addTo(mapInstance);
      }

      // Obtener dirección
      const address = await reverseGeocode(lat, lng);
      if (onLocationChange) {
        onLocationChange(address, lat, lng);
      }
    });
    
    return mapInstance;
  } catch (error) {
    console.error('Error al inicializar mapa:', error);
    return null;
  }
};

/**
 * Actualiza el mapa con una nueva ubicación (desde búsqueda de dirección)
 */
export const updateMapLocation = async (address: string): Promise<boolean> => {
  if (!mapInstance) return false;

  try {
    const result = await geocodeAddress(address);
    if (!result) {
      // No mostrar alerta, solo retornar false silenciosamente
      return false;
    }

    // No verificar límites estrictamente, confiar en la búsqueda

    const latlng: [number, number] = [result.lat, result.lng];
    mapInstance.setView(latlng, 16);

    if (markerInstance) {
      markerInstance.setLatLng(latlng);
    } else {
      markerInstance = L.marker(latlng, {
        draggable: true,
        title: result.displayName
      }).addTo(mapInstance);
      
      // Agregar evento de arrastre
      markerInstance.on('dragend', async () => {
        if (!markerInstance) return;
        const position = markerInstance.getLatLng();
        
        // Validación más flexible - solo si está muy fuera
        if (!isWithinCochabamba(position.lat, position.lng)) {
          const margin = 0.1;
          const wayOut = (
            position.lat < COCHABAMBA_BOUNDS.south - margin ||
            position.lat > COCHABAMBA_BOUNDS.north + margin ||
            position.lng < COCHABAMBA_BOUNDS.west - margin ||
            position.lng > COCHABAMBA_BOUNDS.east + margin
          );
          
          if (wayOut) {
            markerInstance.setLatLng(COCHABAMBA_CENTER);
            return; // No mostrar alerta
          }
        }
        
        const newAddress = await reverseGeocode(position.lat, position.lng);
        if (onLocationChange) {
          onLocationChange(newAddress, position.lat, position.lng);
        }
      });
    }

    // Actualizar dirección en el callback
    if (onLocationChange) {
      onLocationChange(result.displayName, result.lat, result.lng);
    }

    return true;
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    // No mostrar alerta, solo retornar false silenciosamente
    return false;
  }
};

/**
 * Limpia las instancias del mapa
 */
export const cleanup = (): void => {
  if (markerInstance) {
    markerInstance.remove();
    markerInstance = null;
  }
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
};

/**
 * Verifica si el mapa está disponible
 */
export const isMapAvailable = (): boolean => {
  return typeof L !== 'undefined';
};

