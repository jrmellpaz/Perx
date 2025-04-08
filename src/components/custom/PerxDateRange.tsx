'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Label } from '../ui/label';

export default function PerxDateRange({
  value,
  onChange,
}: {
  value: { start: string | null; end: string | null }; // Accept strings or null
  onChange: (value: { start: string | null; end: string | null }) => void; // Pass strings or null
}) {
  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

  return (
    <div className="mt-2 flex w-full flex-col gap-4 sm:flex-row">
      <div className="group relative transition-all">
        <Label
          htmlFor="startDate"
          className="text-muted-foreground/70 group-focus-within:text-perx-blue bg-background absolute -top-2 z-[1] ml-2 px-1 font-mono text-xs font-medium"
        >
          <span>Select start date</span>
        </Label>
        <DatePicker
          id="startDate"
          selected={value.start ? new Date(value.start) : null} // Convert string to Date
          onChange={(date) =>
            onChange({
              ...value,
              start: date ? date.toISOString() : null, // Convert Date to ISO string
            })
          }
          selectsStart
          startDate={value.start ? new Date(value.start) : null}
          endDate={value.end ? new Date(value.end) : null}
          minDate={today} // Prevent selecting dates before today
          className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-perx-blue flex h-12 w-max rounded-lg border-2 px-3 py-2 text-sm transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholderText="MM/DD/YYYY"
        />
      </div>
      <div className="group relative transition-all">
        <Label
          htmlFor="endDate"
          className="text-muted-foreground/70 group-focus-within:text-perx-blue bg-background absolute -top-2 z-[1] ml-2 px-1 font-mono text-xs font-medium"
        >
          <span>Select end date</span>
        </Label>
        <DatePicker
          id="endDate"
          selected={value.end ? new Date(value.end) : null} // Convert string to Date
          onChange={(date) =>
            onChange({
              ...value,
              end: date ? date.toISOString() : null, // Convert Date to ISO string
            })
          }
          selectsEnd
          startDate={value.start ? new Date(value.start) : null}
          endDate={value.end ? new Date(value.end) : null}
          minDate={value.start ? new Date(value.start) : today} // Prevent selecting dates before the start date or today
          className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-perx-blue flex h-12 w-full rounded-lg border-2 px-3 py-2 text-sm transition-all focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholderText="MM/DD/YYYY"
        />
      </div>
    </div>
  );
}
