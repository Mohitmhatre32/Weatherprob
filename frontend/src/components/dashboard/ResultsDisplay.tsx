import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import type { WeatherTheme } from "@/types/weather";

interface ResultsDisplayProps {
  type: "overview" | "probabilities" | "trends" | "comparison";
  theme: WeatherTheme;
}

const ResultsDisplay = ({ type, theme }: ResultsDisplayProps) => {
  const getGradientClass = () => {
    const gradients = {
      hot: "bg-gradient-hot",
      cold: "bg-gradient-cold",
      rainy: "bg-gradient-rainy",
      windy: "bg-gradient-windy",
      neutral: "bg-gradient-neutral",
    };
    return gradients[theme];
  };

  if (type === "overview") {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Summary Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Weather Analysis Summary</CardTitle>
            <CardDescription>Based on NASA Earth Observation historical data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`h-48 rounded-lg ${getGradientClass()} flex items-center justify-center text-white mb-6`}>
              <div className="text-center">
                <h3 className="text-4xl font-bold mb-2">Select Parameters</h3>
                <p className="text-lg opacity-90">Choose location, dates, and variables to begin analysis</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">--</div>
                <div className="text-sm text-muted-foreground mt-1">Avg Temp</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">--</div>
                <div className="text-sm text-muted-foreground mt-1">Risk Level</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">--</div>
                <div className="text-sm text-muted-foreground mt-1">Data Points</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">--</div>
                <div className="text-sm text-muted-foreground mt-1">Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <CardTitle className="text-lg">Favorable Conditions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Analysis will show days with optimal weather conditions for outdoor activities.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <CardTitle className="text-lg">Risk Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get notified about potential extreme weather probabilities based on historical patterns.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (type === "probabilities") {
    return (
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Weather Probability Analysis</CardTitle>
          <CardDescription>Statistical likelihood of extreme conditions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Extreme Heat Probability</span>
              <span className="text-sm text-muted-foreground">--</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Heavy Rainfall Probability</span>
              <span className="text-sm text-muted-foreground">--</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Strong Wind Probability</span>
              <span className="text-sm text-muted-foreground">--</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>

          <div className="p-4 bg-muted/50 rounded-lg mt-6">
            <p className="text-sm text-muted-foreground text-center">
              Select location, dates, and weather variables to view probability analysis
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === "trends") {
    return (
      <Card className="shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Climate Trend Analysis</CardTitle>
          <CardDescription>Long-term weather pattern changes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Trend visualization will appear here</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Increasing Trends</span>
              </div>
              <p className="text-xs text-muted-foreground">Climate patterns showing upward movement</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Decreasing Trends</span>
              </div>
              <p className="text-xs text-muted-foreground">Climate patterns showing downward movement</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle>Location Comparison</CardTitle>
        <CardDescription>Compare weather patterns across multiple locations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Add locations to compare weather patterns</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
