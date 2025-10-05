import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";

interface DateRangeSelectorProps {
    value: DateRange | undefined;
    onDateChange: (range: DateRange | undefined) => void;
}

const months = [
    { name: "Jan", value: 0 }, { name: "Feb", value: 1 }, { name: "Mar", value: 2 },
    { name: "Apr", value: 3 }, { name: "May", value: 4 }, { name: "Jun", value: 5 },
    { name: "Jul", value: 6 }, { name: "Aug", value: 7 }, { name: "Sep", value: 8 },
    { name: "Oct", value: 9 }, { name: "Nov", value: 10 }, { name: "Dec", value: 11 },
];

const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const DateRangeSelector = ({ value, onDateChange }: DateRangeSelectorProps) => {
    const fromMonth = value?.from?.getMonth();
    const fromDay = value?.from?.getDate();
    const toMonth = value?.to?.getMonth();
    const toDay = value?.to?.getDate();

    // Use a fixed year (e.g., a leap year) for calculations to keep it simple
    const year = 2024;

    const handleFromMonthChange = (monthStr: string) => {
        const month = parseInt(monthStr, 10);
        const day = fromDay || 1;
        const daysInNewMonth = getDaysInMonth(month, year);
        const newDay = Math.min(day, daysInNewMonth);
        const newFrom = new Date(year, month, newDay);
        onDateChange({ from: newFrom, to: value?.to });
    };

    const handleFromDayChange = (dayStr: string) => {
        if (fromMonth === undefined) return;
        const day = parseInt(dayStr, 10);
        const newFrom = new Date(year, fromMonth, day);
        onDateChange({ from: newFrom, to: value?.to });
    };

    const handleToMonthChange = (monthStr: string) => {
        const month = parseInt(monthStr, 10);
        const day = toDay || 1;
        const daysInNewMonth = getDaysInMonth(month, year);
        const newDay = Math.min(day, daysInNewMonth);
        const newTo = new Date(year, month, newDay);
        onDateChange({ from: value?.from, to: newTo });
    };

    const handleToDayChange = (dayStr: string) => {
        if (toMonth === undefined) return;
        const day = parseInt(dayStr, 10);
        const newTo = new Date(year, toMonth, day);
        onDateChange({ from: value?.from, to: newTo });
    };

    const fromDaysInMonth = fromMonth !== undefined ? getDaysInMonth(fromMonth, year) : 0;
    const toDaysInMonth = toMonth !== undefined ? getDaysInMonth(toMonth, year) : 0;

    return (
        <div className="space-y-4">
            <div>
                <p className="text-sm font-medium mb-2">From</p>
                <div className="flex gap-2">
                    <Select onValueChange={handleFromMonthChange} value={fromMonth?.toString()}>
                        <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                        <SelectContent>
                            {months.map(m => <SelectItem key={m.value} value={m.value.toString()}>{m.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={handleFromDayChange} value={fromDay?.toString()} disabled={fromMonth === undefined}>
                        <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: fromDaysInMonth }, (_, i) => i + 1).map(d => <SelectItem key={d} value={d.toString()}>{d}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <p className="text-sm font-medium mb-2">To</p>
                <div className="flex gap-2">
                    <Select onValueChange={handleToMonthChange} value={toMonth?.toString()}>
                        <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                        <SelectContent>
                            {months.map(m => <SelectItem key={m.value} value={m.value.toString()}>{m.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={handleToDayChange} value={toDay?.toString()} disabled={toMonth === undefined}>
                        <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: toDaysInMonth }, (_, i) => i + 1).map(d => <SelectItem key={d} value={d.toString()}>{d}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default DateRangeSelector;