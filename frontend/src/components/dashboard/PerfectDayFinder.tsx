import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, PartyPopper } from 'lucide-react';
import type { Location } from '@/types/weather';
import { DateRange } from 'react-day-picker';
import LocationSelector from '@/components/dashboard/LocationSelector';
import Loader from '@/hooks/loader'; 
interface PerfectDayResult {
  period: string;
  score: number;
  start_day: number;
  end_day: number;
}

interface PerfectDayFinderProps {
  onPeriodSelect: (range: DateRange) => void;
}

const criteriaOptions = [
  { id: 'sunny', label: 'Sunny' },
  { id: 'not_hot', label: 'Not Too Hot' },
  { id: 'not_cold', label: 'Not Too Cold' },
  { id: 'not_windy', label: 'Not Windy' },
  { id: 'not_humid', label: 'Not Humid' },
  { id: 'no_rain', label: 'No Rain' },
  { id: 'no_snow', label: 'No Snow' },
];

const PerfectDayFinder = ({ onPeriodSelect }: PerfectDayFinderProps) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>(['sunny', 'not_hot', 'no_rain']);
  const [results, setResults] = useState<PerfectDayResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedCriteria(prev => 
      checked ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  const handleFind = async () => {
    if (!location || selectedCriteria.length === 0) {
      setError("Please select a location and at least one criterion.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/find-perfect-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: location.lat,
          lon: location.lon,
          criteria: selectedCriteria,
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Failed to find results.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResultClick = (result: PerfectDayResult) => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0); // Start of the year
    const endDate = new Date(year, 0);
    // Correctly calculate date from day of year
    startDate.setDate(startDate.getDate() + result.start_day - 1);
    endDate.setDate(endDate.getDate() + result.end_day - 1);
    
    onPeriodSelect({ from: startDate, to: endDate });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Select Location</CardTitle>
            <CardDescription>Choose a point of interest for your analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <LocationSelector onLocationSelect={setLocation} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>2. Define Your "Perfect Day"</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {criteriaOptions.map(item => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`finder-${item.id}`} 
                  checked={selectedCriteria.includes(item.id)}
                  onCheckedChange={(checked) => handleCheckboxChange(item.id, !!checked)}
                />
                <Label htmlFor={`finder-${item.id}`} className="cursor-pointer">{item.label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>
        <Button className="w-full py-6 text-lg shadow-lg" onClick={handleFind} disabled={isLoading || !location}>
          {isLoading ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" />Analyzing Entire Year...</> : "Find Best Time"}
        </Button>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Recommendations</CardTitle>
            <CardDescription>The best times of year matching your criteria, ranked by probability.</CardDescription>
          </CardHeader>
          {/* --- 2. THE MODIFIED CARD CONTENT --- */}
          <CardContent className="min-h-[300px] flex items-center justify-center">
            {isLoading ? (
              <Loader />
            ) : error ? (
              <p className="text-destructive font-semibold p-4 bg-destructive/10 rounded-md">{error}</p>
            ) : results.length > 0 ? (
              <div className="w-full">
                <ul className="space-y-3">
                  {results.map(result => (
                    <li key={result.period} onClick={() => handleResultClick(result)} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors">
                      <span className="font-semibold text-lg">{result.period}</span>
                      <span className="text-xl font-bold text-primary">{result.score}% Match</span>
                    </li>
                  ))}
                </ul>
                {/* <p className="text-sm text-muted-foreground pt-4 mt-4 border-t">Click on a result to automatically set the date range and view the detailed analysis in the "Single Analysis" tab.</p> */}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-10">Your results will appear here after analysis.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerfectDayFinder;