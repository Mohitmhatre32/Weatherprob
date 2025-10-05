
import { useState, useEffect } from "react"; 
import { format } from "date-fns";
import type { Location, WeatherStats } from "@/types/weather";
import { DateRange } from "react-day-picker";
import LocationSelector from "./LocationSelector";
import DateRangeSelector from "./DateRangeSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";
import ComparisonResultsDisplay from "./ComparisonResultsDisplay";

const ComparisonTool = () => {
    const [locationA, setLocationA] = useState<Location | null>(null);
    const [dateRangeA, setDateRangeA] = useState<DateRange | undefined>(undefined);
    const [resultsA, setResultsA] = useState<WeatherStats | null>(null);
    const [locationB, setLocationB] = useState<Location | null>(null);
    const [dateRangeB, setDateRangeB] = useState<DateRange | undefined>(undefined);
    const [resultsB, setResultsB] = useState<WeatherStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cachedData = localStorage.getItem('comparisonToolCache');
        if (cachedData) {
            try {
                const parsed = JSON.parse(cachedData);
                if (parsed.inputs.dateRangeA?.from) parsed.inputs.dateRangeA.from = new Date(parsed.inputs.dateRangeA.from);
                if (parsed.inputs.dateRangeA?.to) parsed.inputs.dateRangeA.to = new Date(parsed.inputs.dateRangeA.to);
                if (parsed.inputs.dateRangeB?.from) parsed.inputs.dateRangeB.from = new Date(parsed.inputs.dateRangeB.from);
                if (parsed.inputs.dateRangeB?.to) parsed.inputs.dateRangeB.to = new Date(parsed.inputs.dateRangeB.to);
                setLocationA(parsed.inputs.locationA);
                setDateRangeA(parsed.inputs.dateRangeA);
                setResultsA(parsed.results.resultsA);
                setLocationB(parsed.inputs.locationB);
                setDateRangeB(parsed.inputs.dateRangeB);
                setResultsB(parsed.results.resultsB);
            } catch (e) {
                localStorage.removeItem('comparisonToolCache');
            }
        }
    }, []);

    const handleCompare = async () => {
        if (!locationA || !dateRangeA?.from || !dateRangeA?.to || !locationB || !dateRangeB?.from || !dateRangeB?.to) {
            setError("Please select a location and a full date range for both scenarios.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultsA(null);
        setResultsB(null);
        const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
        const fetchScenario = (location: Location, dateRange: DateRange) => {
            return fetch('http://127.0.0.1:5000/api/weather-stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lat: location.lat,
                    lon: location.lon,
                    start_date: formatDate(dateRange.from!),
                    end_date: formatDate(dateRange.to!),
                }),
            }).then(res => res.ok ? res.json() : Promise.reject(`Scenario fetch failed: ${res.statusText}`));
        };
        try {
            const [resA, resB] = await Promise.all([
                fetchScenario(locationA, dateRangeA),
                fetchScenario(locationB, dateRangeB),
            ]);
            setResultsA(resA);
            setResultsB(resB);
            const cachePayload = {
                inputs: { locationA, dateRangeA, locationB, dateRangeB },
                results: { resultsA: resA, resultsB: resB }
            };
            localStorage.setItem('comparisonToolCache', JSON.stringify(cachePayload));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "An unknown error occurred during comparison.");
            localStorage.removeItem('comparisonToolCache');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Scenario A</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <LocationSelector onLocationSelect={setLocationA} />
                        <DateRangeSelector value={dateRangeA} onDateChange={setDateRangeA} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Scenario B</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <LocationSelector onLocationSelect={setLocationB} />
                        <DateRangeSelector value={dateRangeB} onDateChange={setDateRangeB} />
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-center">
                <Button size="lg" onClick={handleCompare} disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" />Comparing...</> : "Compare Scenarios"}
                </Button>
            </div>
            {error && (<div className="flex items-center justify-center gap-3 text-red-600 bg-red-100 p-3 rounded-md"><AlertTriangle className="h-5 w-5" /><p className="text-sm font-medium">{error}</p></div>)}
            {resultsA && resultsB && <ComparisonResultsDisplay resultsA={resultsA} resultsB={resultsB} />}
        </div>
    );
};

export default ComparisonTool;