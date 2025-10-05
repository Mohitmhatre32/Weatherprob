import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sun, Thermometer, Wind, CloudRain, Droplets, Snowflake, ShieldAlert, BarChartHorizontal } from "lucide-react";

const variables = [
  {
    name: "Temperature",
    icon: <Thermometer className="h-4 w-4" />,
    classes: "border-red-500/40 text-red-700 bg-red-500/10 hover:bg-red-500/20",
  },
  {
    name: "Sunlight",
    icon: <Sun className="h-4 w-4" />,
    classes: "border-yellow-500/40 text-yellow-700 bg-yellow-500/10 hover:bg-yellow-500/20",
  },
  {
    name: "Humidity",
    icon: <Droplets className="h-4 w-4" />,
    classes: "border-teal-500/40 text-teal-700 bg-teal-500/10 hover:bg-teal-500/20",
  },
  {
    name: "Precipitation",
    icon: <CloudRain className="h-4 w-4" />,
    classes: "border-cyan-500/40 text-cyan-700 bg-cyan-500/10 hover:bg-cyan-500/20",
  },
  {
    name: "Snowfall",
    icon: <Snowflake className="h-4 w-4" />,
    classes: "border-sky-500/40 text-sky-700 bg-sky-500/10 hover:bg-sky-500/20",
  },
  {
    name: "Wind Speed",
    icon: <Wind className="h-4 w-4" />,
    classes: "border-slate-500/40 text-slate-700 bg-slate-500/10 hover:bg-slate-500/20",
  },
  {
    name: "Heat Index",
    icon: <ShieldAlert className="h-4 w-4" />,
    classes: "border-purple-500/40 text-purple-700 bg-purple-500/10 hover:bg-purple-500/20",
  },
  {
    name: "Pressure",
    icon: <BarChartHorizontal className="h-4 w-4" />,
    classes: "border-gray-500/40 text-gray-700 bg-gray-500/10 hover:bg-gray-500/20",
  },
];

const WeatherVariables = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {variables.map((variable) => (
        <Badge 
          key={variable.name} 
          variant="outline"
          // The `cn` utility safely merges our base classes with the color classes
          className={cn(
            "text-sm font-medium px-3 py-1 flex items-center gap-2 transition-colors",
            variable.classes
          )}
        >
          {variable.icon}
          {variable.name}
        </Badge>
      ))}
    </div>
  );
};

export default WeatherVariables;