# ==============================================================================
# FINAL BACKEND - NASA Weather Odds Calculator (v5 - Full Time Series)
#
# Adds a `full_time_series` key to the response, providing raw daily data
# for the new hydrology-style time series viewer.
# ==============================================================================

import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pandas as pd
import numpy as np
from scipy.stats import gaussian_kde

app = Flask(__name__)
CORS(app)

# ==============================================================================
# SECTION 1: DEFAULT THRESHOLDS
# ==============================================================================
DEFAULT_TEMP_HOT_F = 90
DEFAULT_TEMP_COLD_F = 32
DEFAULT_WIND_HIGH_MPH = 15
DEFAULT_PRECIP_WET_INCHES = 0.4
DEFAULT_HUMID_PERCENT = 75.0
DEFAULT_SUNNY_KWHR = 5.0
DEFAULT_SNOWY_MM = 1.0
DEFAULT_HEAT_INDEX_UNCOMFORTABLE_F = 95.0

# ==============================================================================
# SECTION 2: HELPER FUNCTIONS
# ==============================================================================

def fetch_nasa_data(lat, lon):
    """Fetches all required weather parameters from the NASA POWER API."""
    end_year = datetime.now().year - 1
    start_year = 1990
    base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    parameters = "T2M_MAX,T2M_MIN,PRECTOTCORR,WS10M,RH2M,PS,ALLSKY_SFC_SW_DWN,PRECSNOLAND"
    api_params = {
        "parameters": parameters, "community": "RE", "longitude": lon,
        "latitude": lat, "start": f"{start_year}0101", "end": f"{end_year}1231", "format": "JSON"
    }
    try:
        response = requests.get(base_url, params=api_params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching NASA data: {e}")
        return None

def calculate_heat_index(T, RH):
    """Calculates the Heat Index ('feels like' temp) using a simplified formula."""
    HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (RH * 0.094))
    return (T + HI) / 2

