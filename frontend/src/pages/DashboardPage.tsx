// src/pages/DashboardPage.tsx

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import LocationSelector from "@/components/dashboard/LocationSelector";
import DateRangeSelector from "@/components/dashboard/DateRangeSelector";
import WeatherVariables from "@/components/dashboard/WeatherVariables";
import ResultsDisplay from "@/components/dashboard/ResultsDisplay";
import TimeSeriesViewer from "@/components/dashboard/TimeSeriesViewer";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Download, Info } from "lucide-react";
import type { Location, WeatherStats } from "@/types/weather";
import { DateRange } from "react-day-picker";
import CombinedAnalysis from "@/components/dashboard/CombinedAnalysis";
import ComparisonTool from "@/components/dashboard/ComparisonTool";
import PerfectDayFinder from "@/components/dashboard/PerfectDayFinder";

const convertJsonToCsv = (data: WeatherStats): string => {
  const flatData = {
    total_years_analyzed: data.total_years_analyzed, prob_hot_percent: data.probabilities.hot,
    prob_cold_percent: data.probabilities.cold, prob_windy_percent: data.probabilities.windy,
    prob_wet_percent: data.probabilities.wet, prob_humid_percent: data.probabilities.humid,
    prob_sunny_percent: data.probabilities.sunny, prob_snowy_percent: data.probabilities.snowy,
    prob_uncomfortable_percent: data.probabilities.uncomfortable, avg_high_f: data.averages.avg_high_f,
    avg_low_f: data.averages.avg_low_f, avg_wind_mph: data.averages.avg_wind_mph,
    avg_humidity_percent: data.averages.avg_humidity_percent, avg_pressure_mb: data.averages.avg_pressure_mb,
    avg_insolation_kwhr: data.averages.avg_insolation_kwhr, avg_heat_index_f: data.averages.avg_heat_index_f,
    record_high_f: data.records.record_high_f, record_low_f: data.records.record_low_f,
    temp_trend_label: data.trend.temp_trend_label,
  };
  const header = Object.keys(flatData).join(',');
  const row = Object.values(flatData).join(',');
  return `${header}\n${row}`;
};

const TimeSeriesTab = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [timeSeriesData, setTimeSeriesData] = useState<WeatherStats['full_time_series'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!location || !dateRange?.from || !dateRange?.to) {
      setError("Please select a location and a date range.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setTimeSeriesData(null);
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
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch data.");
      if (!data.full_time_series) throw new Error("Time series data is missing in the API response.");
      setTimeSeriesData(data.full_time_series);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time Series Explorer</CardTitle>
          <CardDescription>Select a location and date range to analyze raw daily historical data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1.5fr_auto] items-end gap-4">
            <div className="w-full">
              <Label className="mb-2 block">Location</Label>
              <LocationSelector onLocationSelect={setLocation} showMap={false} />
            </div>
            <div className="w-full">
              <Label className="mb-2 block">Date Range</Label>
              <DateRangeSelector value={dateRange} onDateChange={setDateRange} />
            </div>
            <div className="w-full lg:w-auto">
              <Button className="w-full" onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> : 'Analyze Time Series'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (<div className="flex items-center justify-center gap-3 text-red-500 bg-red-100 p-4 rounded-md"><AlertTriangle className="h-5 w-5" /><p className="font-medium">{error}</p></div>)}

      {!isLoading && !error && !timeSeriesData && (
        <div className="flex flex-col items-center justify-center h-96 bg-muted/30 rounded-lg border-2 border-dashed text-center p-4">
          <Info className="h-10 w-10 text-primary mb-4" />
          <h3 className="text-xl font-semibold">Ready for Analysis</h3>
          <p className="text-lg text-muted-foreground">Select inputs and click "Analyze Time Series" to see the full data.</p>
        </div>
      )}
      {timeSeriesData && <TimeSeriesViewer timeSeriesData={timeSeriesData} />}
    </div>
  );
}

const DashboardPage = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [combinedFactors, setCombinedFactors] = useState<string[]>([]);
  const [results, setResults] = useState<WeatherStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("dashboard");

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

  const initialContent = (
    <div className="flex flex-col items-center justify-center h-96 bg-muted/30 rounded-lg border-2 border-dashed text-center p-4">
      <Info className="h-10 w-10 text-primary mb-4" />
      <h3 className="text-xl font-semibold">Ready for Analysis</h3>
      <p className="text-lg text-muted-foreground">Select inputs and click "Analyze Weather Data".</p>
    </div>
  );

  
  const handlePeriodSelect = (selectedRange: DateRange) => {
    setDateRange(selectedRange);
    setActiveTab("dashboard");
  };
 return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Weather Analytics Dashboard</h1>
        <p className="text-muted-foreground">Powered by NASA Earth Observation Data</p>
      </div>
      {/* --- 4. CONTROL THE TABS WITH STATE --- */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* --- 5. ADD THE NEW TAB TRIGGER --- */}
        <TabsList className="grid w-full grid-cols-4 mb-8 max-w-2xl mx-auto">
          <TabsTrigger value="dashboard">Single Analysis</TabsTrigger>
          <TabsTrigger value="finder">Best Time Finder</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="timeseries">Time Series</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {/* ... (Your original "dashboard" content is unchanged) ... */}
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
              {results || isLoading || error ? (
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="probabilities">Probabilities</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                    <TabsTrigger value="distributions">Distributions</TabsTrigger>
                    <TabsTrigger value="timeseries">Time Series</TabsTrigger>
                  </TabsList>
                  <ResultsDisplay results={results} isLoading={isLoading} error={error} />
                </Tabs>
              ) : (initialContent)}
            </div>
          </div>
        </TabsContent>

        {/* --- 6. ADD THE NEW TAB CONTENT --- */}
        <TabsContent value="finder">
          <PerfectDayFinder onPeriodSelect={handlePeriodSelect} />
        </TabsContent>

        {/* Your other tabs are unchanged */}
        <TabsContent value="comparison">
          <ComparisonTool />
        </TabsContent>

        <TabsContent value="timeseries">
          <TimeSeriesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;