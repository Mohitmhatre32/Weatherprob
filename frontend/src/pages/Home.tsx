// src/pages/Home.tsx

import { Button } from "@/components/ui/button";
// Your original icons are all here
import { Cloud, CloudRain, Wind, Sun, Snowflake, TrendingUp, Map, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from "three";
import "../index.css"; // Ensure global styles are imported

// This custom hook correctly and dynamically imports the Vanta library for Vite.
// This is the only "new" code, and it's self-contained.
const useVanta = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect) {
      import("vanta/dist/vanta.globe.min")
        .then((vantaModule) => {
          const GLOBE = vantaModule.default;
          if (vantaRef.current) {
            const effect = GLOBE({
              el: vantaRef.current,
              THREE: THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              color: '#0ea5e9',
              backgroundColor: '#f8fafc',
              size: 1.2,
            });
            setVantaEffect(effect);
          }
        })
        .catch(error => {
          console.error("Vanta script loading failed:", error);
        });
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return vantaRef;
};

const Home = () => {
  // Activate the 3D globe effect
  const vantaRef = useVanta();

  return (
    <div className="min-h-screen">
      {/* ==================================================================== */}
      {/*                 HERO SECTION - ONLY CHANGE IS HERE                 */}
      {/* ==================================================================== */}
      <section ref={vantaRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* The static 2D icons div has been REMOVED. */}
        {/* The ref on the <section> tag now applies the 3D globe as the background. */}

        <div className="container mx-auto px-4 z-10">
          {/* All your original hero content is preserved exactly. */}
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-slide-up">
                Weather Probability Insights
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
                Discover historical weather patterns using NASA Earth Observation Data
              </p>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
              Plan your outdoor activities with confidence. Get probability insights for extreme weather conditions at any location, any time of year.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Started
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/*          FEATURES SECTION - YOUR ORIGINAL CONTENT AND LAYOUT         */}
      {/* ==================================================================== */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for weather probability analysis
            </p>
          </div>
          
          {/* Your original 3-column grid is preserved exactly. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-hot rounded-full flex items-center justify-center mb-6"><Sun className="w-7 h-7 text-white" /></div>
              <h3 className="font-semibold text-xl mb-3">Historical Data</h3>
              <p className="text-muted-foreground">Access decades of NASA Earth observation data for accurate weather probability predictions based on long-term trends.</p>
            </div>
            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-cold rounded-full flex items-center justify-center mb-6"><Cloud className="w-7 h-7 text-white" /></div>
              <h3 className="font-semibold text-xl mb-3">Multiple Variables</h3>
              <p className="text-muted-foreground">Analyze temperature, precipitation, wind speed, humidity, snowfall, and solar radiation all in one place.</p>
            </div>
            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-rainy rounded-full flex items-center justify-center mb-6"><CloudRain className="w-7 h-7 text-white" /></div>
              <h3 className="font-semibold text-xl mb-3">Smart Visualizations</h3>
              <p className="text-muted-foreground">Interactive charts, maps, and trend analysis provide clear insights for better decision-making.</p>
            </div>
            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-windy rounded-full flex items-center justify-center mb-6"><Map className="w-7 h-7 text-white" /></div>
              <h3 className="font-semibold text-xl mb-3">Interactive Maps</h3>
              <p className="text-muted-foreground">Select any location globally with pin-point accuracy or draw custom boundaries for regional analysis.</p>
            </div>
            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-neutral rounded-full flex items-center justify-center mb-6"><TrendingUp className="w-7 h-7 text-white" /></div>
              <h3 className="font-semibold text-xl mb-3">Trend Analysis</h3>
              <p className="text-muted-foreground">Detect climate change impacts with trend detection showing increasing or decreasing weather risks over time.</p>
            </div>
            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-hot rounded-full flex items-center justify-center mb-6"><BarChart3 className="w-7 h-7 text-white" /></div>
              <h3 className="font-semibold text-xl mb-3">Data Export</h3>
              <p className="text-muted-foreground">Download your analysis data with complete metadata in CSV or JSON format for further processing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Your original CTA section is preserved exactly. */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start analyzing weather probabilities today with our powerful dashboard and NASA data.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;