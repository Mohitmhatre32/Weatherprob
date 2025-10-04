import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocationSelector from "@/components/dashboard/LocationSelector";
import DateSelector from "@/components/dashboard/DateSelector";
import WeatherVariables from "@/components/dashboard/WeatherVariables";
import ResultsDisplay from "@/components/dashboard/ResultsDisplay";
import { Button } from "@/components/ui/button";
import type { WeatherTheme } from "@/types/weather";

const DashboardPage = () => {
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [weatherTheme, setWeatherTheme] = useState<WeatherTheme>("neutral");

  return (
    <div className={`min-h-screen bg-background transition-all duration-500 theme-${weatherTheme}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Weather Analytics Dashboard</h1>
          <p className="text-muted-foreground">Powered by NASA Earth Observation Data</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Select a location on the map or search</CardDescription>
              </CardHeader>
              <CardContent>
                <LocationSelector 
                  value={location} 
                  onChange={setLocation} 
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Date Range</CardTitle>
                <CardDescription>Choose your analysis period</CardDescription>
              </CardHeader>
              <CardContent>
                <DateSelector 
                  value={dateRange} 
                  onChange={setDateRange} 
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Weather Variables</CardTitle>
                <CardDescription>Select variables to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                <WeatherVariables 
                  selected={selectedVariables}
                  onChange={setSelectedVariables}
                  onThemeChange={setWeatherTheme}
                />
              </CardContent>
            </Card>

            <Button 
              className="w-full py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              Analyze Weather Data
            </Button>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="probabilities">Probabilities</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="comparison">Compare</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <ResultsDisplay 
                  type="overview" 
                  theme={weatherTheme}
                />
              </TabsContent>

              <TabsContent value="probabilities">
                <ResultsDisplay 
                  type="probabilities" 
                  theme={weatherTheme}
                />
              </TabsContent>

              <TabsContent value="trends">
                <ResultsDisplay 
                  type="trends" 
                  theme={weatherTheme}
                />
              </TabsContent>

              <TabsContent value="comparison">
                <ResultsDisplay 
                  type="comparison" 
                  theme={weatherTheme}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
