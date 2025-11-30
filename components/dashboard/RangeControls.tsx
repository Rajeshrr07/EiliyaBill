"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type RangeKey = "today" | "yesterday" | "last7";
type CompareKey = "none" | "yesterday";

export function RangeControls({
  date,
  setDate,
}: {
  date: Date;
  setDate: (d: Date) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Date:</span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-full px-3 bg-transparent cursor-pointer text-sm"
            >
              {new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(date)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d);
                  setOpen(false);
                }
              }}
              className="rounded-md cursor-pointer"
              initialFocus
              disabled={(date) =>
                date > new Date() || date < new Date(2023, 0, 1)
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
