import { Button } from "@/components/ui/button";
import { Cloud, CloudRain, Wind, Sun, Snowflake, TrendingUp, Map, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        {/* Animated background icons */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <Cloud className="absolute top-20 left-10 w-20 h-20 text-primary animate-float" />
          <CloudRain className="absolute top-40 right-20 w-16 h-16 text-primary animate-float" style={{ animationDelay: "0.5s" }} />
          <Wind className="absolute bottom-40 left-1/4 w-24 h-24 text-primary animate-float" style={{ animationDelay: "1s" }} />
          <Sun className="absolute top-1/3 right-1/4 w-28 h-28 text-primary animate-float" style={{ animationDelay: "1.5s" }} />
          <Snowflake className="absolute bottom-20 right-1/3 w-20 h-20 text-primary animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 z-10">
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
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for weather probability analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-hot rounded-full flex items-center justify-center mb-6">
                <Sun className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Historical Data</h3>
              <p className="text-muted-foreground">
                Access decades of NASA Earth observation data for accurate weather probability predictions based on long-term trends.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-cold rounded-full flex items-center justify-center mb-6">
                <Cloud className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Multiple Variables</h3>
              <p className="text-muted-foreground">
                Analyze temperature, precipitation, wind speed, humidity, snowfall, and solar radiation all in one place.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-rainy rounded-full flex items-center justify-center mb-6">
                <CloudRain className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Smart Visualizations</h3>
              <p className="text-muted-foreground">
                Interactive charts, maps, and trend analysis provide clear insights for better decision-making.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-windy rounded-full flex items-center justify-center mb-6">
                <Map className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Interactive Maps</h3>
              <p className="text-muted-foreground">
                Select any location globally with pin-point accuracy or draw custom boundaries for regional analysis.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-neutral rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Trend Analysis</h3>
              <p className="text-muted-foreground">
                Detect climate change impacts with trend detection showing increasing or decreasing weather risks over time.
              </p>
            </div>

            <div className="bg-card p-8 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-hot rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Data Export</h3>
              <p className="text-muted-foreground">
                Download your analysis data with complete metadata in CSV or JSON format for further processing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
