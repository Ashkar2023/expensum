import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type MonthPickerProps = {
    onChange: (date: Date | undefined) => void;
    date: Date | undefined;
};

export function MonthPicker({ date, onChange }: MonthPickerProps) {
    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    variant="outline"
                    className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={undefined} // Prevents selecting specific days
                    onMonthChange={onChange} // Updates month selection
                    captionLayout="dropdown" // Enables month dropdown
                    fromYear={2020}
                    toYear={2030}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
