import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Thermometer, CloudRain, Wind, Droplets, Snowflake, Sun } from "lucide-react";
import type { WeatherTheme } from "@/types/weather";

interface WeatherVariablesProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  onThemeChange: (theme: WeatherTheme) => void;
}

const variables = [
  { id: "temperature", label: "Temperature", icon: Thermometer, theme: "hot" as WeatherTheme },
  { id: "precipitation", label: "Precipitation", icon: CloudRain, theme: "rainy" as WeatherTheme },
  { id: "windspeed", label: "Wind Speed", icon: Wind, theme: "windy" as WeatherTheme },
  { id: "humidity", label: "Humidity", icon: Droplets, theme: "rainy" as WeatherTheme },
  { id: "snowfall", label: "Snowfall", icon: Snowflake, theme: "cold" as WeatherTheme },
  { id: "solar", label: "Solar Radiation", icon: Sun, theme: "hot" as WeatherTheme },
];

const WeatherVariables = ({ selected, onChange, onThemeChange }: WeatherVariablesProps) => {
  const handleToggle = (id: string, theme: WeatherTheme) => {
    const newSelected = selected.includes(id)
      ? selected.filter(item => item !== id)
      : [...selected, id];
    
    onChange(newSelected);
    
    // Update theme based on primary selection
    if (newSelected.length > 0) {
      const primaryVar = variables.find(v => v.id === newSelected[0]);
      if (primaryVar) {
        onThemeChange(primaryVar.theme);
      }
    } else {
      onThemeChange("neutral");
    }
  };

  return (
    <div className="space-y-3">
      {variables.map((variable) => {
        const Icon = variable.icon;
        const isChecked = selected.includes(variable.id);
        
        return (
          <div
            key={variable.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
              isChecked ? "bg-primary/5 border-primary/50" : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              id={variable.id}
              checked={isChecked}
              onCheckedChange={() => handleToggle(variable.id, variable.theme)}
            />
            <Label
              htmlFor={variable.id}
              className="flex items-center gap-2 cursor-pointer flex-1"
            >
              <Icon className={`w-4 h-4 ${isChecked ? "text-primary" : "text-muted-foreground"}`} />
              <span className={isChecked ? "font-medium" : ""}>{variable.label}</span>
            </Label>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherVariables;
