// src/pages/DashboardPage.tsx

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LocationSelector from "@/components/dashboard/LocationSelector";
import DateRangeSelector from "@/components/dashboard/DateRangeSelector";
import WeatherVariables from "@/components/dashboard/WeatherVariables";
import ResultsDisplay from "@/components/dashboard/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Download } from "lucide-react";
import type { Location, WeatherStats } from "@/types/weather";
import { DateRange } from "react-day-picker";
import CombinedAnalysis from "@/components/dashboard/CombinedAnalysis";
import ComparisonTool from "@/components/dashboard/ComparisonTool";
import HeatmapExplorer from "@/components/dashboard/HeatmapExplorer";

const convertJsonToCsv = (data: WeatherStats): string => {
  const flatData = {
    total_years_analyzed: data.total_years_analyzed,
    prob_hot_percent: data.probabilities.hot,
    prob_cold_percent: data.probabilities.cold,
    prob_windy_percent: data.probabilities.windy,
    prob_wet_percent: data.probabilities.wet,
    prob_humid_percent: data.probabilities.humid,
    prob_sunny_percent: data.probabilities.sunny,
    prob_snowy_percent: data.probabilities.snowy,
    prob_uncomfortable_percent: data.probabilities.uncomfortable,
    avg_high_f: data.averages.avg_high_f,
    avg_low_f: data.averages.avg_low_f,
    avg_wind_mph: data.averages.avg_wind_mph,
    avg_humidity_percent: data.averages.avg_humidity_percent,
    avg_pressure_mb: data.averages.avg_pressure_mb,
    avg_insolation_kwhr: data.averages.avg_insolation_kwhr,
    avg_heat_index_f: data.averages.avg_heat_index_f,
    record_high_f: data.records.record_high_f,
    record_low_f: data.records.record_low_f,
    temp_trend_label: data.trend.temp_trend_label,
  };
  const header = Object.keys(flatData).join(',');
  const row = Object.values(flatData).join(',');
  return `${header}\n${row}`;
};

const DashboardPage = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [combinedFactors, setCombinedFactors] = useState<string[]>([]);
  const [results, setResults] = useState<WeatherStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!location || !dateRange || !dateRange.from || !dateRange.to) {
      setValidationError("Please select a location and a complete date range before analyzing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);
    setValidationError(null);
    const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
    try {
      const response = await fetch('http://127.0.0.1:5000/api/weather-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: location.lat,
          lon: location.lon,
          start_date: formatDate(dateRange.from),
          end_date: formatDate(dateRange.to),
          combined_factors: combinedFactors,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP error! Status: ${response.status}`);
      setResults(data);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to fetch weather data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadJson = () => {
    if (!results || !location || !dateRange || !dateRange.from) return;
    const dateString = format(dateRange.from, "yyyy-MM-dd");
    const locationString = location.name.split(',')[0].replace(/ /g, '_');
    const fileName = `weather_data_${locationString}_${dateString}.json`;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(results, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = fileName;
    link.click();
  };

  const handleDownloadCsv = () => {
    if (!results || !location || !dateRange || !dateRange.from) return;
    const dateString = format(dateRange.from, "yyyy-MM-dd");
    const locationString = location.name.split(',')[0].replace(/ /g, '_');
    const fileName = `weather_summary_${locationString}_${dateString}.csv`;
    const csvContent = convertJsonToCsv(results);
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Weather Analytics Dashboard</h1>
          <p className="text-muted-foreground">Powered by NASA Earth Observation Data</p>
        </div>
      </div>

      {/* --- THIS IS THE FIX --- */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 max-w-2xl mx-auto">
            <TabsTrigger value="dashboard">Single Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison Analysis</TabsTrigger>
            <TabsTrigger value="explorer">Explorer</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-lg"><CardHeader><CardTitle>1. Location</CardTitle><CardDescription>Enter a location or click the map</CardDescription></CardHeader><CardContent><LocationSelector onLocationSelect={setLocation} /></CardContent></Card>
                <Card className="shadow-lg"><CardHeader><CardTitle>2. Date Range</CardTitle><CardDescription>Choose a start and end date</CardDescription></CardHeader><CardContent><DateRangeSelector value={dateRange} onDateChange={setDateRange} /></CardContent></Card>
                <Card className="shadow-lg"><CardHeader><CardTitle>3. Combined Analysis (Optional)</CardTitle><CardDescription>Select 2+ conditions</CardDescription></CardHeader><CardContent><CombinedAnalysis selectedFactors={combinedFactors} onSelectionChange={setCombinedFactors} /></CardContent></Card>
                <Card className="shadow-lg"><CardHeader><CardTitle>Weather Variables</CardTitle><CardDescription>Analysis includes these variables</CardDescription></CardHeader><CardContent><WeatherVariables /></CardContent></Card>
                <div className="space-y-3">
                  <Button className="w-full py-6 text-lg shadow-lg" size="lg" onClick={handleAnalyze} disabled={isLoading}>{isLoading ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" />Analyzing...</> : "Analyze Weather Data"}</Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="w-full py-3" variant="outline" onClick={handleDownloadJson} disabled={!results || isLoading}><Download className="mr-2 h-4 w-4" />JSON</Button>
                    <Button className="w-full py-3" variant="outline" onClick={handleDownloadCsv} disabled={!results || isLoading}><Download className="mr-2 h-4 w-4" />CSV</Button>
                  </div>
                </div>
                {validationError && (<div className="flex items-center gap-3 text-yellow-700 bg-yellow-100 p-3 rounded-md"><AlertTriangle className="h-5 w-5" /><p className="text-sm font-medium">{validationError}</p></div>)}
              </div>
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="probabilities">Probabilities</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="distributions">Distributions</TabsTrigger>
                  </TabsList>
                  <ResultsDisplay results={results} isLoading={isLoading} error={error} />
                </Tabs>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <ComparisonTool />
          </TabsContent>

          <TabsContent value="explorer">
            <HeatmapExplorer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;