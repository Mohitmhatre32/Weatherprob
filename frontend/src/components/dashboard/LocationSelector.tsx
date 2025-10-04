import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search location..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Interactive Map Placeholder */}
      <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border flex items-center justify-center relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        <div className="text-center z-10 space-y-2">
          <MapPin className="w-12 h-12 mx-auto text-primary animate-pulse-soft" />
          <p className="text-sm font-medium text-muted-foreground">Click to select location</p>
          <p className="text-xs text-muted-foreground">Interactive map coming soon</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <MapPin className="w-4 h-4 mr-2" />
          Use My Location
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          Draw Area
        </Button>
      </div>
    </div>
  );
};

export default LocationSelector;
