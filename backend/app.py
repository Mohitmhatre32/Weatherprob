# ==============================================================================
# 1. IMPORTS
# All the libraries our application needs to function.
# ==============================================================================
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pandas as pd

# ==============================================================================
# 2. APP INITIALIZATION & CONFIGURATION
# Setting up our Flask web server.
# ==============================================================================
app = Flask(__name__)

# CORS is a security feature; this line allows our React frontend (on a 
# different "origin") to request data from this backend.
CORS(app)

# ==============================================================================
# 3. GLOBAL CONSTANTS & THRESHOLDS
# These are the definitions that were missing and causing the error.
# We define our weather conditions here. You can change these values.
# ==============================================================================
TEMP_HOT_F = 90         # Threshold for a "very hot" day in Fahrenheit
TEMP_COLD_F = 32        # Threshold for a "very cold" day in Fahrenheit
WIND_HIGH_MPH = 15      # Threshold for a "very windy" day in Miles Per Hour
PRECIP_WET_INCHES = 0.4   # Threshold for a "very wet" day in Inches

# ==============================================================================
# 4. HELPER FUNCTIONS 
# These functions do the specific jobs of fetching and processing data.
# ==============================================================================

def fetch_nasa_data(lat, lon):
    """
    Fetches historical weather data from the NASA POWER API for a given lat/lon.
    """
    end_year = datetime.now().year - 1
    start_year = 1990  # A good range of historical data
    
    base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    parameters = "T2M_MAX,T2M_MIN,PRECTOTCORR,WS10M"

    api_params = {
        "parameters": parameters,
        "community": "RE",
        "longitude": lon,
        "latitude": lat,
        "start": f"{start_year}0101",
        "end": f"{end_year}1231",
        "format": "JSON"
    }

    try:
        response = requests.get(base_url, params=api_params)
        response.raise_for_status()  # This will raise an error for bad responses (4xx or 5xx)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching NASA data: {e}")
        return None

def process_weather_data(nasa_json, target_month, target_day):
    """
    Processes the raw JSON from NASA into calculated statistics using Pandas.
    """
    try:
        properties = nasa_json['properties']['parameter']
        df = pd.DataFrame(properties)
        
        df['date'] = pd.to_datetime(df.index, format='%Y%m%d')
        
        # Filter the DataFrame to only include rows for the specific month and day
        df_filtered = df[(df['date'].dt.month == target_month) & (df['date'].dt.day == target_day)].copy()
        
        total_years = len(df_filtered)
        if total_years == 0:
            return {"error": "No data available for the selected date."}
            
        # --- Unit Conversions from Metric to Imperial ---
        df_filtered['T2M_MAX_F'] = df_filtered['T2M_MAX'] * 9/5 + 32
        df_filtered['T2M_MIN_F'] = df_filtered['T2M_MIN'] * 9/5 + 32
        df_filtered['WS10M_MPH'] = df_filtered['WS10M'] * 2.237
        df_filtered['PRECTOTCORR_IN'] = df_filtered['PRECTOTCORR'] / 25.4

        # --- Calculate Probabilities using our defined threshold constants ---
        hot_days = df_filtered[df_filtered['T2M_MAX_F'] > TEMP_HOT_F].shape[0]
        cold_days = df_filtered[df_filtered['T2M_MIN_F'] < TEMP_COLD_F].shape[0]
        windy_days = df_filtered[df_filtered['WS10M_MPH'] > WIND_HIGH_MPH].shape[0]
        wet_days = df_filtered[df_filtered['PRECTOTCORR_IN'] > PRECIP_WET_INCHES].shape[0]
        
        # --- Calculate Temperature Trend ---
        df_filtered['year'] = df_filtered['date'].dt.year
        # Correlation tells us the strength and direction of a linear relationship
        temp_trend_corr = df_filtered['T2M_MAX_F'].corr(df_filtered['year'])
        
        # --- Assemble the final results dictionary ---
        results = {
            "total_years_analyzed": total_years,
            "probabilities": {
                "hot": round((hot_days / total_years) * 100),
                "cold": round((cold_days / total_years) * 100),
                "windy": round((windy_days / total_years) * 100),
                "wet": round((wet_days / total_years) * 100)
            },
            "averages": {
                "avg_high_f": round(df_filtered['T2M_MAX_F'].mean(), 1),
                "avg_low_f": round(df_filtered['T2M_MIN_F'].mean(), 1),
                "avg_wind_mph": round(df_filtered['WS10M_MPH'].mean(), 1)
            },
            "records": {
                "record_high_f": round(df_filtered['T2M_MAX_F'].max(), 1),
                "record_low_f": round(df_filtered['T2M_MIN_F'].min(), 1),
            },
            "trend": {
                "temp_trend_label": "warming" if temp_trend_corr > 0.1 else "cooling" if temp_trend_corr < -0.1 else "stable"
            },
            "chart_data": {
                "years": df_filtered['year'].tolist(),
                "high_temps": df_filtered['T2M_MAX_F'].round(1).tolist()
            }
        }
        return results

    except Exception as e:
        print(f"Error processing data: {e}")
        return {"error": "An error occurred while processing the weather data."}

# ==============================================================================
# 5. API ROUTES (THE ENDPOINTS OUR FRONTEND WILL CALL)
# ==============================================================================

@app.route('/')
def home():
    """A simple route to confirm the server is running."""
    return "Hello! The weather app backend is running."

@app.route('/api/weather-stats', methods=['POST'])
def get_weather_stats():
    """The main API endpoint that drives the application."""
    data = request.get_json()

    # Validate that we received all the necessary data
    if not all(k in data for k in ['lat', 'lon', 'month', 'day']):
        return jsonify({"error": "Missing required parameters: lat, lon, month, day"}), 400

    try:
        # Convert incoming data to the correct types
        lat, lon = float(data['lat']), float(data['lon'])
        month, day = int(data['month']), int(data['day'])
    except ValueError:
        return jsonify({"error": "Invalid data format. lat/lon must be numbers, month/day must be integers."}), 400

    # Step 1: Fetch data from NASA
    nasa_data = fetch_nasa_data(lat, lon)
    if nasa_data is None or 'properties' not in nasa_data:
        return jsonify({"error": "Failed to fetch valid data from the NASA POWER API"}), 500

    # Step 2: Process the fetched data
    processed_stats = process_weather_data(nasa_data, month, day)
    if "error" in processed_stats:
        return jsonify(processed_stats), 500

    # Step 3: Send the successful result back to the frontend
    return jsonify(processed_stats)

# ==============================================================================
# 6. MAIN EXECUTION BLOCK
# This is the entry point for running the application.
# ==============================================================================
if __name__ == '__main__':
    # debug=True makes the server automatically reload when you save the file.
    app.run(debug=True, port=5000)