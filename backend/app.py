# ==============================================================================
# FINAL BACKEND - NASA Weather Odds Calculator
#
# This Flask server provides a single API endpoint (/api/weather-stats).
# It accepts a location, date, and optional user-defined weather thresholds.
# It fetches decades of historical data from the NASA POWER API, processes it,
# and returns a rich JSON object with calculated probabilities, averages,
# records, and a full set of historical data series for charting.
# ==============================================================================

import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pandas as pd
import numpy as np

# --- App Initialization ---
app = Flask(__name__)
CORS(app)

# ==============================================================================
# SECTION 1: DEFAULT THRESHOLDS
# These values are used if the frontend does not provide custom ones.
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

def process_weather_data(nasa_json, target_month, target_day, thresholds):
    """The core data processing engine."""
    try:
        properties = nasa_json['properties']['parameter']
        df = pd.DataFrame(properties)
        df['date'] = pd.to_datetime(df.index, format='%Y%m%d')
        
        df_filtered = df[(df['date'].dt.month == target_month) & (df['date'].dt.day == target_day)].copy()
        
        total_years = len(df_filtered)
        if total_years == 0:
            return {"error": "No data available for the selected date."}
            
        # --- Unit Conversions & Feature Engineering ---
        df_filtered['T2M_MAX_F'] = df_filtered['T2M_MAX'] * 9/5 + 32
        df_filtered['T2M_MIN_F'] = df_filtered['T2M_MIN'] * 9/5 + 32
        df_filtered['WS10M_MPH'] = df_filtered['WS10M'] * 2.237
        df_filtered['PRECTOTCORR_IN'] = df_filtered['PRECTOTCORR'] / 25.4
        df_filtered['PS_MB'] = df_filtered['PS'] * 10
        df_filtered['HEAT_INDEX_F'] = calculate_heat_index(df_filtered['T2M_MAX_F'], df_filtered['RH2M'])

        # --- Probability Calculations ---
        hot_days = df_filtered[df_filtered['T2M_MAX_F'] > thresholds['hot']].shape[0]
        cold_days = df_filtered[df_filtered['T2M_MIN_F'] < thresholds['cold']].shape[0]
        windy_days = df_filtered[df_filtered['WS10M_MPH'] > thresholds['windy']].shape[0]
        wet_days = df_filtered[df_filtered['PRECTOTCORR_IN'] > thresholds['wet']].shape[0]
        humid_days = df_filtered[df_filtered['RH2M'] > thresholds['humid']].shape[0]
        sunny_days = df_filtered[df_filtered['ALLSKY_SFC_SW_DWN'] > thresholds['sunny']].shape[0]
        snowy_days = df_filtered[df_filtered['PRECSNOLAND'] > thresholds['snowy']].shape[0]
        uncomfortable_days = df_filtered[df_filtered['HEAT_INDEX_F'] > thresholds['uncomfortable']].shape[0]
        
        df_filtered['year'] = df_filtered['date'].dt.year
        temp_trend_corr = df_filtered['T2M_MAX_F'].corr(df_filtered['year'])
        
        results = {
            "total_years_analyzed": total_years,
            "probabilities": {
                "hot": round((hot_days / total_years) * 100), "cold": round((cold_days / total_years) * 100),
                "windy": round((windy_days / total_years) * 100), "wet": round((wet_days / total_years) * 100),
                "humid": round((humid_days / total_years) * 100), "sunny": round((sunny_days / total_years) * 100),
                "snowy": round((snowy_days / total_years) * 100), "uncomfortable": round((uncomfortable_days / total_years) * 100),
            },
            "averages": {
                "avg_high_f": round(df_filtered['T2M_MAX_F'].mean(), 1), "avg_low_f": round(df_filtered['T2M_MIN_F'].mean(), 1),
                "avg_wind_mph": round(df_filtered['WS10M_MPH'].mean(), 1), "avg_humidity_percent": round(df_filtered['RH2M'].mean(), 1),
                "avg_pressure_mb": round(df_filtered['PS_MB'].mean(), 1), "avg_insolation_kwhr": round(df_filtered['ALLSKY_SFC_SW_DWN'].mean(), 1),
                "avg_heat_index_f": round(df_filtered['HEAT_INDEX_F'].mean(), 1),
            },
            "records": { "record_high_f": round(df_filtered['T2M_MAX_F'].max(), 1), "record_low_f": round(df_filtered['T2M_MIN_F'].min(), 1), },
            "trend": { "temp_trend_label": "warming" if temp_trend_corr > 0.1 else "cooling" if temp_trend_corr < -0.1 else "stable" },
            
            # --- UPDATED CHART DATA TO INCLUDE ALL SERIES ---
            "chart_data": {
                "years": df_filtered['year'].tolist(),
                "high_temps": df_filtered['T2M_MAX_F'].round(1).tolist(),
                "low_temps": df_filtered['T2M_MIN_F'].round(1).tolist(),
                "wind_speeds": df_filtered['WS10M_MPH'].round(1).tolist(),
                "humidity": df_filtered['RH2M'].round(1).tolist(),
                "insolation": df_filtered['ALLSKY_SFC_SW_DWN'].round(1).tolist(),
                "precipitation": df_filtered['PRECTOTCORR_IN'].round(2).tolist()
            }
        }
        return results
    except Exception as e:
        print(f"Error processing data: {e}")
        return {"error": "An error occurred while processing the weather data."}

# ==============================================================================
# SECTION 3: API ROUTE & MAIN EXECUTION
# ==============================================================================
@app.route('/api/weather-stats', methods=['POST'])
def get_weather_stats():
    data = request.get_json()
    if not all(k in data for k in ['lat', 'lon', 'month', 'day']):
        return jsonify({"error": "Missing required parameters"}), 400
    
    user_thresholds = data.get('thresholds', {})
    thresholds = {
        'hot': user_thresholds.get('hot', DEFAULT_TEMP_HOT_F), 'cold': user_thresholds.get('cold', DEFAULT_TEMP_COLD_F),
        'windy': user_thresholds.get('windy', DEFAULT_WIND_HIGH_MPH), 'wet': user_thresholds.get('wet', DEFAULT_PRECIP_WET_INCHES),
        'humid': user_thresholds.get('humid', DEFAULT_HUMID_PERCENT), 'sunny': user_thresholds.get('sunny', DEFAULT_SUNNY_KWHR),
        'snowy': user_thresholds.get('snowy', DEFAULT_SNOWY_MM), 'uncomfortable': user_thresholds.get('uncomfortable', DEFAULT_HEAT_INDEX_UNCOMFORTABLE_F),
    }
    
    try:
        lat, lon = float(data['lat']), float(data['lon'])
        month, day = int(data['month']), int(data['day'])
    except ValueError:
        return jsonify({"error": "Invalid data format"}), 400

    nasa_data = fetch_nasa_data(lat, lon)
    if nasa_data is None or 'properties' not in nasa_data:
        return jsonify({"error": "Failed to fetch valid data from NASA"}), 500
    
    processed_stats = process_weather_data(nasa_data, month, day, thresholds)
    if "error" in processed_stats:
        return jsonify(processed_stats), 500

    return jsonify(processed_stats)

if __name__ == '__main__':
    app.run(debug=True, port=5000)