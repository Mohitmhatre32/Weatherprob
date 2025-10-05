# 🌤️ WeatherProb: Historical Weather Probability Insights

> **Plan your future, historically.**  
> An advanced weather analytics dashboard powered by **NASA Earth Observation Data**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)


---

## 🧩 Problem Statement

Planning outdoor events — be it a **vacation**, **hike**, **wedding**, or **local parade** — months in advance is a gamble against the weather.  
Standard weather forecasts are only reliable for a few days, leaving long-term plans uncertain.

While historical averages exist, they rarely answer specific questions like:
- “What’s the *actual chance* of a dangerously hot day for my July beach trip?”
- “Which week in September has the highest probability of sunny, cool, and dry weather?”
- “Should I book my ski trip in early or late December?”

---

## 💡 Our Solution: WeatherProb

**WeatherProb** transforms uncertainty into **quantifiable probability**.

It’s not a forecast — it’s a **historical odds calculator**.  
By analyzing decades of NASA’s daily global weather data, WeatherProb gives you clear, data-backed insights for **any location** and **any time of year**.

Our mission:  
➡️ Empower users to move beyond guesswork and make **data-driven decisions** for long-term planning.

---

## 🚀 Key Features

WeatherProb is packed with tools designed to make weather analysis intuitive and insightful.

- 🌍 **Interactive 3D Globe & Map** — Select any location with ease using **Vanta.js** and **Leaflet**.
- 📊 **Single Analysis Dashboard** — View probabilities, averages, records, and trends in one place.
- ⚖️ **Location Comparison Tool** — Compare two locations side by side for better planning.
- 🏆 **“Perfect Day” Finder** — Define your ideal weather and discover the best dates to plan your activity.
- 🗺️ **High-Performance Heatmap Explorer** — Visualize global weather probability hotspots.
- ⚙️ **Personalized Thresholds** — Customize what “hot,” “cold,” or “windy” means for you.
- 📈 **Interactive Trend Charts** — Explore long-term data for temperature, humidity, and precipitation.
- 💾 **Data Export** — Download your analysis as **JSON** or **CSV** for external use.

---

## 🧱 Tech Stack

| Category | Technologies |
| :-- | :-- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts, Leaflet, Vanta.js |
| **Backend** | Python, Flask, Pandas, NumPy |
| **Data Source** | NASA POWER API (Daily Point & Regional Services) |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🧑‍💻 Local Development Setup

### 1️⃣ Backend Setup

```bash
# Clone the repository
git clone https://github.com/Mohitmhatre32/Weatherprob.git
cd Weatherprob/backend

# Create a virtual environment
python -m venv venv

# Activate it
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
# Backend runs at http://127.0.0.1:5000



# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Run the Vite dev server
npm run dev
# Frontend runs at http://localhost:5173


```

☀️ Data Source

This project uses the NASA POWER (Prediction of Worldwide Energy Resources) API.
It provides global, analysis-ready data derived from NASA’s MERRA-2 and GEOS-5 datasets.

We use:

Daily Point API for single-location analysis

Daily Regional API for generating the global heatmap feature

🔗 Explore the data source: NASA POWER Data Access Viewer

🔮 Future Vision

WeatherProb’s roadmap includes exciting next steps:

   🗺️ Regional Polygon Analysis — Draw areas on the map to aggregate weather stats.
   
   🎯 Activity-Based Recommendations — Automatically find the best dates for skiing, hiking, or beach days.
   
   🔗 Public API — Expose the analysis engine to developers for open data use.
   
🧠 About the Challenge : 
   
   Hackathon: NASA Space Apps Challenge 2025
   
   Challenge Name: “Will It Rain on My Parade?”

👥 Authors

Mohit Mhatre

GitHub: https://github.com/Mohitmhatre32

LinkedIn: www.linkedin.com/in/mohitmhatre

Yukta Chaudhari

GitHub: https://github.com/yuktac1011

LinkedIn:https://www.linkedin.com/in/yukta-chaudhari-725065303/

🪪 License

This project is licensed under the MIT License
.
Feel free to use, modify, and share — just credit the authors.