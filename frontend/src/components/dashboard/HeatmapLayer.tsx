// src/components/dashboard/HeatmapLayer.tsx

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.heat';
import L from 'leaflet';

interface HeatmapProps {
    points: [number, number, number][];
}

const HeatmapLayer = ({ points }: HeatmapProps) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // Create the heatmap layer. 'L.heatLayer' is added by the 'leaflet.heat' import.
        // The 'as any' is a small concession to TypeScript for plugins.
        const heatLayer = (L as any).heatLayer(points, {
            radius: 30,
            max: 100, // Assuming probability is 0-100
            blur: 15,
        });

        // Add the layer to the map
        map.addLayer(heatLayer);

        // This is a cleanup function. It removes the old layer before adding a new one.
        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map, points]); // Re-run this effect if the map or data points change

    return null; // This component doesn't render any visible JSX itself
};

export default HeatmapLayer;