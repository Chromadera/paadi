"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

const DAY_CHIPS = [
  { label: "+1 day",   days: 1  },
  { label: "+3 days",  days: 3  },
  { label: "+7 days",  days: 7  },
  { label: "+14 days", days: 14 },
  { label: "+30 days", days: 30 },
];

const TIME_CHIPS = [
  { label: "9 AM",      hour: 9  },
  { label: "12 PM",     hour: 12 },
  { label: "6 PM",      hour: 18 },
  { label: "11:59 PM",  hour: 23 },
];

interface DeadlinePickerProps {
  value: string;           // ISO string or ""
  onChange: (iso: string) => void;
  disabled?: boolean;
}

export function DeadlinePicker({ value, onChange, disabled }: DeadlinePickerProps) {
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  const [selectedHour, setSelectedHour] = useState<number>(23); // default end of day

  // Sync back to parent whenever either changes
  useEffect(() => {
    if (selectedDays === null) return;
    const date = new Date();
    date.setDate(date.getDate() + selectedDays);
    date.setHours(selectedHour, selectedHour === 23 ? 59 : 0, 0, 0);
    onChange(date.toISOString());
  }, [selectedDays, selectedHour]);

  // Derive display string from current value
  const displayDate = value
    ? new Date(value).toLocaleDateString("en-NG", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const displayTime = value
    ? new Date(value).toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-[10px] font-extrabold uppercase tracking-wider text-ink/40 px-1 flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        Collection Deadline
        <span className="normal-case font-semibold text-ink/30 ml-1">(optional)</span>
      </label>

      {/* Selected deadline display */}
      {value && (
        <div className="flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-2xl px-4 py-3">
          <div className="flex flex-col flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink/40">
              Deadline set for
            </span>
            <span className="text-sm font-black text-ink mt-0.5">
              {displayDate}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/60 rounded-xl px-3 py-1.5 border border-ink/8">
            <Clock className="h-3 w-3 text-ink/40" />
            <span className="text-xs font-bold text-ink">{displayTime}</span>
          </div>
        </div>
      )}

      {/* Day chips */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-ink/30 px-1 uppercase tracking-wider">
          Close in
        </span>
        <div className="flex gap-2 flex-wrap">
          {DAY_CHIPS.map((chip) => {
            const isSelected = selectedDays === chip.days;
            return (
              <button
                key={chip.days}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedDays(chip.days)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border-2 transition-all active:scale-95 select-none
                  ${isSelected
                    ? "bg-primary border-ink text-ink shadow-[2px_2px_0px_0px_#111827]"
                    : "bg-surface border-ink/12 text-ink/50 hover:border-ink/30 hover:text-ink"
                  }
                `}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time chips — only show once a day is selected */}
      {selectedDays !== null && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-ink/30 px-1 uppercase tracking-wider flex items-center gap-1">
            <Clock className="h-3 w-3" />
            At what time
          </span>
          <div className="flex gap-2 flex-wrap">
            {TIME_CHIPS.map((chip) => {
              const isSelected = selectedHour === chip.hour;
              return (
                <button
                  key={chip.hour}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedHour(chip.hour)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border-2 transition-all active:scale-95 select-none
                    ${isSelected
                      ? "bg-ink text-bg border-ink"
                      : "bg-surface border-ink/12 text-ink/50 hover:border-ink/30 hover:text-ink"
                    }
                  `}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Clear */}
      {value && (
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setSelectedDays(null);
            setSelectedHour(23);
            onChange("");
          }}
          className="self-start text-[11px] font-bold text-ink/35 hover:text-danger transition-colors px-1"
        >
          Clear deadline
        </button>
      )}
    </div>
  );
}