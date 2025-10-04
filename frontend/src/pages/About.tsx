import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Lightbulb, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About WeatherProb</h1>
            <p className="text-xl text-muted-foreground">
              Empowering better decisions through historical weather probability analysis
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Weather conditions significantly impact outdoor events and activities. While short-term forecasts 
                are readily available, planning months in advance requires understanding historical weather patterns. 
                WeatherProb bridges this gap by leveraging NASA's extensive Earth observation datasets to provide 
                probability-based insights for extreme weather conditions.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">The Problem We Solve</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Traditional weather forecasts are excellent for predicting conditions 1-2 weeks ahead, but they 
                cannot help with long-term planning. Event organizers, outdoor enthusiasts, and businesses need 
                to understand the likelihood of adverse weather conditions when planning months in advance.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                NASA has collected decades of global weather data including temperature, rainfall, wind speed, 
                humidity, snowfall, and dust concentration. WeatherProb makes this data accessible and actionable, 
                calculating probabilities for "very hot," "very cold," "very windy," "very wet," or "very uncomfortable" 
                conditions for any location and date.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-hot rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Data-Driven</h3>
                  <p className="text-muted-foreground">
                    All insights are based on decades of NASA Earth observation data, providing reliable 
                    historical patterns for accurate probability calculations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">User-Centric</h3>
                  <p className="text-muted-foreground">
                    Designed for everyone from event planners to travelers, with intuitive visualizations 
                    that make complex data easy to understand.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-rainy rounded-lg flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Innovative</h3>
                  <p className="text-muted-foreground">
                    Combining statistical analysis, machine learning, and geospatial techniques to provide 
                    cutting-edge weather probability insights.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-windy rounded-lg flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Transparent</h3>
                  <p className="text-muted-foreground">
                    Open about our data sources, methodologies, and confidence levels, ensuring you can 
                    trust and understand our insights.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Technology</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              WeatherProb uses advanced statistical and machine learning techniques to analyze historical 
              weather data:
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                <span><strong>Time Series Analysis:</strong> Identifying seasonal and annual weather patterns</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                <span><strong>Kernel Density Estimation:</strong> Creating smooth probability distributions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                <span><strong>Spatial Analysis:</strong> Precise location-based insights using geospatial techniques</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2"></span>
                <span><strong>Trend Detection:</strong> Revealing climate change impacts on extreme weather</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
