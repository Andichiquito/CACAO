/**
 * Utilidades para Google Maps en JavaScript puro - Versión Simple
 */

let mapInstance = null;
let autocompleteInstance = null;
let markerInstance = null;

/**
 * Inicializa el mapa de Google Maps - Versión simple
 */
export const initializeMap = (mapContainer) => {
  if (!mapContainer) {
    return null;
  }

  if (!window.google || !window.google.maps || !window.google.maps.Map) {
    return null;
  }

  // Si ya existe una instancia, no crear otra
  if (mapInstance) {
    return mapInstance;
  }

  try {
    mapInstance = new window.google.maps.Map(mapContainer, {
      center: { lat: -16.5000, lng: -68.1500 },
      zoom: 13
    });
    
    return mapInstance;
  } catch (error) {
    console.error('Error al inicializar mapa:', error);
    return null;
  }
};

/**
 * Inicializa el autocomplete de direcciones - Versión simple
 */
export const initializeAutocomplete = (inputElement, onPlaceChanged) => {
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    return null;
  }

  try {
    autocompleteInstance = new window.google.maps.places.Autocomplete(inputElement, {
      types: ['address'],
      componentRestrictions: { country: 'bo' }
    });

    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();
      if (place && place.formatted_address && place.geometry && place.geometry.location) {
        if (onPlaceChanged) {
          onPlaceChanged(place);
        }
      }
    });

    return autocompleteInstance;
  } catch (error) {
    console.error('Error en autocomplete:', error);
    return null;
  }
};

/**
 * Actualiza el mapa con una nueva ubicación - Versión simple
 */
export const updateMapLocation = (location, title = '') => {
  if (!mapInstance) return;

  try {
    mapInstance.setCenter(location);
    mapInstance.setZoom(16);

    if (markerInstance) {
      markerInstance.setMap(null);
    }

    if (window.google && window.google.maps && window.google.maps.Marker) {
      markerInstance = new window.google.maps.Marker({
        position: location,
        map: mapInstance,
        title: title
      });
    }
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
  }
};

/**
 * Carga el script de Google Maps - Versión simple
 */
export const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      setTimeout(() => clearInterval(checkInterval), 10000);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setTimeout(() => {
        if (window.google && window.google.maps) {
          resolve();
        } else {
          reject(new Error('Google Maps no se cargó'));
        }
      }, 500);
    };

    script.onerror = reject;
    document.head.appendChild(script);
  });
};

/**
 * Limpia las instancias de Google Maps
 */
export const cleanup = () => {
  if (markerInstance) {
    markerInstance.setMap(null);
    markerInstance = null;
  }
  if (autocompleteInstance) {
    autocompleteInstance = null;
  }
  // No limpiamos mapInstance porque puede ser reutilizado
};

/**
 * Verifica si Google Maps está disponible
 * @returns {boolean}
 */
export const isGoogleMapsAvailable = () => {
  return !!(window.google && window.google.maps && window.google.maps.Map);
};

