// src/pages/TimeSeriesPage.tsx

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LocationSelector from "@/components/dashboard/LocationSelector";
import DateRangeSelector from "@/components/dashboard/DateRangeSelector";
import TimeSeriesViewer from "@/components/dashboard/TimeSeriesViewer";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Info } from "lucide-react";
import type { Location, WeatherStats } from "@/types/weather";
import { DateRange } from "react-day-picker";

const TimeSeriesPage = () => {
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
            setTimeSeriesData(data.full_time_series);
        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Daily Time Series Explorer</h1>
                <p className="text-muted-foreground">Analyze raw historical daily data for any location and date range.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader><CardTitle>1. Location</CardTitle></CardHeader>
                    <CardContent><LocationSelector onLocationSelect={setLocation} /></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>2. Date Range</CardTitle></CardHeader>
                    <CardContent><DateRangeSelector value={dateRange} onDateChange={setDateRange} /></CardContent>
                </Card>
                <div className="lg:col-span-1 flex items-center justify-center">
                    <Button className="w-full py-6 text-lg" onClick={handleAnalyze} disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" />Analyzing...</> : "Analyze Time Series"}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="flex items-center justify-center gap-3 text-red-500 bg-red-100 p-4 rounded-md mb-8">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {!isLoading && !error && !timeSeriesData && (
                <div className="flex flex-col items-center justify-center h-96 bg-muted/30 rounded-lg border-2 border-dashed text-center p-4">
                    <Info className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-xl font-semibold">Ready for Analysis</h3>
                    <p className="text-lg text-muted-foreground">Select a location and date range, then click "Analyze" to see the full time series.</p>
                </div>
            )}

            {timeSeriesData && <TimeSeriesViewer timeSeriesData={timeSeriesData} />}
        </div>
    );
};

export default TimeSeriesPage;