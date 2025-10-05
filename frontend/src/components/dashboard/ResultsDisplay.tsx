import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import type { WeatherStats } from "@/types/weather";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Sun, Thermometer, Wind, CloudRain, Droplets, Snowflake, ShieldAlert, TrendingUp, TrendingDown, Minus, Info, AlertTriangle, PartyPopper, CheckSquare } from "lucide-react";
import TrendsChartContainer from "../TrendsChartContainer";
import Loader from "@/hooks/loader";
import TimeSeriesViewer from './TimeSeriesViewer';

interface ResultsDisplayProps {
  results: WeatherStats | null;
  isLoading: boolean;
  error: string | null;
}

const KeyTakeaways = ({ probabilities }: { probabilities: WeatherStats['probabilities'] }) => {
  const recommendations = [];
  if (probabilities.uncomfortable > 60) {
    recommendations.push({ text: "Extreme Discomfort Likely: High heat and humidity are very probable. Prioritize hydration and cooling.", icon: <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" /> });
  } else if (probabilities.hot > 50) {
    recommendations.push({ text: "Expect Hot Weather: It's likely to be very hot. Plan for shade and avoid peak sun hours.", icon: <Sun className="h-5 w-5 text-yellow-500 flex-shrink-0" /> });
  }
  if (probabilities.wet > 40) {
    recommendations.push({ text: "High Chance of Rain: There's a significant probability of wet conditions. Pack rain gear.", icon: <CloudRain className="h-5 w-5 text-cyan-500 flex-shrink-0" /> });
  }
  if (probabilities.cold > 50) {
    recommendations.push({ text: "Prepare for Cold: Freezing temperatures are likely. Dress in warm layers.", icon: <Snowflake className="h-5 w-5 text-sky-500 flex-shrink-0" /> });
  }
  if (probabilities.windy > 50) {
    recommendations.push({ text: "Windy Conditions Expected: Be prepared for strong winds.", icon: <Wind className="h-5 w-5 text-slate-500 flex-shrink-0" /> });
  }
  if (recommendations.length === 0 && probabilities.uncomfortable < 20 && probabilities.wet < 20 && probabilities.cold < 20) {
    recommendations.push({ text: "Great Conditions Expected: Historically, this period has pleasant weather.", icon: <PartyPopper className="h-5 w-5 text-green-500 flex-shrink-0" /> });
  }
  if (recommendations.length === 0) {
    recommendations.push({ text: "Mixed Conditions: No single weather type dominates.", icon: <Info className="h-5 w-5 text-gray-500 flex-shrink-0" /> });
  }
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Key Takeaways</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="flex items-start gap-4">
            {rec.icon}<p className="text-sm text-muted-foreground">{rec.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const ResultsDisplay = ({ results, isLoading, error }: ResultsDisplayProps) => {
  const trendIcon = results ? (results.trend.temp_trend_label === 'warming' ? <TrendingUp className="h-5 w-5 text-red-500" /> : results.trend.temp_trend_label === 'cooling' ? <TrendingDown className="h-5 w-5 text-blue-500" /> : <Minus className="h-5 w-5 text-gray-500" />) : null;

  if (isLoading && !results) { // Show full-page loader only on initial load
   return (
    <div className="flex items-center justify-center h-96">
      <Loader />
    </div>
  );
  }
  if (error) {
    return <div className="flex items-center justify-center h-96 bg-muted/30 rounded-lg border-2 border-dashed"><p className="text-lg text-red-500">{error}</p></div>;
  }
  if (!results) {
    return <div className="flex flex-col items-center justify-center h-96 bg-muted/30 rounded-lg border-2 border-dashed text-center p-4"><Info className="h-10 w-10 text-primary mb-4" /><h3 className="text-xl font-semibold">Ready for Analysis</h3><p className="text-lg text-muted-foreground">Select a location and date range, then click "Analyze".</p></div>;
  }


  return (
    <>
      <TabsContent value="overview">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Historical Overview</CardTitle><CardDescription>Based on {results.total_years_analyzed} years of data.</CardDescription></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Average Conditions</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between"><span>Avg. High / Feels Like:</span> <span className="font-bold">{results.averages.avg_high_f}°F / {results.averages.avg_heat_index_f}°F</span></div>
                  <div className="flex justify-between"><span>Avg. Low:</span> <span className="font-bold">{results.averages.avg_low_f}°F</span></div>
                  <div className="flex justify-between"><span>Avg. Humidity:</span> <span className="font-bold">{results.averages.avg_humidity_percent}%</span></div>
                  <div className="flex justify-between"><span>Avg. Wind:</span> <span className="font-bold">{results.averages.avg_wind_mph} mph</span></div>
                  <div className="flex justify-between"><span>Avg. Sunlight:</span> <span className="font-bold">{results.averages.avg_insolation_kwhr} kWh/m²</span></div>
                  <div className="flex justify-between"><span>Avg. Pressure:</span> <span className="font-bold">{results.averages.avg_pressure_mb} mb</span></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Historical Records & Trend</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between"><span>Record High:</span> <span className="font-bold text-red-500">{results.records.record_high_f}°F</span></div>
                  <div className="flex justify-between"><span>Record Low:</span> <span className="font-bold text-blue-500">{results.records.record_low_f}°F</span></div>
                  <div className="flex justify-between items-center"><span>Temp Trend:</span> <span className="font-bold flex items-center gap-2 capitalize">{results.trend.temp_trend_label} {trendIcon}</span></div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
          <KeyTakeaways probabilities={results.probabilities} />
        </div>
      </TabsContent>

      <TabsContent value="probabilities">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Probability of Conditions</CardTitle><CardDescription>Likelihood of any given day in this range experiencing these conditions.</CardDescription></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-purple-500/10 rounded-lg col-span-2 md:col-span-4 border"><ShieldAlert className="mx-auto h-8 w-8 text-purple-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.uncomfortable}%</p><p className="text-sm text-muted-foreground">Uncomfortable Day</p></div>
              <div className="p-4 bg-yellow-500/10 rounded-lg"><Sun className="mx-auto h-8 w-8 text-yellow-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.sunny}%</p><p className="text-sm text-muted-foreground">Very Sunny</p></div>
              <div className="p-4 bg-red-500/10 rounded-lg"><Thermometer className="mx-auto h-8 w-8 text-red-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.hot}%</p><p className="text-sm text-muted-foreground">Very Hot</p></div>
              <div className="p-4 bg-teal-500/10 rounded-lg"><Droplets className="mx-auto h-8 w-8 text-teal-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.humid}%</p><p className="text-sm text-muted-foreground">Very Humid</p></div>
              <div className="p-4 bg-cyan-500/10 rounded-lg"><CloudRain className="mx-auto h-8 w-8 text-cyan-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.wet}%</p><p className="text-sm text-muted-foreground">Very Wet</p></div>
              <div className="p-4 bg-blue-500/10 rounded-lg"><Thermometer className="mx-auto h-8 w-8 text-blue-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.cold}%</p><p className="text-sm text-muted-foreground">Very Cold</p></div>
              <div className="p-4 bg-sky-500/10 rounded-lg"><Snowflake className="mx-auto h-8 w-8 text-sky-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.snowy}%</p><p className="text-sm text-muted-foreground">Snowfall</p></div>
              <div className="p-4 bg-slate-500/10 rounded-lg"><Wind className="mx-auto h-8 w-8 text-slate-500 mb-2" /><p className="text-3xl font-bold">{results.probabilities.windy}%</p><p className="text-sm text-muted-foreground">Very Windy</p></div>
            </CardContent>
          </Card>
          {results.combined_probabilities && Object.keys(results.combined_probabilities).length > 0 && (
            <Card>
              <CardHeader><CardTitle>Combined Probability</CardTitle><CardDescription>The historical likelihood of the selected conditions occurring on the same day.</CardDescription></CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {Object.entries(results.combined_probabilities).map(([key, value]) => (
                  <div key={key} className="p-4 bg-purple-500/10 rounded-lg">
                    <CheckSquare className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                    <p className="text-3xl font-bold">{value}%</p>
                    <p className="text-sm text-muted-foreground break-words">{key}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="trends">
        <TrendsChartContainer chartData={results.chart_data} />
      </TabsContent>

      <TabsContent value="distributions">
        <Card>
          <CardHeader><CardTitle>High Temperature Distribution</CardTitle><CardDescription>This bell curve shows the historical likelihood of any given high temperature.</CardDescription></CardHeader>
          <CardContent className="h-[70vh] w-full p-0">
            {results.distributions?.high_temp && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.distributions.high_temp.points} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="temp" type="number" domain={['dataMin', 'dataMax']} label={{ value: 'High Temperature (°F)', position: 'insideBottom', offset: -10 }} tickFormatter={(value) => `${value}°`} />
                  <YAxis label={{ value: 'Probability Density', angle: -90, position: 'insideLeft' }} tick={false} />
                  <Tooltip formatter={(value, name, props) => [`${props.payload.temp}°F`, "Temperature"]} labelFormatter={() => ''} />
                  <defs><linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} /><stop offset="95%" stopColor="#8884d8" stopOpacity={0} /></linearGradient></defs>
                  <Area type="monotone" dataKey="density" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                  <ReferenceLine x={results.distributions.high_temp.mean} stroke="red" strokeWidth={2} strokeDasharray="3 3" />
                  <Legend verticalAlign="top" payload={[{ value: `Historical Average: ${results.distributions.high_temp.mean}°F`, type: 'line', color: 'red' }]} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="timeseries">
        {results.full_time_series && <TimeSeriesViewer timeSeriesData={results.full_time_series} />}
      </TabsContent>
    </>
  );
}

export default ResultsDisplay;