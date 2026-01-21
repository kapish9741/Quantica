
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
    date?: Date;
    setDate: (date: Date) => void;
    className?: string;
}

export function DateTimePicker({ date, setDate, className }: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);

    // Sync internal state if prop changes
    React.useEffect(() => {
        setSelectedDate(date);
    }, [date]);

    const handleDateSelect = (newDate: Date | undefined) => {
        if (newDate) {
            if (selectedDate) {
                // Preserve time from current selection
                newDate.setHours(selectedDate.getHours());
                newDate.setMinutes(selectedDate.getMinutes());
            }
            setSelectedDate(newDate);
            setDate(newDate);
        }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = e.target.value;
        if (!time) return;
        const [hours, minutes] = time.split(":").map(Number);
        const newDate = new Date(selectedDate || new Date());
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        setSelectedDate(newDate);
        setDate(newDate);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] justify-start text-left font-normal h-8 text-xs",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {date ? format(date, "PPP p") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                />
                <div className="p-3 border-t border-border">
                    <input
                        type="time"
                        className="w-full bg-background border border-input rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={selectedDate ? format(selectedDate, "HH:mm") : ""}
                        onChange={handleTimeChange}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
