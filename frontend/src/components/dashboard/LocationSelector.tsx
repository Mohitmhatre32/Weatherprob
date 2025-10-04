// src/components/dashboard/LocationSelector.tsx

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Location } from "@/types/weather";

// A hook to prevent API calls on every keystroke
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

interface LocationSelectorProps {
  onLocationSelect: (location: Location | null) => void;
}

const LocationSelector = ({ onLocationSelect }: LocationSelectorProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 500); // 500ms delay

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
    // Automatically fetch suggestions as user types
    fetchSuggestions(debouncedQuery);
  }, [debouncedQuery, fetchSuggestions]);

  const handleSelectSuggestion = (suggestion: any) => {
    const location: Location = {
      name: suggestion.display_name,
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
    };
    onLocationSelect(location);
    setQuery(location.name); // Update input text to full name
    setSuggestions([]); // Hide dropdown
    setStatusMessage(`Selected: ${location.name}`);
  };

  const handleSearch = async () => {
    if (!query) return;

    setIsLoading(true);
    setSuggestions([]); // Hide any existing suggestions
    const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    try {
      const response = await fetch(endpoint, { headers: { 'User-Agent': 'WeatherAnalyticsDashboard/1.0' } });
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Automatically select the first result
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

  return (
    <div className="space-y-3">
      {/* The layout and components are identical to your original code */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., New York"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // When user starts typing again, clear the old status message
              if (statusMessage) setStatusMessage(null); 
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? '...' : 'Search'}
          </Button>
        </div>

        {/* --- DYNAMIC LOGIC INTEGRATION --- */}
        {/* Suggestions dropdown appears here without disrupting the layout */}
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 border rounded-md bg-white shadow-lg">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.place_id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <p className="text-sm">{suggestion.display_name}</p>
              </div>
            ))}
          </div>
        )}
        {/* --- END INTEGRATION --- */}
      </div>

      {/* This status message works just like your original 'selectedLocationName' */}
    
    </div>
  );
};

export default LocationSelector;