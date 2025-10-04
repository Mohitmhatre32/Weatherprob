// src/components/dashboard/WeatherVariables.tsx

import { Badge } from "@/components/ui/badge";

const WeatherVariables = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">Temperature</Badge>
      <Badge variant="secondary">Precipitation</Badge>
      <Badge variant="secondary">Wind Speed</Badge>
    </div>
  );
};

export default WeatherVariables;