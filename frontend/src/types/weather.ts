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
        humid: number;
        sunny: number;
        snowy: number;
        uncomfortable: number;
    };
    averages: {
        avg_high_f: number;
        avg_low_f: number;
        avg_wind_mph: number;
        avg_humidity_percent: number;
        avg_pressure_mb: number;
        avg_insolation_kwhr: number;
        avg_heat_index_f: number;
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
        low_temps: number[];
        wind_speeds: number[];
        humidity: number[];
        insolation: number[];
        precipitation: number[];
    };
    distributions?: {
        high_temp: {
            points: { temp: number; density: number }[];
            mean: number;
        };
    };
    combined_probabilities?: {
        [key: string]: number;
    };
}