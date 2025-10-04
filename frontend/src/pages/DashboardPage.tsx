// src/pages/DashboardPage.tsx

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LocationSelector from "@/components/dashboard/LocationSelector";
import DateSelector from "@/components/dashboard/DateSelector";
import WeatherVariables from "@/components/dashboard/WeatherVariables";
import ResultsDisplay from "@/components/dashboard/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
// The 'WeatherTheme' import has been removed, and the 'Location' and 'WeatherStats' types are now used.
import type { Location, WeatherStats } from "@/types/weather";

const DashboardPage = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [date, setDate] = useState<Date | null>(null);

  const [results, setResults] = useState<WeatherStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // The handleAnalyze function remains the same
  const handleAnalyze = async () => {
    if (!location || !date) {
      setValidationError("Please select a location and a date before analyzing.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setValidationError(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/weather-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: location.lat,
          lon: location.lon,
          month: date.getMonth() + 1, // JS months are 0-indexed
          day: date.getDate(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! Status: ${response.status}`);
      }

      setResults(data);

    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to fetch weather data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // The 'weatherTheme' state is no longer used for the background class
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Weather Analytics Dashboard</h1>
          <p className="text-muted-foreground">Powered by NASA Earth Observation Data</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>1. Location</CardTitle>
                <CardDescription>Enter a location to analyze</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Note: Updated LocationSelector to pass the correct prop */}
                <LocationSelector onLocationSelect={setLocation} />
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>2. Date</CardTitle>
                <CardDescription>Choose a specific day of the year</CardDescription>
              </CardHeader>
              <CardContent>
                <DateSelector value={date} onDateChange={setDate} />
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Weather Variables</CardTitle>
                <CardDescription>Analysis includes the following variables</CardDescription>
              </CardHeader>
              <CardContent>
                {/* WeatherVariables component no longer needs props */}
                <WeatherVariables />
              </CardContent>
            </Card>

            <Button
              className="w-full py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              {isLoading ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" />Analyzing...</> : "Analyze Weather Data"}
            </Button>

            {validationError && (
              <div className="flex items-center gap-3 text-yellow-700 bg-yellow-100 p-3 rounded-md">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm font-medium">{validationError}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="probabilities">Probabilities</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>
              {/* ResultsDisplay no longer needs the 'theme' prop */}
              <ResultsDisplay results={results} isLoading={isLoading} error={error} />
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;