def process_weather_data(nasa_json, start_date_str, end_date_str, thresholds, combined_factors):
    """Core engine, now with combined probability and full time series calculation."""
    try:
        properties = nasa_json['properties']['parameter']
        df = pd.DataFrame(properties)
        df['date'] = pd.to_datetime(df.index, format='%Y%m%d')

        start_day_of_year = pd.to_datetime(start_date_str).dayofyear
        end_day_of_year = pd.to_datetime(end_date_str).dayofyear
        
        if start_day_of_year <= end_day_of_year:
            df_in_range = df[df['date'].dt.dayofyear.between(start_day_of_year, end_day_of_year)].copy()
        else:
            df_in_range = df[(df['date'].dt.dayofyear >= start_day_of_year) | (df['date'].dt.dayofyear <= end_day_of_year)].copy()

        total_days_analyzed = len(df_in_range)
        if total_days_analyzed == 0:
            return {"error": "No data available for the selected date range."}
        
        df_in_range['T2M_MAX_F'] = df_in_range['T2M_MAX'] * 9/5 + 32
        df_in_range['T2M_MIN_F'] = df_in_range['T2M_MIN'] * 9/5 + 32
        df_in_range['WS10M_MPH'] = df_in_range['WS10M'] * 2.237
        df_in_range['PRECTOTCORR_IN'] = df_in_range['PRECTOTCORR'] / 25.4
        df_in_range['PS_MB'] = df_in_range['PS'] * 10
        df_in_range['HEAT_INDEX_F'] = calculate_heat_index(df_in_range['T2M_MAX_F'], df_in_range['RH2M'])

        hot_days = df_in_range[df_in_range['T2M_MAX_F'] > thresholds['hot']].shape[0]
        cold_days = df_in_range[df_in_range['T2M_MIN_F'] < thresholds['cold']].shape[0]
        windy_days = df_in_range[df_in_range['WS10M_MPH'] > thresholds['windy']].shape[0]
        wet_days = df_in_range[df_in_range['PRECTOTCORR_IN'] > thresholds['wet']].shape[0]
        humid_days = df_in_range[df_in_range['RH2M'] > thresholds['humid']].shape[0]
        sunny_days = df_in_range[df_in_range['ALLSKY_SFC_SW_DWN'] > thresholds['sunny']].shape[0]
        snowy_days = df_in_range[df_in_range['PRECSNOLAND'] > thresholds['snowy']].shape[0]
        uncomfortable_days = df_in_range[df_in_range['HEAT_INDEX_F'] > thresholds['uncomfortable']].shape[0]

        combined_prob_results = {}
        if combined_factors and len(combined_factors) > 1:
            conditions = []
            factor_map = {
                'hot': df_in_range['T2M_MAX_F'] > thresholds['hot'],
                'cold': df_in_range['T2M_MIN_F'] < thresholds['cold'],
                'windy': df_in_range['WS10M_MPH'] > thresholds['windy'],
                'wet': df_in_range['PRECTOTCORR_IN'] > thresholds['wet'],
                'humid': df_in_range['RH2M'] > thresholds['humid'],
                'sunny': df_in_range['ALLSKY_SFC_SW_DWN'] > thresholds['sunny']
            }
            for factor in combined_factors:
                if factor in factor_map:
                    conditions.append(factor_map[factor])
            if conditions:
                final_condition = np.logical_and.reduce(conditions)
                combined_days = df_in_range[final_condition].shape[0]
                key = " & ".join(f.capitalize() for f in combined_factors)
                combined_prob_results[key] = round((combined_days / total_days_analyzed) * 100)

        df_in_range['year'] = df_in_range['date'].dt.year
        df_annual_avg = df_in_range.groupby('year').mean(numeric_only=True)
        temp_trend_corr = df_annual_avg['T2M_MAX_F'].corr(pd.Series(df_annual_avg.index))

        high_temp_data = df_in_range['T2M_MAX_F'].dropna()
        kde = gaussian_kde(high_temp_data)
        x_min, x_max = high_temp_data.min() - 10, high_temp_data.max() + 10
        x_vals = np.linspace(x_min, x_max, 100)
        y_vals = kde(x_vals)
        distribution_data = {"high_temp": {"points": [{"temp": round(x, 1), "density": round(y, 4)} for x, y in zip(x_vals, y_vals)], "mean": round(high_temp_data.mean(), 1)}}

        # --- ADDED: Prepare the full time series data ---
        df_for_timeseries = df_in_range.copy().sort_values(by='date')
        df_for_timeseries['date_str'] = df_for_timeseries['date'].dt.strftime('%Y-%m-%d')
        timeseries_columns = {
            'date_str': 'date',
            'T2M_MAX_F': 'High Temp (°F)',
            'T2M_MIN_F': 'Low Temp (°F)',
            'WS10M_MPH': 'Wind Speed (mph)',
            'RH2M': 'Humidity (%)',
            'ALLSKY_SFC_SW_DWN': 'Sunlight (kWh/m²)',
            'PRECTOTCORR_IN': 'Precipitation (in)'
        }
        full_time_series_data = df_for_timeseries[list(timeseries_columns.keys())].rename(columns=timeseries_columns).round(2).to_dict('records')

        results = {
            "total_years_analyzed": int(df_in_range['year'].nunique()),
            "probabilities": {
                "hot": round((hot_days / total_days_analyzed) * 100), "cold": round((cold_days / total_days_analyzed) * 100),
                "windy": round((windy_days / total_days_analyzed) * 100), "wet": round((wet_days / total_days_analyzed) * 100),
                "humid": round((humid_days / total_days_analyzed) * 100), "sunny": round((sunny_days / total_days_analyzed) * 100),
                "snowy": round((snowy_days / total_days_analyzed) * 100), "uncomfortable": round((uncomfortable_days / total_days_analyzed) * 100),
            },
            "averages": {
                "avg_high_f": round(df_in_range['T2M_MAX_F'].mean(), 1), "avg_low_f": round(df_in_range['T2M_MIN_F'].mean(), 1),
                "avg_wind_mph": round(df_in_range['WS10M_MPH'].mean(), 1), "avg_humidity_percent": round(df_in_range['RH2M'].mean(), 1),
                "avg_pressure_mb": round(df_in_range['PS_MB'].mean(), 1), "avg_insolation_kwhr": round(df_in_range['ALLSKY_SFC_SW_DWN'].mean(), 1),
                "avg_heat_index_f": round(df_in_range['HEAT_INDEX_F'].mean(), 1),
            },
            "records": {"record_high_f": round(df_in_range['T2M_MAX_F'].max(), 1), "record_low_f": round(df_in_range['T2M_MIN_F'].min(), 1)},
            "trend": {"temp_trend_label": "warming" if temp_trend_corr > 0.1 else "cooling" if temp_trend_corr < -0.1 else "stable"},
            "chart_data": {
                "years": df_annual_avg.index.tolist(), "high_temps": df_annual_avg['T2M_MAX_F'].round(1).tolist(),
                "low_temps": df_annual_avg['T2M_MIN_F'].round(1).tolist(), "wind_speeds": df_annual_avg['WS10M_MPH'].round(1).tolist(),
                "humidity": df_annual_avg['RH2M'].round(1).tolist(), "insolation": df_annual_avg['ALLSKY_SFC_SW_DWN'].round(1).tolist(),
                "precipitation": df_annual_avg['PRECTOTCORR_IN'].round(2).tolist()
            },
            "distributions": distribution_data,
            "combined_probabilities": combined_prob_results,
            "full_time_series": full_time_series_data
        }
        return results
    except Exception as e:
        print(f"Error processing data: {e}")
        return {"error": "An error occurred while processing the weather data."}

