// src/components/TrendsChartContainer.tsx

import { useMemo, useState } from 'react';
import type { WeatherStats } from '@/types/weather';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TrendsChartContainerProps {
  chartData: WeatherStats['chart_data'];
}

// Configuration for each chart we want to display
const chartConfigs = [
  { dataKey: 'High Temp (°F)', strokeColor: '#ef4444', name: 'High Temperature' },
  { dataKey: 'Low Temp (°F)', strokeColor: '#3b82f6', name: 'Low Temperature' },
  { dataKey: 'Wind Speed (mph)', strokeColor: '#64748b', name: 'Wind Speed' },
  { dataKey: 'Humidity (%)', strokeColor: '#14b8a6', name: 'Relative Humidity' },
  { dataKey: 'Sunlight (kWh/m²)', strokeColor: '#f59e0b', name: 'Sunlight / Insolation' },
  { dataKey: 'Precipitation (in)', strokeColor: '#0ea5e9', name: 'Precipitation' },
];

const TrendsChartContainer = ({ chartData }: TrendsChartContainerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // useMemo hook transforms the data into the format Recharts expects, and only re-calculates when chartData changes.
  const rechartsData = useMemo(() => {
    return chartData.years.map((year, index) => ({
      year,
      'High Temp (°F)': chartData.high_temps[index],
      'Low Temp (°F)': chartData.low_temps[index],
      'Wind Speed (mph)': chartData.wind_speeds[index],
      'Humidity (%)': chartData.humidity[index],
      'Sunlight (kWh/m²)': chartData.insolation[index],
      'Precipitation (in)': chartData.precipitation[index],
    }));
  }, [chartData]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % chartConfigs.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + chartConfigs.length) % chartConfigs.length);
  };

  const currentChart = chartConfigs[currentIndex];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Historical Trends</CardTitle>
            <CardDescription>Daily measurements for this date each year since 1990.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <div className="text-center mb-4 font-semibold text-lg">{currentChart.name}</div>
        <ResponsiveContainer>
          <LineChart data={rechartsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={currentChart.dataKey} stroke={currentChart.strokeColor} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrendsChartContainer;