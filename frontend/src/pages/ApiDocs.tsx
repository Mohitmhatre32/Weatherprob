import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Key, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const ApiDocs = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">API Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Integrate weather probability data into your applications
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Quick Start */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-hot rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Getting Started</h2>
              </div>
              <Card className="border-2">
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">
                    The WeatherProb API provides programmatic access to historical weather probability data. 
                    Get started in minutes with our RESTful API.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                    <p className="text-primary">Base URL:</p>
                    <p className="mt-2">https://api.weatherprob.com/v1</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Authentication */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-cold rounded-lg flex items-center justify-center">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Authentication</h2>
              </div>
              <Card className="border-2">
                <CardContent className="p-6 space-y-4">
                  <p className="text-muted-foreground">
                    All API requests require authentication using an API key. Include your key in the request header:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-2">
                    <p className="text-muted-foreground">// Request Header</p>
                    <p>Authorization: Bearer YOUR_API_KEY</p>
                  </div>
                  <Button>Get Your API Key</Button>
                </CardContent>
              </Card>
            </div>

            {/* Endpoints */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-rainy rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">API Endpoints</h2>
              </div>

              <Tabs defaultValue="probability" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="probability">Probability</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="variables">Variables</TabsTrigger>
                </TabsList>

                <TabsContent value="probability" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Get Weather Probability</CardTitle>
                      <CardDescription>
                        <span className="inline-block bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-mono mr-2">
                          GET
                        </span>
                        /probability
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Query Parameters</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex gap-4 p-2 bg-muted/30 rounded">
                            <code className="text-primary font-mono">latitude</code>
                            <span className="text-muted-foreground">Required. Latitude coordinate (-90 to 90)</span>
                          </div>
                          <div className="flex gap-4 p-2 bg-muted/30 rounded">
                            <code className="text-primary font-mono">longitude</code>
                            <span className="text-muted-foreground">Required. Longitude coordinate (-180 to 180)</span>
                          </div>
                          <div className="flex gap-4 p-2 bg-muted/30 rounded">
                            <code className="text-primary font-mono">start_date</code>
                            <span className="text-muted-foreground">Required. Start date (YYYY-MM-DD)</span>
                          </div>
                          <div className="flex gap-4 p-2 bg-muted/30 rounded">
                            <code className="text-primary font-mono">end_date</code>
                            <span className="text-muted-foreground">Required. End date (YYYY-MM-DD)</span>
                          </div>
                          <div className="flex gap-4 p-2 bg-muted/30 rounded">
                            <code className="text-primary font-mono">variables</code>
                            <span className="text-muted-foreground">Optional. Comma-separated weather variables</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Example Request</h4>
                        <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                          <pre>{`GET /v1/probability?
  latitude=40.7128&
  longitude=-74.0060&
  start_date=2024-06-01&
  end_date=2024-06-30&
  variables=temperature,precipitation`}</pre>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Example Response</h4>
                        <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                          <pre>{`{
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "period": {
    "start": "2024-06-01",
    "end": "2024-06-30"
  },
  "probabilities": {
    "extreme_heat": 0.15,
    "heavy_rain": 0.23,
    "strong_wind": 0.08
  },
  "confidence": 0.89
}`}</pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="trends">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Get Climate Trends</CardTitle>
                      <CardDescription>
                        <span className="inline-block bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-mono mr-2">
                          GET
                        </span>
                        /trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Retrieve long-term climate trend data showing how weather patterns have changed over time.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="location">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Location Search</CardTitle>
                      <CardDescription>
                        <span className="inline-block bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-mono mr-2">
                          GET
                        </span>
                        /location/search
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Search for locations by name and get coordinates for weather probability queries.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="variables">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Available Variables</CardTitle>
                      <CardDescription>
                        <span className="inline-block bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-mono mr-2">
                          GET
                        </span>
                        /variables
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Get a list of all available weather variables and their descriptions.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Rate Limits */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-windy rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Rate Limits & Best Practices</h2>
              </div>
              <Card className="border-2">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Rate Limits</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Free tier: 100 requests per day</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Pro tier: 10,000 requests per day</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Enterprise: Custom limits available</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Best Practices</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Cache responses when possible to reduce API calls</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Use batch requests for multiple locations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span>Implement exponential backoff for retries</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApiDocs;
