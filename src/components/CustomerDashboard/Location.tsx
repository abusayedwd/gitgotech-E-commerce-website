 


import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown, MapPin, Search, Loader2 } from "lucide-react";

// Simple notification system
const showNotification = (type: string, text: string) => {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    max-width: 300px;
    word-wrap: break-word;
  `;

  const colors: any = {
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f'
  };

  notification.style.backgroundColor = colors[type] || colors.success;
  notification.textContent = text;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
};

// Load Leaflet dynamically
const loadLeaflet = () => {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve();
      return;
    }

    // Add CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css';
    document.head.appendChild(link);

    // Add JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js';
    script.onload = () => {
      // Fix marker icons
      delete window.L.Icon.Default.prototype._getIconUrl;
      window.L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// The main map container
const LeafletMap = ({ onMapClick, center, markerPosition }: any) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        await loadLeaflet();

        if (mapRef.current && !mapInstanceRef.current) {
          // Create map
          const map = window.L.map(mapRef.current, {
            center: [center.lat, center.lng],
            zoom: 12,
            zoomControl: true,
          });

          // Add tile layer
          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          // Add click handler
          map.on('click', (e: any) => {
            onMapClick(e.latlng);
          });

          mapInstanceRef.current = map;
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load map:', error);
        showNotification('error', 'Failed to load map');
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center
  useEffect(() => {
    if (mapInstanceRef.current && center && isLoaded) {
      mapInstanceRef.current.flyTo([center.lat, center.lng], 12, {
        animate: true,
        duration: 1.5
      });
    }
  }, [center, isLoaded]);

  // Update marker
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      // Remove existing marker
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }

      // Add new marker if position exists
      if (markerPosition && markerPosition.lat && markerPosition.lng) {
        markerRef.current = window.L.marker([markerPosition.lat, markerPosition.lng])
          .addTo(mapInstanceRef.current);
      }
    }
  }, [markerPosition, isLoaded]);

  return (
    <div className="w-full relative">
      <div
        ref={mapRef}
        className="w-full h-96"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Geocode input form component
const GeocodeForm = ({ onGeocode, onSave }: any) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onGeocode(inputText.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 p-4 shadow-lg rounded-lg">
      <input
        type="text"
        placeholder="Enter a location (e.g., New York, London, Paris)"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="border border-gray-300 p-3 text-black rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
        >
          Search
        </button>
        <button
          type="button"
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors font-medium"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </form>
  );
};

// Display box for address/coordinates
const ResponseBox = ({ address, lat, lng }: any) => (
  <div className="bg-slate-200 bg-opacity-60 border shadow-lg rounded-lg p-4 w-full sm:max-w-md">
    <h3 className="font-semibold text-gray-800 mb-2">Location Details</h3>
    <div className="space-y-2">
      <p className="text-sm text-gray-700">
        <strong>Address:</strong> <span className="break-words">{address}</span>
      </p>
      <p className="text-sm text-gray-700">
        <strong>Latitude:</strong> {lat?.toFixed(6)}
      </p>
      <p className="text-sm text-gray-700">
        <strong>Longitude:</strong> {lng?.toFixed(6)}
      </p>
    </div>
  </div>
);

// ----- MAIN MAP COMPONENT -----

interface SelectedLocation {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface MapComponentProps {
  onLocationSave: (location: SelectedLocation) => void;
}

const MapComponent = ({ onLocationSave }: MapComponentProps) => {
  const defaultCenter = { lat: 40.7128, lng: -74.0060 };
  const defaultAddress = "New York, NY, USA";

  const [center, setCenter] = useState(defaultCenter);
  const [formattedAddress, setFormattedAddress] = useState(defaultAddress);
  const [lat, setLat] = useState(defaultCenter.lat);
  const [lng, setLng] = useState(defaultCenter.lng);
  const [loading, setLoading] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const handleAddAddress = () => {
    if (!formattedAddress || lat === null || lng === null) {
      showNotification("warning", "Please select a location first.");
      return;
    }

    const locationData: SelectedLocation = {
      name: formattedAddress,
      coordinates: {
        latitude: lat,
        longitude: lng,
      },
    };

    console.log("Saving location data:", locationData);
    onLocationSave(locationData);
    showNotification("success", "Location saved successfully!");
  };

  const handleGeocode = async (address: string) => {
    if (!address.trim()) {
      showNotification("warning", "Please enter a location name!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&addressdetails=1&limit=1`
      );

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];

        const newCenter = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        };

        const locationName = result.display_name;

        setCenter(newCenter);
        setLat(newCenter.lat);
        setLng(newCenter.lng);
        setFormattedAddress(locationName);

        showNotification("success", `Found: ${result.name || address}`);
      } else {
        showNotification("warning", "No location found. Try a different search term.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      showNotification("error", "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (latLng: any) => {
    const { lat, lng } = latLng;
    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();

      if (data && data.display_name) {
        setFormattedAddress(data.display_name);
        setLat(lat);
        setLng(lng);
        setCenter({ lat, lng });

        showNotification("success", "Location updated!");
      } else {
        // Still update coordinates even if no address found
        setLat(lat);
        setLng(lng);
        setCenter({ lat, lng });
        setFormattedAddress(`Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        showNotification("warning", "Address not found, but coordinates updated");
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      // Still update coordinates
      setLat(lat);
      setLng(lng);
      setCenter({ lat, lng });
      setFormattedAddress(`Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      showNotification("error", "Could not get address, but coordinates updated");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[10001]">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-sm text-gray-600">Processing...</p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsMapExpanded(!isMapExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <span>Select Delivery Location</span>
        </div>
        {isMapExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Map Container - Show/Hide based on toggle */}
      {isMapExpanded && (
        <div className="space-y-4 p-4 bg-white">
          {/* Search form */}
          <div className="w-full">
            <GeocodeForm onGeocode={handleGeocode} onSave={handleAddAddress} />
          </div>

          {/* Map container */}
          <LeafletMap
            onMapClick={handleMapClick}
            center={center}
            markerPosition={{ lat, lng }}
          />

          {/* Location details */}
          <div className="flex items-start gap-4 flex-wrap">
            <ResponseBox address={formattedAddress} lat={lat} lng={lng} />
            
            <button
              type="button"
              onClick={handleAddAddress}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              Confirm Location
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;