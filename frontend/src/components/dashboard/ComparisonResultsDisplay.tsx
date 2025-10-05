

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeatherStats } from "@/types/weather";
import { cn } from "@/lib/utils";

interface ComparisonResultsDisplayProps {
    resultsA: WeatherStats;
    resultsB: WeatherStats;
}

const ComparisonRow = ({ label, valueA, valueB, unit = "", lowerIsBetter = false }) => {
    const isBetterA = lowerIsBetter ? valueA < valueB : valueA > valueB;
    const isBetterB = lowerIsBetter ? valueB < valueA : valueB > valueA;

    const highlightA = valueA !== valueB && isBetterA;
    const highlightB = valueA !== valueB && isBetterB;

    return (
        <div className="grid grid-cols-3 items-center py-3 border-b last:border-b-0">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className={cn("text-center font-bold text-lg", highlightA && "text-green-600")}>{valueA}{unit}</span>
            <span className={cn("text-center font-bold text-lg", highlightB && "text-green-600")}>{valueB}{unit}</span>
        </div>
    );
};

const ComparisonResultsDisplay = ({ resultsA, resultsB }: ComparisonResultsDisplayProps) => {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Comparison Results</CardTitle>
                <CardDescription>
                    Key metrics are compared side-by-side. The better option for each metric is highlighted in green.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 pb-2 border-b-2">
                    <span className="text-sm font-semibold">Metric</span>
                    <span className="text-center text-sm font-semibold">Scenario A</span>
                    <span className="text-center text-sm font-semibold">Scenario B</span>
                </div>
                <div>
                    <ComparisonRow label="Avg. High / Feels Like" valueA={`${resultsA.averages.avg_high_f}/${resultsA.averages.avg_heat_index_f}`} valueB={`${resultsB.averages.avg_high_f}/${resultsB.averages.avg_heat_index_f}`} unit="°F" />
                    <ComparisonRow label="Chance of Uncomfortable Day" valueA={resultsA.probabilities.uncomfortable} valueB={resultsB.probabilities.uncomfortable} unit="%" lowerIsBetter />
                    <ComparisonRow label="Chance of Wet Day" valueA={resultsA.probabilities.wet} valueB={resultsB.probabilities.wet} unit="%" lowerIsBetter />
                    <ComparisonRow label="Chance of Cold Day" valueA={resultsA.probabilities.cold} valueB={resultsB.probabilities.cold} unit="%" lowerIsBetter />
                    <ComparisonRow label="Chance of Sunny Day" valueA={resultsA.probabilities.sunny} valueB={resultsB.probabilities.sunny} unit="%" />
                    <ComparisonRow label="Record High" valueA={resultsA.records.record_high_f} valueB={resultsB.records.record_high_f} unit="°F" lowerIsBetter />
                    <ComparisonRow label="Temp Trend" valueA={resultsA.trend.temp_trend_label} valueB={resultsB.trend.temp_trend_label} />
                </div>
            </CardContent>
        </Card>
    );
};

export default ComparisonResultsDisplay;