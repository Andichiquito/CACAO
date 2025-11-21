declare namespace google {
  namespace maps {
    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface MapOptions {
      center?: LatLng | { lat: number; lng: number };
      zoom?: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      setCenter(location: LatLng | { lat: number; lng: number }): void;
      setZoom(zoom: number): void;
    }

    interface MarkerOptions {
      position: LatLng | { lat: number; lng: number };
      map: Map | null;
      title?: string;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
    }

    namespace places {
      interface AutocompleteOptions {
        types?: string[];
        componentRestrictions?: { country: string | string[] };
      }
      
      interface PlaceResult {
        formatted_address?: string;
        address_components?: any[];
        geometry?: {
          location?: LatLng;
        };
        name?: string;
      }
      
      class Autocomplete {
        constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
        getPlace(): PlaceResult;
        addListener(event: string, handler: () => void): void;
      }
    }
  }
}

declare global {
  interface Window {
    google?: {
      maps?: {
        Map: new (mapDiv: HTMLElement, opts?: google.maps.MapOptions) => google.maps.Map;
        Marker: new (opts?: google.maps.MarkerOptions) => google.maps.Marker;
        places?: {
          Autocomplete: new (inputField: HTMLInputElement, opts?: google.maps.places.AutocompleteOptions) => google.maps.places.Autocomplete;
        };
      };
    };
  }
}

export {};

