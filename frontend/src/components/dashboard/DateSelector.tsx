import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateSelectorProps {
  value: Date | null;
  onDateChange: (date: Date | null) => void;
}

const months = [
  { name: "January", days: 31 }, { name: "February", days: 29 }, { name: "March", days: 31 },
  { name: "April", days: 30 }, { name: "May", days: 31 }, { name: "June", days: 30 },
  { name: "July", days: 31 }, { name: "August", days: 31 }, { name: "September", days: 30 },
  { name: "October", days: 31 }, { name: "November", days: 30 }, { name: "December", days: 31 },
];

const DateSelector = ({ value, onDateChange }: DateSelectorProps) => {
  const selectedMonth = value ? value.getMonth() : undefined;
  const selectedDay = value ? value.getDate() : undefined;

  const handleMonthChange = (monthIndexStr: string) => {
    const monthIndex = parseInt(monthIndexStr, 10);
    const currentDay = selectedDay || 1;
    const newDay = Math.min(currentDay, months[monthIndex].days);
    onDateChange(new Date(2000, monthIndex, newDay)); // Year is arbitrary for month/day selection
  };

  const handleDayChange = (dayStr: string) => {
    if (selectedMonth !== undefined) {
      onDateChange(new Date(2000, selectedMonth, parseInt(dayStr, 10)));
    }
  };

  const daysInSelectedMonth = selectedMonth !== undefined ? months[selectedMonth].days : 0;

  return (
    <div className="flex gap-4">
      <Select onValueChange={handleMonthChange} value={selectedMonth?.toString()}>
        <SelectTrigger>
          <SelectValue placeholder="Select Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={month.name} value={index.toString()}>{month.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleDayChange} value={selectedDay?.toString()} disabled={selectedMonth === undefined}>
        <SelectTrigger>
          <SelectValue placeholder="Select Day" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1).map(day => (
            <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DateSelector;