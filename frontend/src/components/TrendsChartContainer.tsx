import { useMemo, useState } from 'react';
import type { WeatherStats } from '@/types/weather';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TrendsChartContainerProps {
  chartData: WeatherStats['chart_data'];
}

const chartConfigs = [
  { dataKey: 'High Temp (°F)', strokeColor: '#ef4444', name: 'High Temperature' },
  { dataKey: 'Low Temp (°F)', strokeColor: '#3b82f6', name: 'Low Temperature' },
  { dataKey: 'Wind Speed (mph)', strokeColor: '#64748b', name: 'Wind Speed' },
  { dataKey: 'Humidity (%)', strokeColor: '#14b8a6', name: 'Relative Humidity' },
  { dataKey: 'Sunlight (kWh/m²)', strokeColor: '#f59e0b', name: 'Sunlight / Insolation' },
  { dataKey: 'Precipitation (in)', strokeColor: '#0ea5e9', name: 'Precipitation' },
];

const getUnitFromDataKey = (dataKey: string) => {
  const match = dataKey.match(/\(([^)]+)\)/);
  return match ? match[1] : '';
};

const TrendsChartContainer = ({ chartData }: TrendsChartContainerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % chartConfigs.length);
  const handlePrevious = () => setCurrentIndex((prev) => (prev - 1 + chartConfigs.length) % chartConfigs.length);

  const currentChart = chartConfigs[currentIndex];
  const yAxisUnit = getUnitFromDataKey(currentChart.dataKey);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Year-over-Year Trends</CardTitle>
            <CardDescription>Average measurements for the selected period each year.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevious}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <div className="text-center mb-4 font-semibold text-lg">{currentChart.name}</div>
        <ResponsiveContainer>
          <LineChart data={rechartsData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{ value: 'Year', position: 'insideBottom', offset: -15 }}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              label={{ value: yAxisUnit, angle: -90, position: 'insideLeft', offset: -5 }}
              tickFormatter={(value) => Number(value).toFixed(1)}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(2)} ${yAxisUnit}`, currentChart.name]}
            />
            <Legend verticalAlign="bottom" />
            <Line type="monotone" dataKey={currentChart.dataKey} stroke={currentChart.strokeColor} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TrendsChartContainer;