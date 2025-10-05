// src/components/dashboard/LocationSelector.tsx

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Location } from "@/types/weather";

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { LatLngExpression, Icon } from "leaflet";

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const ChangeView = ({ center, zoom }: { center: LatLngExpression; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface LocationSelectorProps {
  onLocationSelect: (location: Location | null) => void;
}

const LocationSelector = ({ onLocationSelect }: LocationSelectorProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const debouncedQuery = useDebounce(query, 500);

  const reverseGeocode = useCallback(async (lat: number, lon: number) => {
    const endpoint = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    try {
      const response = await fetch(endpoint, { headers: { 'User-Agent': 'WeatherAnalyticsDashboard/1.0' } });
      const data = await response.json();
      return data.display_name || `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
    }
  }, []);

  const handleLocationUpdate = useCallback(async (lat: number, lon: number, name?: string) => {
    setIsLoading(true);
    const displayName = name || await reverseGeocode(lat, lon);
    const location: Location = { name: displayName, lat, lon };
    onLocationSelect(location);
    setQuery(displayName);
    setSuggestions([]);
    setStatusMessage(`Selected: ${displayName}`);
    setMarkerPosition([lat, lon]);
    setIsLoading(false);
  }, [onLocationSelect, reverseGeocode]);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`;
    try {
      const response = await fetch(endpoint, { headers: { 'User-Agent': 'WeatherAnalyticsDashboard/1.0' } });
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

  const handleSelectSuggestion = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat);
    const lon = parseFloat(suggestion.lon);
    handleLocationUpdate(lat, lon, suggestion.display_name);
  };

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    setSuggestions([]);
    const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    try {
      const response = await fetch(endpoint, { headers: { 'User-Agent': 'WeatherAnalyticsDashboard/1.0' } });
      const data = await response.json();
      if (data && data.length > 0) {
        handleSelectSuggestion(data[0]);
      } else {
        onLocationSelect(null);
        setStatusMessage(`No results found for "${query}"`);
      }
    } catch (error) {
      onLocationSelect(null);
      setStatusMessage("Error fetching location.");
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapCenter: LatLngExpression = useMemo(() => markerPosition || [20, 0], [markerPosition]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g., New York, or click map"
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (statusMessage) setStatusMessage(null); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>{isLoading ? '...' : 'Search'}</Button>
          </div>
          {suggestions.length > 0 && (
            <div className="absolute z-[1000] w-full mt-1 border rounded-md bg-background shadow-lg">
              {suggestions.map((suggestion) => (
                <div key={suggestion.place_id} className="p-2 cursor-pointer hover:bg-muted" onClick={() => handleSelectSuggestion(suggestion)}>
                  <p className="text-sm">{suggestion.display_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="h-64 w-full rounded-md overflow-hidden border z-0">
        <MapContainer center={mapCenter} zoom={markerPosition ? 10 : 2} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={mapCenter} zoom={markerPosition ? 10 : 2} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={(lat, lon) => handleLocationUpdate(lat, lon)} />
          {markerPosition && <Marker position={markerPosition} icon={markerIcon} />}
        </MapContainer>
      </div>
      {statusMessage && (
        <p className="text-sm text-muted-foreground pt-2">{statusMessage}</p>
      )}
    </div>
  );
};

export default LocationSelector;