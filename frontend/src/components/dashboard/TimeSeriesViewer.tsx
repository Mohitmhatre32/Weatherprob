// src/components/dashboard/TimeSeriesViewer.tsx

import { useState } from 'react';
import type { WeatherStats } from '@/types/weather';
// --- MODIFIED: Swapped BarChart for LineChart ---
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeSeriesViewerProps {
    timeSeriesData: WeatherStats['full_time_series'];
}

const chartConfigs = [
    { dataKey: 'High Temp (°F)', strokeColor: '#ef4444', name: 'High Temperature' },
    { dataKey: 'Precipitation (in)', strokeColor: '#0ea5e9', name: 'Precipitation' },
    { dataKey: 'Low Temp (°F)', strokeColor: '#3b82f6', name: 'Low Temperature' },
    { dataKey: 'Wind Speed (mph)', strokeColor: '#64748b', name: 'Wind Speed' },
    { dataKey: 'Humidity (%)', strokeColor: '#14b8a6', name: 'Relative Humidity' },
    { dataKey: 'Sunlight (kWh/m²)', strokeColor: '#f59e0b', name: 'Sunlight / Insolation' },
];

const getUnitFromDataKey = (dataKey: string) => {
    const match = dataKey.match(/\(([^)]+)\)/);
    return match ? match[1] : '';
};

const TimeSeriesViewer = ({ timeSeriesData }: TimeSeriesViewerProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % chartConfigs.length);
    const handlePrevious = () => setCurrentIndex((prev) => (prev - 1 + chartConfigs.length) % chartConfigs.length);

    const currentChart = chartConfigs[currentIndex];
    const yAxisUnit = getUnitFromDataKey(currentChart.dataKey);

    if (!timeSeriesData || timeSeriesData.length === 0) {
        return <p>No time series data available.</p>;
    }

    // Format X-axis ticks to only show the year
    const formatXAxis = (tickItem: string) => {
        return new Date(tickItem).getFullYear().toString();
    };

    // Create a unique list of years for ticks, showing one every 5 years for clarity
    const yearTicks = Array.from(new Set(timeSeriesData.map(d => new Date(d.date).getFullYear())))
        .filter(year => year % 5 === 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Daily Time Series Viewer</CardTitle>
                        <CardDescription>All historical daily data points for the selected period across 30+ years.</CardDescription>
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
                    <LineChart data={timeSeriesData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="date"
                            tickFormatter={formatXAxis}
                            ticks={yearTicks}
                            label={{ value: 'Year', position: 'insideBottom', offset: -15 }}
                        />

                        <YAxis
                            label={{ value: yAxisUnit, angle: -90, position: 'insideLeft' }}
                        />

                        <Tooltip
                            labelFormatter={(label) => `Date: ${label}`}
                            formatter={(value, name) => [`${Number(value).toFixed(2)} ${yAxisUnit}`, name]}
                        />

                        <Line
                            type="monotone"
                            dataKey={currentChart.dataKey}
                            stroke={currentChart.strokeColor}
                            strokeWidth={1.5}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default TimeSeriesViewer;