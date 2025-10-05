# WeatherProb: Historical Weather Probability Insights

> Plan your future, historically. An advanced weather analytics dashboard powered by NASA Earth Observation Data.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)

**Live Demo:** [**weatherprob.vercel.app**](https://[your-app-url.vercel.app])

![WeatherProb Dashboard Screenshot](https://[Link-to-a-high-quality-screenshot-or-GIF-of-your-dashboard].png)

---

## The Problem Statement

Planning outdoor events—be it a vacation, a hike, a wedding, or a local parade—months in advance is a gamble against the weather. Standard weather forecasts are only reliable for 1-2 weeks, leaving long-term plans vulnerable to chance. While historical "averages" exist, they are often too generic and don't answer specific, critical questions like:
*   "What's the *actual chance* of a dangerously hot day for my July beach trip?"
*   "I want to go hiking. Which week in September has the highest probability of sunny, cool, and dry weather?"
*   "For my ski trip, should I book the first week of December or the last?"

## Our Solution: WeatherProb

**WeatherProb** is a sophisticated web application that transforms this uncertainty into quantifiable risk. It's not a short-term forecast; it's a powerful **historical odds calculator**. By leveraging decades of NASA's daily global weather data, our application provides statistical probabilities and deep analytical insights for any location on Earth, for any time of the year.

Our mission is to empower users to move beyond guesswork and make data-driven decisions, turning long-term planning from a gamble into a calculated strategy.

---

## Key Features

WeatherProb is a feature-rich platform designed to provide a comprehensive and personalized weather analysis experience.

*   📊 **Single Analysis Dashboard:** The core of the application. Get a detailed breakdown of probabilities, averages, historical records, and trends for a specific location and date range.
*   🤔 **Location Comparison Tool:** Can't decide between two destinations? Analyze two locations side-by-side to see which has the better historical weather for your dates.
*   🏆 **"Perfect Day" Finder:** The ultimate prescriptive tool. Define your ideal weather conditions (e.g., "Sunny," "Not Hot," "No Rain"), and the app will analyze the entire year to recommend the best weeks for your activity.
*   ⚙️ **Personalized Thresholds:** Empower the user by letting them define what "hot," "cold," or "windy" means to them.
*   📈 **Navigable Trend Charts:** Go beyond a single chart. Interactively explore the historical data series for temperature, wind, humidity, precipitation, and more.
*   💾 **Data Export:** Download the summary analysis in JSON or CSV format for your own projects.

---

## Screenshots

*(Replace these with your own high-quality screenshots!)*

| Main Dashboard | Location Comparison |
| :---: | :---: |
| ![Main Dashboard](https://[Link-to-your-main-dashboard-screenshot].png) | ![Location Comparison](https://[Link-to-your-comparison-tool-screenshot].png) |

| Perfect Day Finder | Regional Heatmap |
| :---: | :---: |
| ![Perfect Day Finder](https://[Link-to-your-finder-screenshot].png) | ![Regional Heatmap](https://[Link-to-your-heatmap-screenshot].png) |

---

## Tech Stack

This project is built with a modern, robust, and scalable full-stack architecture.

| Category | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts, Leaflet, Vanta.js |
| **Backend** | Python, Flask, Pandas, NumPy |
| **Data Source** | **NASA POWER API** (Regional & Point-based services) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## Local Development Setup

To run this project locally, follow these steps:

### 1. Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Mohitmhatre32/Weatherprob.git
cd [Weatherprob]/backend

# 2. Create and activate a virtual environment
python -m venv venv
# On Windows:
# .\venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

# 3. Create a requirements.txt file (if you haven't already)
# pip freeze > requirements.txt

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run the Flask server
python app.py
# The backend will be running at http://127.0.0.1:5000
2. Frontend Setup
# 1. Navigate to the frontend directory
cd ../frontend

# 2. Install dependencies
npm install

# 3. Run the Vite development server
npm run dev
# The frontend will be running at http://localhost:5173 (or another port if 5173 is busy)
Data Source

This project is powered exclusively by the NASA POWER (Prediction of Worldwide Energy Resources) Project. This service provides analysis-ready data derived from NASA's state-of-the-art modeling systems, including the foundational MERRA-2 and GEOS-5 datasets.

We utilize both the Daily Point API for single-location analysis and the Daily Regional API for our efficient heatmap feature.

You can explore the data source visually via the NASA POWER Data Access Viewer.

Future Vision

While WeatherProb is a feature-complete application, we have a clear vision for its future:

Regional Polygon Analysis: Allow users to draw a custom shape on the map (e.g., around a national park) to get aggregated stats for that specific area.

Activity-Based Recommendations: A feature where a user can select an activity like "Skiing" or "Beach Day," and the app will automatically apply the best weather criteria to the "Perfect Day Finder."

Public API: Expose our analysis endpoint as a public API to allow other developers to build applications on top of our data processing engine.

About the Challenge

Hackathon: NASA Space Apps Challenge 2025

Challenge Name: "Will It Rain on My Parade?"

Author

Mohit Mhatre & Yukta Chaudhari 

GitHub: https://github.com/Mohitmhatre32

LinkedIn: www.linkedin.com/in/mohitmhatre
