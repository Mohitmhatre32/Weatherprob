// src/components/dashboard/ResultsDisplay.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import type { WeatherStats } from "@/types/weather";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sun, Thermometer, Wind, CloudRain, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";

interface ResultsDisplayProps {
  results: WeatherStats | null;
  isLoading: boolean;
  error: string | null;
}

const ResultsDisplay = ({ results, isLoading, error }: ResultsDisplayProps) => {

  const chartData = results ? results.chart_data.years.map((year, index) => ({
    year,
    "High Temp (°F)": results.chart_data.high_temps[index]
  })) : [];

  const trendIcon = results ?
    results.trend.temp_trend_label === 'warming' ? <TrendingUp className="h-5 w-5 text-red-500" /> :
      results.trend.temp_trend_label === 'cooling' ? <TrendingDown className="h-5 w-5 text-blue-500" /> :
        <Minus className="h-5 w-5 text-gray-500" /> : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg text-muted-foreground">Fetching and analyzing decades of NASA data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted/30 rounded-lg border-2 border-dashed">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-muted/30 rounded-lg border-2 border-dashed text-center p-4">
        <Info className="h-10 w-10 text-primary mb-4" />
        <h3 className="text-xl font-semibold">Ready for Analysis</h3>
        <p className="text-lg text-muted-foreground">Select a location and date, then click "Analyze" to see your weather insights.</p>
      </div>
    );
  }

  return (
    <>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Historical Overview</CardTitle>
            <CardDescription>Based on {results.total_years_analyzed} years of data.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Average Conditions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span>Avg. High:</span> <span className="font-bold">{results.averages.avg_high_f}°F</span></div>
                <div className="flex justify-between"><span>Avg. Low:</span> <span className="font-bold">{results.averages.avg_low_f}°F</span></div>
                <div className="flex justify-between"><span>Avg. Wind:</span> <span className="font-bold">{results.averages.avg_wind_mph} mph</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Historical Records</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span>Record High:</span> <span className="font-bold text-red-500">{results.records.record_high_f}°F</span></div>
                <div className="flex justify-between"><span>Record Low:</span> <span className="font-bold text-blue-500">{results.records.record_low_f}°F</span></div>
                <div className="flex justify-between items-center"><span>Temp Trend:</span> <span className="font-bold flex items-center gap-2 capitalize">{results.trend.temp_trend_label} {trendIcon}</span></div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="probabilities">
        <Card>
          <CardHeader>
            <CardTitle>Probability of Extreme Weather</CardTitle>
            <CardDescription>The likelihood of experiencing these conditions on this specific day.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-red-500/10 rounded-lg"><Sun className="mx-auto h-8 w-8 text-red-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.hot}%</p><p className="text-sm text-muted-foreground">Very Hot</p></div>
            <div className="p-4 bg-blue-500/10 rounded-lg"><Thermometer className="mx-auto h-8 w-8 text-blue-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.cold}%</p><p className="text-sm text-muted-foreground">Very Cold</p></div>
            <div className="p-4 bg-cyan-500/10 rounded-lg"><CloudRain className="mx-auto h-8 w-8 text-cyan-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.wet}%</p><p className="text-sm text-muted-foreground">Very Wet</p></div>
            <div className="p-4 bg-slate-500/10 rounded-lg"><Wind className="mx-auto h-8 w-8 text-slate-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.windy}%</p><p className="text-sm text-muted-foreground">Very Windy</p></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="trends">
        <Card>
          <CardHeader>
            <CardTitle>High Temperature Trend Over Time</CardTitle>
            <CardDescription>Maximum daily temperature recorded for this date each year since 1990.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] w-full">
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="High Temp (°F)" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default ResultsDisplay;