@app.route('/api/weather-stats', methods=['POST'])
def get_weather_stats():
    data = request.get_json()
    if not all(k in data for k in ['lat', 'lon', 'start_date', 'end_date']):
        return jsonify({"error": "Missing required parameters"}), 400
    
    thresholds = {
        'hot': data.get('thresholds', {}).get('hot', DEFAULT_TEMP_HOT_F),
        'cold': data.get('thresholds', {}).get('cold', DEFAULT_TEMP_COLD_F),
        'windy': data.get('thresholds', {}).get('windy', DEFAULT_WIND_HIGH_MPH),
        'wet': data.get('thresholds', {}).get('wet', DEFAULT_PRECIP_WET_INCHES),
        'humid': data.get('thresholds', {}).get('humid', DEFAULT_HUMID_PERCENT),
        'sunny': data.get('thresholds', {}).get('sunny', DEFAULT_SUNNY_KWHR),
        'snowy': data.get('thresholds', {}).get('snowy', DEFAULT_SNOWY_MM),
        'uncomfortable': data.get('thresholds', {}).get('uncomfortable', DEFAULT_HEAT_INDEX_UNCOMFORTABLE_F),
    }
    
    try:
        lat, lon = float(data['lat']), float(data['lon'])
        start_date, end_date = data['start_date'], data['end_date']
        combined_factors = data.get('combined_factors', [])
    except (ValueError, KeyError):
        return jsonify({"error": "Invalid data format"}), 400

    nasa_data = fetch_nasa_data(lat, lon)
    if nasa_data is None:
        return jsonify({"error": "Failed to fetch valid data from NASA"}), 500
    
    processed_stats = process_weather_data(nasa_data, start_date, end_date, thresholds, combined_factors)
    if "error" in processed_stats:
        return jsonify(processed_stats), 500

    return jsonify(processed_stats)


def analyze_perfect_day_score(df, period_start, period_end, criteria, thresholds):
    """Calculates the 'perfect day' score for a specific time period."""
    if period_start <= period_end:
        period_df = df[df['date'].dt.dayofyear.between(period_start, period_end)]
    else: # Handles periods wrapping around the new year (e.g., Dec 15 - Jan 5)
        period_df = df[(df['date'].dt.dayofyear >= period_start) | (df['date'].dt.dayofyear <= period_end)]
    
    if period_df.empty:
        return 0

    # Build the combined condition based on user criteria
    conditions = []
    if 'sunny' in criteria: conditions.append(period_df['ALLSKY_SFC_SW_DWN'] > thresholds['sunny'])
    if 'not_hot' in criteria: conditions.append(period_df['T2M_MAX_F'] <= thresholds['hot'])
    if 'not_cold' in criteria: conditions.append(period_df['T2M_MIN_F'] >= thresholds['cold'])
    if 'not_windy' in criteria: conditions.append(period_df['WS10M_MPH'] <= thresholds['windy'])
    if 'not_humid' in criteria: conditions.append(period_df['RH2M'] <= thresholds['humid'])
    if 'no_rain' in criteria: conditions.append(period_df['PRECTOTCORR_IN'] <= 0.01) # Check for minimal rain
    if 'no_snow' in criteria: conditions.append(period_df['PRECSNOLAND'] <= 0.1)     # Check for minimal snow

    if not conditions:
        return 0 # If no criteria are selected, the score is 0
        
    final_condition = np.logical_and.reduce(conditions)
    perfect_days = period_df[final_condition].shape[0]
    total_days = len(period_df)
    
    return round((perfect_days / total_days) * 100) if total_days > 0 else 0

