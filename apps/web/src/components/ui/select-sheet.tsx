"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { BottomSheet } from "./bottom-sheet";

export type SelectOption = {
  label: string;
  value: string;
  sublabel?: string;
};

interface SelectSheetProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export function SelectSheet({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  disabled,
  loading,
}: SelectSheetProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink/40 px-1">
          {label}
        </span>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && !loading && setOpen(true)}
        disabled={disabled || loading}
        className={`w-full flex items-center justify-between gap-3 bg-surface border-2 rounded-xl px-4 py-3.5 text-left transition-all
          ${selected ? "border-ink text-ink" : "border-ink/20 text-ink/35"}
          ${disabled || loading ? "opacity-50 cursor-not-allowed" : "active:scale-[0.98] cursor-pointer"}
          shadow-sm
        `}
      >
        <span className="text-sm font-semibold truncate">
          {loading ? "Loading..." : selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 stroke-2 transition-transform text-ink/40 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Sheet */}
      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={label}
      >
        <div className="flex flex-col gap-1 pt-1">
          {options.length === 0 && (
            <p className="text-center text-sm text-ink/40 py-8 font-semibold">
              No options available
            </p>
          )}
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl text-left transition-all active:scale-[0.98]
                  ${isSelected
                    ? "bg-primary/10 border-2 border-primary/30"
                    : "bg-surface border-2 border-transparent hover:border-ink/8 hover:bg-ink/3"
                  }
                `}
              >
                <div className="flex flex-col">
                  <span className={`text-sm font-bold ${isSelected ? "text-ink" : "text-ink"}`}>
                    {option.label}
                  </span>
                  {option.sublabel && (
                    <span className="text-[11px] font-semibold text-ink/40 mt-0.5">
                      {option.sublabel}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-ink stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>
    </div>
  );
}