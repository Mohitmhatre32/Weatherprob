// src/types/weather.ts

export interface Location {
    name: string;
    lat: number;
    lon: number;
}

export interface WeatherStats {
    total_years_analyzed: number;
    probabilities: {
        hot: number;
        cold: number;
        windy: number;
        wet: number;
    };
    averages: {
        avg_high_f: number;
        avg_low_f: number;
        avg_wind_mph: number;
    };
    records: {
        record_high_f: number;
        record_low_f: number;
    };
    trend: {
        temp_trend_label: 'warming' | 'cooling' | 'stable';
    };
    chart_data: {
        years: number[];
        high_temps: number[];
    };
}