@app.route('/api/find-perfect-day', methods=['POST'])
def find_perfect_day():
    data = request.get_json()
    if not all(k in data for k in ['lat', 'lon', 'criteria']):
        return jsonify({"error": "Missing required parameters"}), 400

    lat, lon = float(data['lat']), float(data['lon'])
    criteria = data['criteria']
    thresholds = data.get('thresholds', { # Use defaults if not provided
        'hot': DEFAULT_TEMP_HOT_F, 'cold': DEFAULT_TEMP_COLD_F,
        'windy': DEFAULT_WIND_HIGH_MPH, 'humid': DEFAULT_HUMID_PERCENT,
        'sunny': DEFAULT_SUNNY_KWHR
    })

    # Step 1: Fetch the full year's data ONCE.
    nasa_data = fetch_nasa_data(lat, lon)
    if nasa_data is None or 'properties' not in nasa_data:
        return jsonify({"error": "Failed to fetch valid data from NASA"}), 500

    # Step 2: Pre-process the entire DataFrame.
    properties = nasa_data['properties']['parameter']
    df = pd.DataFrame(properties)
    df['date'] = pd.to_datetime(df.index, format='%Y%m%d')
    df['T2M_MAX_F'] = df['T2M_MAX'] * 9/5 + 32
    df['T2M_MIN_F'] = df['T2M_MIN'] * 9/5 + 32
    df['WS10M_MPH'] = df['WS10M'] * 2.237
    df['PRECTOTCORR_IN'] = df['PRECTOTCORR'] / 25.4
    # All other conversions...
    df['HEAT_INDEX_F'] = calculate_heat_index(df['T2M_MAX_F'], df['RH2M'])
    
    # Step 3: Define bi-weekly periods and analyze each one.
    periods = [
        {"name": "Early January", "start": 1, "end": 15}, {"name": "Late January", "start": 16, "end": 31},
        {"name": "Early February", "start": 32, "end": 46}, {"name": "Late February", "start": 47, "end": 59},
        {"name": "Early March", "start": 60, "end": 74}, {"name": "Late March", "start": 75, "end": 90},
        {"name": "Early April", "start": 91, "end": 105}, {"name": "Late April", "start": 106, "end": 120},
        {"name": "Early May", "start": 121, "end": 135}, {"name": "Late May", "start": 136, "end": 151},
        {"name": "Early June", "start": 152, "end": 166}, {"name": "Late June", "start": 167, "end": 181},
        {"name": "Early July", "start": 182, "end": 196}, {"name": "Late July", "start": 197, "end": 212},
        {"name": "Early August", "start": 213, "end": 227}, {"name": "Late August", "start": 228, "end": 243},
        {"name": "Early September", "start": 244, "end": 258}, {"name": "Late September", "start": 259, "end": 273},
        {"name": "Early October", "start": 274, "end": 288}, {"name": "Late October", "start": 289, "end": 304},
        {"name": "Early November", "start": 305, "end": 319}, {"name": "Late November", "start": 320, "end": 334},
        {"name": "Early December", "start": 335, "end": 349}, {"name": "Late December", "start": 350, "end": 366},
    ]

    results = []
    for period in periods:
        score = analyze_perfect_day_score(df, period["start"], period["end"], criteria, thresholds)
        if score > 0:
            results.append({"period": period["name"], "score": score, "start_day": period["start"], "end_day": period["end"]})
    
    # Step 4: Sort and return the top results.
    sorted_results = sorted(results, key=lambda x: x["score"], reverse=True)
    
    return jsonify(sorted_results[:5]) # Return the top 5 best periods


if __name__ == '__main__':
    app.run(debug=True, port=5000)