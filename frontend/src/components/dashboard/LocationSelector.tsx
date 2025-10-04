// src/components/dashboard/LocationSelector.tsx

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Location } from "@/types/weather";

interface LocationSelectorProps {
  onLocationSelect: (location: Location | null) => void;
}

// MOCK: In a real app, this would call a geocoding service like the Google Places API.
const geocodeLocation = async (query: string): Promise<Location | null> => {
  console.log(`Geocoding for: ${query}`);
  // This is mock data. You can replace this with a real API call.
  if (query.toLowerCase().includes("new york")) {
    return { name: "New York, USA", lat: 40.7128, lon: -74.0060 };
  }
  if (query.toLowerCase().includes("london")) {
    return { name: "London, UK", lat: 51.5072, lon: -0.1276 };
  }
  if (query.toLowerCase().includes("tokyo")) {
    return { name: "Tokyo, Japan", lat: 35.6895, lon: 139.6917 };
  }
  return null;
};

const LocationSelector = ({ onLocationSelect }: LocationSelectorProps) => {
  const [query, setQuery] = useState("");
  const [selectedLocationName, setSelectedLocationName] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    const result = await geocodeLocation(query);
    onLocationSelect(result);
    setSelectedLocationName(result ? result.name : `No results found for "${query}"`);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="e.g., New York"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {selectedLocationName && <p className="text-sm text-muted-foreground mt-2">Selected: {selectedLocationName}</p>}
    </div>
  );
};

export default LocationSelector;