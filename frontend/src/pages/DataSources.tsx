
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, TrendingUp, Code, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

const DataSources = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Data Pipeline</h1>
            <p className="text-xl text-muted-foreground">
              Leveraging NASA's Analysis-Ready Data for Actionable Insights
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">The NASA POWER Project</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our application is built on the NASA Prediction of Worldwide Energy Resources (POWER) project. 
                POWER provides analysis-ready data specifically tailored for developers and researchers,
                acting as a streamlined gateway to NASA's vast repository of Earth observation data. 
                This allows us to perform complex historical analysis efficiently and accurately.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-center">Core Underlying Datasets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mb-4">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>MERRA-2</CardTitle>
                  <CardDescription>Modern-Era Retrospective analysis for Research and Applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    A global atmospheric reanalysis dataset providing key variables like temperature, wind, and precipitation. 
                    It serves as a primary foundational source for the POWER project's data.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-windy rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>GEOS-5</CardTitle>
                  <CardDescription>Goddard Earth Observing System</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    A high-resolution atmospheric model that provides the data for many of the near real-time 
                    parameters available through the POWER API, ensuring timely and accurate information.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Weather Variables Analyzed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Max/Min Temperature", "Precipitation (Rain)", "Snowfall", "Wind Speed",
                  "Relative Humidity", "Sunlight (Insolation)", "Atmospheric Pressure", "Heat Index ('Feels Like')"
                ].map((variable, index) => (
                  <div key={index} className="bg-muted/30 p-4 rounded-lg border">
                    <p className="font-medium">{variable}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Explore the Data Source</h3>
              <p className="text-muted-foreground mb-6">
                While we use the POWER API for programmatic access, the best way to explore the data visually is through NASA's official Data Access Viewer.
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Map className="w-5 h-5 text-primary" />
                  </div>
                  <span><strong>Interactive Map:</strong> Visualize the datasets and select points to retrieve data manually.</span>
                </li>
              </ul>
              
              {/* --- THIS IS THE VERIFIED, CORRECT, AND MOST APPROPRIATE LINK --- */}
              <Button variant="outline" asChild>
                <a href="https://power.larc.nasa.gov/data-access-viewer/" target="_blank" rel="noopener noreferrer">
                  Explore the NASA POWER Data Portal
                </a>
              </Button>
              {/* ------------------------------------------------------------------ */}

            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Data Quality & Processing</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The NASA POWER data is already rigorously quality-controlled and validated. 
                Our application builds upon this by performing on-the-fly analysis using Python and the Pandas library. 
                For each user query, we fetch decades of data, filter it to the specific day of the year, 
                perform unit conversions, and calculate statistical probabilities to provide actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataSources;