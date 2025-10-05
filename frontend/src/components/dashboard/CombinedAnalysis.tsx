import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const factors = [
    { id: "hot", label: "Hot" },
    { id: "cold", label: "Cold" },
    { id: "windy", label: "Windy" },
    { id: "wet", label: "Wet" },
    { id: "humid", label: "Humid" },
    { id: "sunny", label: "Sunny" },
];

interface CombinedAnalysisProps {
    selectedFactors: string[];
    onSelectionChange: (selected: string[]) => void;
}

const CombinedAnalysis = ({ selectedFactors, onSelectionChange }: CombinedAnalysisProps) => {
    const handleCheckedChange = (factorId: string, checked: boolean | "indeterminate") => {
        if (checked) {
            onSelectionChange([...selectedFactors, factorId]);
        } else {
            onSelectionChange(selectedFactors.filter((id) => id !== factorId));
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {factors.map((factor) => (
                <div key={factor.id} className="flex items-center space-x-2">
                    <Checkbox
                        id={factor.id}
                        checked={selectedFactors.includes(factor.id)}
                        onCheckedChange={(checked) => handleCheckedChange(factor.id, checked)}
                    />
                    <Label htmlFor={factor.id} className="text-sm font-medium leading-none cursor-pointer">
                        {factor.label}
                    </Label>
                </div>
            ))}
        </div>
    );
};

export default CombinedAnalysis;