// src/components/dashboard/HeatmapExplorer.tsx

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet.heat';
import L, { LatLngExpression, LatLngBounds } from 'leaflet';
import { format, addDays } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DateRangeSelector from './DateRangeSelector'; // Import the date selector
import { DateRange } from 'react-day-picker';

const HeatmapLayer = ({ points }: { points: [number, number, number][] }) => {
    const map = useMap();
    useEffect(() => {
        if (!map) return;
        const heatLayer = (L as any).heatLayer(points, { radius: 30, max: 100, blur: 15 });
        map.addLayer(heatLayer);
        return () => { map.removeLayer(heatLayer); };
    }, [map, points]);
    return null;
};

const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

const MapEventsHandler = ({ onBoundsChange }: { onBoundsChange: (bounds: LatLngBounds) => void }) => {
    const map = useMap();
    useEffect(() => { onBoundsChange(map.getBounds()); }, [map, onBoundsChange]);
    useMapEvents({
        moveend: () => onBoundsChange(map.getBounds()),
        zoomend: () => onBoundsChange(map.getBounds())
    });
    return null;
};

const HeatmapExplorer = () => {
    const [heatmapData, setHeatmapData] = useState<[number, number, number][]>([]);
    const [bounds, setBounds] = useState<LatLngBounds | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- ADDED: State for the date range selector ---
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), 90),
        to: addDays(new Date(), 104), // Default to a 2-week period 3 months from now
    });

    const debouncedBounds = useDebounce(bounds, 1500);

    useEffect(() => {
        if (debouncedBounds && dateRange?.from && dateRange?.to) {
            const fetchHeatmapData = async () => {
                setIsLoading(true);
                // --- ADDED: Logic to WRAP coordinates ---
                const northEast = debouncedBounds.getNorthEast().wrap();
                const southWest = debouncedBounds.getSouthWest().wrap();

                const wrappedBounds = {
                    north: northEast.lat,
                    south: southWest.lat,
                    east: northEast.lng,
                    west: southWest.lng,
                };

                try {
                    const response = await fetch('http://127.0.0.1:5000/api/weather-heatmap', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            bounds: wrappedBounds,
                            start_date: format(dateRange.from, 'yyyy-MM-dd'),
                            end_date: format(dateRange.to, 'yyyy-MM-dd'),
                        }),
                    });
                    const data = await response.json();
                    if (data.error) throw new Error(data.error);
                    setHeatmapData(data);
                } catch (error) {
                    console.error("Failed to fetch heatmap data:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchHeatmapData();
        }
    }, [debouncedBounds, dateRange]);

    const initialPosition: LatLngExpression = [20, 0];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Heatmap Explorer</CardTitle>
                <CardDescription>
                    Shows the probability of hot days (&gt;90°F) for the selected date range. The map updates as you pan and zoom.
                    {isLoading && <span className="text-primary animate-pulse ml-2">Loading new data...</span>}
                </CardDescription>
                {/* --- ADDED: Date Range Selector for the heatmap --- */}
                <div className="pt-4 max-w-sm">
                    <DateRangeSelector value={dateRange} onDateChange={setDateRange} />
                </div>
            </CardHeader>
            <CardContent className="h-[70vh] w-full p-0 rounded-b-lg overflow-hidden">
                <MapContainer center={initialPosition} zoom={2} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <HeatmapLayer points={heatmapData} />
                    <MapEventsHandler onBoundsChange={setBounds} />
                </MapContainer>
            </CardContent>
        </Card>
    );
};

export default HeatmapExplorer;