// src/components/dashboard/TimeSeriesViewer.tsx

import { useMemo, useState } from 'react';
import type { WeatherStats } from '@/types/weather';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeSeriesViewerProps {
    timeSeriesData: NonNullable<WeatherStats['full_time_series']>;
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

    // --- THIS IS THE CORRECT FIX ---
    // 1. Generate static year strings for the ticks
    const yearTicks = [];
    for (let year = 1990; year <= 2024; year += 2) {
        yearTicks.push(year.toString());
    }

    // 2. Format the data's date into just the year for the axis to match against
    const processedData = useMemo(() =>
        timeSeriesData.map(d => ({
            ...d,
            yearLabel: new Date(d.date).getFullYear().toString(),
        })), [timeSeriesData]);

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
                    <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="yearLabel"
                            type="category"
                            ticks={yearTicks}
                            interval={0}
                            label={{ value: 'Year', position: 'insideBottom', offset: -15 }}
                        />

                        <YAxis
                            label={{ value: yAxisUnit, angle: -90, position: 'insideLeft', offset: -5 }}
                            domain={['dataMin', 'auto']}
                        />

                        <Tooltip
                            labelFormatter={(label, payload) => `Date: ${payload[0]?.payload.date}`}
                            formatter={(value) => [`${Number(value).toFixed(2)} ${yAxisUnit}`, currentChart.name]}
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