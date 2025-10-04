import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Satellite, Globe, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const DataSources = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Data Sources</h1>
            <p className="text-xl text-muted-foreground">
              Powered by NASA's Earth Observation Systems
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">NASA EarthData</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our application leverages NASA's extensive Earth observation datasets, which represent decades 
                of continuous global weather monitoring. These datasets provide comprehensive coverage of 
                atmospheric conditions, making them ideal for historical probability analysis.
              </p>
            </div>

            {/* Data Sources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-hot rounded-lg flex items-center justify-center mb-4">
                    <Satellite className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>MODIS</CardTitle>
                  <CardDescription>Moderate Resolution Imaging Spectroradiometer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Provides daily global observations of land surface temperature, vegetation, cloud cover, 
                    and aerosols. Essential for understanding temperature patterns and environmental conditions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center mb-4">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>MERRA-2</CardTitle>
                  <CardDescription>Modern-Era Retrospective analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reanalysis dataset providing atmospheric variables including temperature, wind, precipitation, 
                    and humidity with global coverage from 1980 to present.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-rainy rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>GPM</CardTitle>
                  <CardDescription>Global Precipitation Measurement</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Advanced precipitation data from satellite observations, providing detailed rainfall and 
                    snowfall measurements across the globe every 3 hours.
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
                    High-resolution atmospheric data including wind patterns, dust concentrations, and other 
                    meteorological variables crucial for comprehensive weather analysis.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Weather Variables */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Available Weather Variables</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Temperature (surface & air)",
                  "Precipitation (rain & snow)",
                  "Wind Speed & Direction",
                  "Relative Humidity",
                  "Solar Radiation",
                  "Cloud Cover",
                  "Atmospheric Pressure",
                  "Dust & Aerosol Concentration",
                  "Evapotranspiration"
                ].map((variable, index) => (
                  <div key={index} className="bg-muted/30 p-4 rounded-lg border">
                    <p className="font-medium">{variable}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Access */}
            <div className="mt-12 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Data Access & APIs</h3>
              <p className="text-muted-foreground mb-6">
                We utilize several NASA data access tools and APIs to retrieve and process the data:
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span><strong>Giovanni:</strong> Online visualization and analysis tool</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span><strong>OpenDAP:</strong> Direct data access protocol</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  <span><strong>netCDF4:</strong> Data format for array-oriented scientific data</span>
                </li>
              </ul>
              <Button variant="outline">Learn More About Our API</Button>
            </div>

            {/* Data Quality */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Data Quality & Reliability</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                All NASA Earth observation data undergoes rigorous quality control and validation processes. 
                The datasets we use are peer-reviewed, continuously updated, and widely used by the scientific 
                community. Our application applies additional preprocessing steps including outlier detection, 
                spatial interpolation, and temporal smoothing to ensure the highest quality insights.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataSources;
