"use client";

import { cn } from "@/lib/utils";
import type { TimerMode } from "@/types";

interface ModeSelectorProps {
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
  disabled?: boolean;
}

const modes: { value: TimerMode; label: string; description: string }[] = [
  { value: "pomodoro", label: "Pomodoro", description: "25 min work / 5 min break" },
  { value: "deepFocus", label: "Deep Focus", description: "90 min uninterrupted" },
  { value: "custom", label: "Custom", description: "Set your own duration" },
];

export function ModeSelector({
  mode,
  onModeChange,
  disabled,
}: ModeSelectorProps) {
  return (
    <div className="flex gap-2">
      {modes.map(({ value, label, description }) => (
        <button
          key={value}
          onClick={() => onModeChange(value)}
          disabled={disabled}
          className={cn(
            "flex flex-col items-center rounded-xl px-5 py-3 text-sm transition-all",
            mode === value
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <span className="font-medium">{label}</span>
          <span
            className={cn(
              "mt-0.5 text-xs",
              mode === value
                ? "text-indigo-200"
                : "text-slate-400 dark:text-slate-500"
            )}
          >
            {description}
          </span>
        </button>
      ))}
    </div>
  );
}
